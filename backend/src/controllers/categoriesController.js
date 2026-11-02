const pool = require("../config/db");

function toFrontend(row) {
    return {
        id: row.id,
        name: row.nom,
        description: row.description || "",
        products: Number(row.products_count) || 0,
    };
}

async function getAllCategories(req, res) {
    try {
        const result = await pool.query(`
            SELECT c.*, COUNT(p.id) AS products_count
            FROM categories c
            LEFT JOIN produits p ON p.categorie = c.nom
            GROUP BY c.id
            ORDER BY c.nom ASC
        `);

        res.json(result.rows.map(toFrontend));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des catégories.",
        });
    }
}

async function createCategory(req, res) {
    try {
        const { name, description } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                message: "Le nom de la catégorie est obligatoire.",
            });
        }

        const result = await pool.query(
            `INSERT INTO categories (nom, description)
             VALUES ($1, $2)
             RETURNING *`,
            [name, description || null]
        );

        res.status(201).json(toFrontend({ ...result.rows[0], products_count: 0 }));
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Une catégorie porte déjà ce nom.",
            });
        }

        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la création de la catégorie.",
        });
    }
}

async function updateCategory(req, res) {
    const client = await pool.connect();

    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                message: "Le nom de la catégorie est obligatoire.",
            });
        }

        await client.query("BEGIN");

        const existing = await client.query(
            "SELECT * FROM categories WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Catégorie introuvable." });
        }

        const oldName = existing.rows[0].nom;

        const updated = await client.query(
            `UPDATE categories SET nom = $1, description = $2 WHERE id = $3 RETURNING *`,
            [name, description || null, id]
        );

        // Garde les produits existants cohérents avec le nouveau nom de catégorie
        if (oldName !== name) {
            await client.query(
                `UPDATE produits SET categorie = $1 WHERE categorie = $2`,
                [name, oldName]
            );
        }

        const countResult = await client.query(
            "SELECT COUNT(*) FROM produits WHERE categorie = $1",
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
                message: "Une catégorie porte déjà ce nom.",
            });
        }

        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la modification de la catégorie.",
        });
    } finally {
        client.release();
    }
}

async function deleteCategory(req, res) {
    try {
        const { id } = req.params;

        const category = await pool.query(
            "SELECT * FROM categories WHERE id = $1",
            [id]
        );

        if (category.rows.length === 0) {
            return res.status(404).json({ message: "Catégorie introuvable." });
        }

        const countResult = await pool.query(
            "SELECT COUNT(*) FROM produits WHERE categorie = $1",
            [category.rows[0].nom]
        );

        if (parseInt(countResult.rows[0].count, 10) > 0) {
            return res.status(400).json({
                message:
                    "Impossible de supprimer cette catégorie car elle contient des produits.",
            });
        }

        await pool.query("DELETE FROM categories WHERE id = $1", [id]);

        res.json({ message: "Catégorie supprimée avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la suppression de la catégorie.",
        });
    }
}

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};