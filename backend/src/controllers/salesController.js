const pool = require("../config/db");

function toFrontend(row) {
    return {
        id: row.id,
        number: row.numero,
        customerId: row.client_id,
        customerName: row.client_nom,
        customerPhone: row.client_telephone || "",
        customerEmail: row.client_email || "",
        customerAddress: row.client_adresse || "",
        date: row.date ? new Date(row.date).toISOString().split("T")[0] : "",
        discount: Number(row.remise) || 0,
        tax: Number(row.taxe) || 0,
        paymentMethod: row.mode_paiement,
        user: row.utilisateur || "",
        status: row.statut,
        validated: row.statut === "Validée",
        products: row.lignes || [],
    };
}

const SELECT_WITH_LINES = `
    SELECT
        v.*,
        c.nom AS client_nom,
        c.telephone AS client_telephone,
        c.email AS client_email,
        c.adresse AS client_adresse,
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
    FROM ventes v
    JOIN clients c ON c.id = v.client_id
    LEFT JOIN vente_lignes l ON l.vente_id = v.id
    LEFT JOIN produits p ON p.id = l.produit_id
    GROUP BY v.id, c.nom, c.telephone, c.email, c.adresse
`;

function computeTotal(discount, tax, products) {
    const subtotal = products.reduce(
        (total, p) => total + Number(p.quantity) * Number(p.unitPrice),
        0
    );
    return subtotal - Number(discount || 0) + Number(tax || 0);
}

function validateSaleBody(body) {
    const { customerId, date, products } = body;

    if (!customerId) return "Veuillez sélectionner un client.";
    if (!date) return "Veuillez sélectionner une date.";
    if (!Array.isArray(products) || products.length === 0) {
        return "Ajoutez au moins un produit à la vente.";
    }

    const invalid = products.some(
        (p) => !p.productId || Number(p.quantity) <= 0 || Number(p.unitPrice) < 0
    );

    if (invalid) return "Vérifiez les produits, quantités et prix.";

    return null;
}

// Vérifie le stock disponible (avec verrou de ligne) et décrémente.
// Doit être appelée à l'intérieur d'une transaction déjà ouverte (client).
async function decreaseStockOrThrow(client, products) {
    for (const line of products) {
        const result = await client.query(
            "SELECT nom, stock FROM produits WHERE id = $1 FOR UPDATE",
            [line.productId]
        );

        if (result.rows.length === 0) {
            throw new Error("Un produit sélectionné n'existe plus.");
        }

        const { nom, stock } = result.rows[0];

        if (Number(line.quantity) > stock) {
            throw new Error(
                `Stock insuffisant pour "${nom}". Stock disponible : ${stock}, quantité demandée : ${line.quantity}.`
            );
        }
    }

    for (const line of products) {
        await client.query(
            "UPDATE produits SET stock = stock - $1, updated_at = NOW() WHERE id = $2",
            [line.quantity, line.productId]
        );
    }
}

async function getAllSales(req, res) {
    try {
        const result = await pool.query(
            `${SELECT_WITH_LINES} ORDER BY v.created_at DESC`
        );

        res.json(result.rows.map(toFrontend));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des ventes.",
        });
    }
}

async function createSale(req, res) {
    const client = await pool.connect();

    try {
        const error = validateSaleBody(req.body);
        if (error) return res.status(400).json({ message: error });

        const {
            customerId,
            date,
            discount,
            tax,
            paymentMethod,
            user,
            status,
            products,
        } = req.body;

        await client.query("BEGIN");

        if (status === "Validée") {
            await decreaseStockOrThrow(client, products);
        }

        const montant = computeTotal(discount, tax, products);

        const inserted = await client.query(
            `INSERT INTO ventes
                (numero, client_id, date, remise, taxe, mode_paiement, utilisateur, statut, montant)
             VALUES ('TEMP', $1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id`,
            [
                customerId,
                date,
                discount || 0,
                tax || 0,
                paymentMethod || "Espèces",
                user || "Admin",
                status || "Brouillon",
                montant,
            ]
        );

        const id = inserted.rows[0].id;
        const numero = `FAC-${new Date(date).getFullYear()}-${String(id).padStart(4, "0")}`;

        await client.query("UPDATE ventes SET numero = $1 WHERE id = $2", [numero, id]);

        for (const line of products) {
            await client.query(
                `INSERT INTO vente_lignes (vente_id, produit_id, quantite, prix_unitaire)
                 VALUES ($1, $2, $3, $4)`,
                [id, line.productId, line.quantity, line.unitPrice]
            );
        }

        await client.query("COMMIT");

        const result = await pool.query(`${SELECT_WITH_LINES} HAVING v.id = $1`, [id]);
        res.status(201).json(toFrontend(result.rows[0]));
    } catch (error) {
        await client.query("ROLLBACK");

        if (error.message?.startsWith("Stock insuffisant") || error.message?.includes("n'existe plus")) {
            return res.status(400).json({ message: error.message });
        }

        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la création de la vente.",
        });
    } finally {
        client.release();
    }
}

async function updateSale(req, res) {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        const error = validateSaleBody(req.body);
        if (error) return res.status(400).json({ message: error });

        const {
            customerId,
            date,
            discount,
            tax,
            paymentMethod,
            user,
            status,
            products,
        } = req.body;

        await client.query("BEGIN");

        const existing = await client.query(
            "SELECT statut FROM ventes WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Vente introuvable." });
        }

        const previousStatus = existing.rows[0].statut;

        if (previousStatus === "Validée") {
            await client.query("ROLLBACK");
            return res.status(400).json({
                message: "Une vente déjà validée ne peut plus être modifiée.",
            });
        }

        // Elle n'était pas validée, mais le passe maintenant à "Validée" :
        // il faut vérifier et décrémenter le stock.
        if (previousStatus !== "Validée" && status === "Validée") {
            await decreaseStockOrThrow(client, products);
        }

        const montant = computeTotal(discount, tax, products);

        await client.query(
            `UPDATE ventes
             SET client_id = $1, date = $2, remise = $3, taxe = $4,
                 mode_paiement = $5, utilisateur = $6, statut = $7, montant = $8
             WHERE id = $9`,
            [
                customerId,
                date,
                discount || 0,
                tax || 0,
                paymentMethod || "Espèces",
                user || "Admin",
                status || "Brouillon",
                montant,
                id,
            ]
        );

        await client.query("DELETE FROM vente_lignes WHERE vente_id = $1", [id]);

        for (const line of products) {
            await client.query(
                `INSERT INTO vente_lignes (vente_id, produit_id, quantite, prix_unitaire)
                 VALUES ($1, $2, $3, $4)`,
                [id, line.productId, line.quantity, line.unitPrice]
            );
        }

        await client.query("COMMIT");

        const result = await pool.query(`${SELECT_WITH_LINES} HAVING v.id = $1`, [id]);
        res.json(toFrontend(result.rows[0]));
    } catch (error) {
        await client.query("ROLLBACK");

        if (error.message?.startsWith("Stock insuffisant") || error.message?.includes("n'existe plus")) {
            return res.status(400).json({ message: error.message });
        }

        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la modification de la vente.",
        });
    } finally {
        client.release();
    }
}

async function deleteSale(req, res) {
    try {
        const { id } = req.params;

        const existing = await pool.query(
            "SELECT statut, numero FROM ventes WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Vente introuvable." });
        }

        if (existing.rows[0].statut === "Validée") {
            return res.status(400).json({
                message: "Une vente validée ne peut pas être supprimée.",
            });
        }

        await pool.query("DELETE FROM ventes WHERE id = $1", [id]);

        res.json({ message: `Vente ${existing.rows[0].numero} supprimée avec succès.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la suppression de la vente.",
        });
    }
}

// Valide la vente ET diminue réellement le stock des produits concernés.
async function validateSale(req, res) {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        await client.query("BEGIN");

        const existing = await client.query(
            "SELECT statut FROM ventes WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Vente introuvable." });
        }

        const currentStatus = existing.rows[0].statut;

        if (currentStatus === "Validée") {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "Cette vente est déjà validée." });
        }

        if (currentStatus === "Annulée") {
            await client.query("ROLLBACK");
            return res
                .status(400)
                .json({ message: "Une vente annulée ne peut pas être validée." });
        }

        const lines = await client.query(
            "SELECT produit_id AS \"productId\", quantite AS quantity FROM vente_lignes WHERE vente_id = $1",
            [id]
        );

        await decreaseStockOrThrow(client, lines.rows);

        await client.query("UPDATE ventes SET statut = 'Validée' WHERE id = $1", [id]);

        await client.query("COMMIT");

        const result = await pool.query(`${SELECT_WITH_LINES} HAVING v.id = $1`, [id]);
        res.json(toFrontend(result.rows[0]));
    } catch (error) {
        await client.query("ROLLBACK");

        if (error.message?.startsWith("Stock insuffisant") || error.message?.includes("n'existe plus")) {
            return res.status(400).json({ message: error.message });
        }

        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la validation de la vente.",
        });
    } finally {
        client.release();
    }
}

// Annule une vente non validée (aucun stock n'a encore été retiré).
async function cancelSale(req, res) {
    try {
        const { id } = req.params;

        const existing = await pool.query(
            "SELECT statut FROM ventes WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Vente introuvable." });
        }

        if (existing.rows[0].statut === "Validée") {
            return res.status(400).json({
                message: "Une vente déjà validée ne peut pas être annulée depuis cette interface.",
            });
        }

        await pool.query("UPDATE ventes SET statut = 'Annulée' WHERE id = $1", [id]);

        const result = await pool.query(`${SELECT_WITH_LINES} HAVING v.id = $1`, [id]);
        res.json(toFrontend(result.rows[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de l'annulation de la vente.",
        });
    }
}

module.exports = {
    getAllSales,
    createSale,
    updateSale,
    deleteSale,
    validateSale,
    cancelSale,
};