const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { toFrontend } = require("../utils/formatUser");

async function getAllUsers(req, res) {
    try {
        const result = await pool.query(
            "SELECT * FROM utilisateurs ORDER BY created_at DESC"
        );

        res.json(result.rows.map(toFrontend));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des utilisateurs." });
    }
}

async function createUser(req, res) {
    try {
        const { name, email, phone, role, status, password } = req.body;

        if (!name?.trim() || !email?.trim()) {
            return res.status(400).json({ message: "Le nom et l'email sont obligatoires." });
        }

        if (!password?.trim()) {
            return res.status(400).json({ message: "Le mot de passe est obligatoire." });
        }

        const hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO utilisateurs (nom, email, telephone, role, statut, mot_de_passe)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [name, email, phone || null, role || "Vendeur", status || "Actif", hash]
        );

        res.status(201).json(toFrontend(result.rows[0]));
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "Cet email est déjà utilisé." });
        }

        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la création de l'utilisateur." });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { name, email, phone, role, status, password } = req.body;

        if (!name?.trim() || !email?.trim()) {
            return res.status(400).json({ message: "Le nom et l'email sont obligatoires." });
        }

        let query = `
            UPDATE utilisateurs
            SET nom = $1, email = $2, telephone = $3, role = $4, statut = $5
        `;
        const params = [name, email, phone || null, role, status];

        if (password?.trim()) {
            const hash = await bcrypt.hash(password, 10);
            query += `, mot_de_passe = $6 WHERE id = $7 RETURNING *`;
            params.push(hash, id);
        } else {
            query += ` WHERE id = $6 RETURNING *`;
            params.push(id);
        }

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        res.json(toFrontend(result.rows[0]));
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "Cet email est déjà utilisé." });
        }

        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la modification de l'utilisateur." });
    }
}

async function toggleStatus(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE utilisateurs
             SET statut = CASE WHEN statut = 'Actif' THEN 'Inactif' ELSE 'Actif' END
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        res.json(toFrontend(result.rows[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors du changement de statut." });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const target = await pool.query("SELECT * FROM utilisateurs WHERE id = $1", [id]);

        if (target.rows.length === 0) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        if (target.rows[0].role === "Administrateur") {
            const adminCount = await pool.query(
                "SELECT COUNT(*) FROM utilisateurs WHERE role = 'Administrateur'"
            );

            if (parseInt(adminCount.rows[0].count, 10) <= 1) {
                return res.status(400).json({
                    message: "Impossible de supprimer le dernier administrateur.",
                });
            }
        }

        await pool.query("DELETE FROM utilisateurs WHERE id = $1", [id]);

        res.json({ message: "Utilisateur supprimé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la suppression de l'utilisateur." });
    }
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    toggleStatus,
    deleteUser,
};