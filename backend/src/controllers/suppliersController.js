const pool = require("../config/db");

function toFrontend(row) {
    return {
        id: row.id,
        name: row.nom,
        company: row.entreprise || "",
        email: row.email || "",
        phone: row.telephone || "",
        address: row.adresse || "",
        products: Number(row.products_count) || 0,
    };
}

async function getAllSuppliers(req, res) {
    try {
        const result = await pool.query(`
            SELECT f.*, COUNT(p.id) AS products_count
            FROM fournisseurs f
            LEFT JOIN produits p ON p.fournisseur = f.nom
            GROUP BY f.id
            ORDER BY f.nom ASC
        `);

        res.json(result.rows.map(toFrontend));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des fournisseurs.",
        });
    }
}

async function createSupplier(req, res) {
    try {
        const { name, company, email, phone, address } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                message: "Le nom du fournisseur est obligatoire.",
            });
        }

        const result = await pool.query(
            `INSERT INTO fournisseurs (nom, entreprise, email, telephone, adresse)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [name, company || null, email || null, phone || null, address || null]
        );

        res.status(201).json(toFrontend({ ...result.rows[0], products_count: 0 }));
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Un fournisseur porte déjà ce nom.",
            });
        }

        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la création du fournisseur.",
        });
    }
}

async function updateSupplier(req, res) {
    const client = await pool.connect();

    try {
        const { id } = req.params;
        const { name, company, email, phone, address } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                message: "Le nom du fournisseur est obligatoire.",
            });
        }

        await client.query("BEGIN");

        const existing = await client.query(
            "SELECT * FROM fournisseurs WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Fournisseur introuvable." });
        }

        const oldName = existing.rows[0].nom;

        const updated = await client.query(
            `UPDATE fournisseurs
             SET nom = $1, entreprise = $2, email = $3, telephone = $4, adresse = $5
             WHERE id = $6
             RETURNING *`,
            [name, company || null, email || null, phone || null, address || null, id]
        );

        // Garde les produits existants cohérents avec le nouveau nom de fournisseur
        if (oldName !== name) {
            await client.query(
                `UPDATE produits SET fournisseur = $1 WHERE fournisseur = $2`,
                [name, oldName]
            );
        }

        const countResult = await client.query(
            "SELECT COUNT(*) FROM produits WHERE fournisseur = $1",
            [name]
        );

        await client.query("COMMIT");

        res.json(
            toFrontend({
                ...updated.rows[0],
                products_count: countResult.rows[0].count,
            })
        );
    } catch (error) {
        await client.query("ROLLBACK");

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Un fournisseur porte déjà ce nom.",
            });
        }

        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la modification du fournisseur.",
        });
    } finally {
        client.release();
    }
}

async function deleteSupplier(req, res) {
    try {
        const { id } = req.params;

        const supplier = await pool.query(
            "SELECT * FROM fournisseurs WHERE id = $1",
            [id]
        );

        if (supplier.rows.length === 0) {
            return res.status(404).json({ message: "Fournisseur introuvable." });
        }

        const countResult = await pool.query(
            "SELECT COUNT(*) FROM produits WHERE fournisseur = $1",
            [supplier.rows[0].nom]
        );

        if (parseInt(countResult.rows[0].count, 10) > 0) {
            return res.status(400).json({
                message:
                    "Impossible de supprimer ce fournisseur car il est associé à des produits.",
            });
        }

        await pool.query("DELETE FROM fournisseurs WHERE id = $1", [id]);

        res.json({ message: "Fournisseur supprimé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la suppression du fournisseur.",
        });
    }
}

module.exports = {
    getAllSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};