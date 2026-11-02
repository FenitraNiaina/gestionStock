const pool = require("../config/db");

// totalSpent / ordersCount / lastOrder / orders sont calculés par jointure avec
// la table "ventes". Tant qu'aucune vente n'existe pour un client, ces valeurs
// restent neutres (0, null, []) sans qu'on ait besoin de changer ce code plus tard.
function toFrontend(row) {
    return {
        id: row.id,
        name: row.nom,
        phone: row.telephone || "",
        email: row.email || "",
        address: row.adresse || "",
        company: row.entreprise || "",
        notes: row.notes || "",
        totalSpent: Number(row.total_spent) || 0,
        ordersCount: Number(row.orders_count) || 0,
        lastOrder: row.last_order
            ? new Date(row.last_order).toISOString().split("T")[0]
            : null,
        orders: row.orders || [],
    };
}

const SELECT_WITH_STATS = `
    SELECT
        c.*,
        COUNT(v.id) AS orders_count,
        COALESCE(SUM(v.montant), 0) AS total_spent,
        MAX(v.date) AS last_order,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', v.numero,
                    'date', v.date,
                    'amount', v.montant,
                    'status', v.statut
                )
                ORDER BY v.date DESC
            ) FILTER (WHERE v.id IS NOT NULL),
            '[]'
        ) AS orders
    FROM clients c
    LEFT JOIN ventes v ON v.client_id = c.id
    GROUP BY c.id
`;

async function getAllCustomers(req, res) {
    try {
        const result = await pool.query(
            `${SELECT_WITH_STATS} ORDER BY c.nom ASC`
        );

        res.json(result.rows.map(toFrontend));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des clients.",
        });
    }
}

async function createCustomer(req, res) {
    try {
        const { name, phone, email, address, company, notes } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                message: "Le nom du client est obligatoire.",
            });
        }

        const result = await pool.query(
            `INSERT INTO clients (nom, telephone, email, adresse, entreprise, notes)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [name, phone || null, email || null, address || null, company || null, notes || null]
        );

        res.status(201).json(
            toFrontend({
                ...result.rows[0],
                orders_count: 0,
                total_spent: 0,
                last_order: null,
                orders: [],
            })
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la création du client.",
        });
    }
}

async function updateCustomer(req, res) {
    try {
        const { id } = req.params;
        const { name, phone, email, address, company, notes } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                message: "Le nom du client est obligatoire.",
            });
        }

        const updateResult = await pool.query(
            `UPDATE clients
             SET nom = $1, telephone = $2, email = $3, adresse = $4, entreprise = $5, notes = $6
             WHERE id = $7
             RETURNING id`,
            [name, phone || null, email || null, address || null, company || null, notes || null, id]
        );

        if (updateResult.rows.length === 0) {
            return res.status(404).json({ message: "Client introuvable." });
        }

        const result = await pool.query(
            `${SELECT_WITH_STATS} HAVING c.id = $1`,
            [id]
        );

        res.json(toFrontend(result.rows[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la modification du client.",
        });
    }
}

async function deleteCustomer(req, res) {
    try {
        const { id } = req.params;

        // Les ventes existantes sont conservées (client_id passe à NULL grâce à
        // ON DELETE SET NULL) : on ne perd pas l'historique de chiffre d'affaires.
        const result = await pool.query(
            "DELETE FROM clients WHERE id = $1 RETURNING id",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Client introuvable." });
        }

        res.json({ message: "Client supprimé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la suppression du client.",
        });
    }
}

module.exports = {
    getAllCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};