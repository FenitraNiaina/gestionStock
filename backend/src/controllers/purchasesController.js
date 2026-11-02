const pool = require("../config/db");

function toFrontend(row) {
    return {
        id: row.id,
        number: row.numero,
        supplierId: row.fournisseur_id,
        supplierName: row.fournisseur_nom,
        date: row.date ? new Date(row.date).toISOString().split("T")[0] : "",
        discount: Number(row.remise) || 0,
        tax: Number(row.taxe) || 0,
        status: row.statut,
        received: row.statut === "Reçu",
        products: row.lignes || [],
    };
}

const SELECT_WITH_LINES = `
    SELECT
        a.*,
        f.nom AS fournisseur_nom,
        COALESCE(
            json_agg(
                json_build_object(
                    'productId', l.produit_id,
                    'productName', p.nom,
                    'quantity', l.quantite,
                    'unitPrice', l.prix_unitaire
                )
                ORDER BY l.id
            ) FILTER (WHERE l.id IS NOT NULL),
            '[]'
        ) AS lignes
    FROM achats a
    JOIN fournisseurs f ON f.id = a.fournisseur_id
    LEFT JOIN achat_lignes l ON l.achat_id = a.id
    LEFT JOIN produits p ON p.id = l.produit_id
    GROUP BY a.id, f.nom
`;

async function getAllPurchases(req, res) {
    try {
        const result = await pool.query(
            `${SELECT_WITH_LINES} ORDER BY a.created_at DESC`
        );

        res.json(result.rows.map(toFrontend));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des achats.",
        });
    }
}

function validatePurchaseBody(body) {
    const { supplierId, date, products } = body;

    if (!supplierId) return "Veuillez sélectionner un fournisseur.";
    if (!date) return "Veuillez sélectionner une date.";
    if (!Array.isArray(products) || products.length === 0) {
        return "Ajoutez au moins un produit à l'achat.";
    }

    const invalid = products.some(
        (p) => !p.productId || Number(p.quantity) <= 0 || Number(p.unitPrice) < 0
    );

    if (invalid) return "Vérifiez les produits, quantités et prix unitaires.";

    return null;
}

async function createPurchase(req, res) {
    const client = await pool.connect();

    try {
        const error = validatePurchaseBody(req.body);
        if (error) return res.status(400).json({ message: error });

        const { supplierId, date, discount, tax, status, products } = req.body;

        await client.query("BEGIN");

        const inserted = await client.query(
            `INSERT INTO achats (numero, fournisseur_id, date, remise, taxe, statut)
             VALUES ('TEMP', $1, $2, $3, $4, $5)
             RETURNING id`,
            [supplierId, date, discount || 0, tax || 0, status || "Brouillon"]
        );

        const id = inserted.rows[0].id;

        const numero = `ACH-${new Date(date).getFullYear()}-${String(id).padStart(4, "0")}`;

        await client.query("UPDATE achats SET numero = $1 WHERE id = $2", [
            numero,
            id,
        ]);

        for (const line of products) {
            await client.query(
                `INSERT INTO achat_lignes (achat_id, produit_id, quantite, prix_unitaire)
                 VALUES ($1, $2, $3, $4)`,
                [id, line.productId, line.quantity, line.unitPrice]
            );
        }

        await client.query("COMMIT");

        const result = await pool.query(`${SELECT_WITH_LINES} HAVING a.id = $1`, [
            id,
        ]);

        res.status(201).json(toFrontend(result.rows[0]));
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la création de l'achat.",
        });
    } finally {
        client.release();
    }
}

async function updatePurchase(req, res) {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        const error = validatePurchaseBody(req.body);
        if (error) return res.status(400).json({ message: error });

        const { supplierId, date, discount, tax, status, products } = req.body;

        await client.query("BEGIN");

        const existing = await client.query(
            "SELECT statut FROM achats WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Achat introuvable." });
        }

        if (existing.rows[0].statut === "Reçu") {
            await client.query("ROLLBACK");
            return res.status(400).json({
                message: "Un achat déjà reçu ne peut plus être modifié.",
            });
        }

        await client.query(
            `UPDATE achats
             SET fournisseur_id = $1, date = $2, remise = $3, taxe = $4, statut = $5
             WHERE id = $6`,
            [supplierId, date, discount || 0, tax || 0, status || "Brouillon", id]
        );

        await client.query("DELETE FROM achat_lignes WHERE achat_id = $1", [id]);

        for (const line of products) {
            await client.query(
                `INSERT INTO achat_lignes (achat_id, produit_id, quantite, prix_unitaire)
                 VALUES ($1, $2, $3, $4)`,
                [id, line.productId, line.quantity, line.unitPrice]
            );
        }

        await client.query("COMMIT");

        const result = await pool.query(`${SELECT_WITH_LINES} HAVING a.id = $1`, [
            id,
        ]);

        res.json(toFrontend(result.rows[0]));
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la modification de l'achat.",
        });
    } finally {
        client.release();
    }
}

async function deletePurchase(req, res) {
    try {
        const { id } = req.params;

        const existing = await pool.query(
            "SELECT statut, numero FROM achats WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Achat introuvable." });
        }

        if (existing.rows[0].statut === "Reçu") {
            return res.status(400).json({
                message: "Un achat reçu ne peut pas être supprimé.",
            });
        }

        await pool.query("DELETE FROM achats WHERE id = $1", [id]);

        res.json({ message: `Achat ${existing.rows[0].numero} supprimé avec succès.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la suppression de l'achat.",
        });
    }
}

// Reçoit l'achat ET augmente réellement le stock des produits concernés.
async function receivePurchase(req, res) {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        await client.query("BEGIN");

        const existing = await client.query(
            "SELECT statut FROM achats WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Achat introuvable." });
        }

        const currentStatus = existing.rows[0].statut;

        if (currentStatus === "Reçu") {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "Cet achat a déjà été reçu." });
        }

        if (currentStatus === "Annulé") {
            await client.query("ROLLBACK");
            return res
                .status(400)
                .json({ message: "Un achat annulé ne peut pas être reçu." });
        }

        const lines = await client.query(
            "SELECT produit_id, quantite FROM achat_lignes WHERE achat_id = $1",
            [id]
        );

        for (const line of lines.rows) {
            await client.query(
                "UPDATE produits SET stock = stock + $1, updated_at = NOW() WHERE id = $2",
                [line.quantite, line.produit_id]
            );
        }

        await client.query(
            "UPDATE achats SET statut = 'Reçu' WHERE id = $1",
            [id]
        );

        await client.query("COMMIT");

        const result = await pool.query(`${SELECT_WITH_LINES} HAVING a.id = $1`, [
            id,
        ]);

        res.json(toFrontend(result.rows[0]));
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la réception de l'achat.",
        });
    } finally {
        client.release();
    }
}

async function changeStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const existing = await pool.query(
            "SELECT statut FROM achats WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Achat introuvable." });
        }

        if (["Reçu", "Annulé"].includes(existing.rows[0].statut)) {
            return res.status(400).json({
                message: "Le statut de cet achat ne peut plus être modifié.",
            });
        }

        if (status === "Reçu") {
            return res.status(400).json({
                message: "Utilisez l'action « Recevoir » pour ce statut.",
            });
        }

        await pool.query("UPDATE achats SET statut = $1 WHERE id = $2", [
            status,
            id,
        ]);

        const result = await pool.query(`${SELECT_WITH_LINES} HAVING a.id = $1`, [
            id,
        ]);

        res.json(toFrontend(result.rows[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors du changement de statut.",
        });
    }
}

module.exports = {
    getAllPurchases,
    createPurchase,
    updatePurchase,
    deletePurchase,
    receivePurchase,
    changeStatus,
};