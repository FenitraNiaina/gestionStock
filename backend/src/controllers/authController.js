const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { toFrontend } = require("../utils/formatUser");

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: "Email et mot de passe requis." });
        }

        const result = await pool.query(
            "SELECT * FROM utilisateurs WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        const user = result.rows[0];

        if (user.statut !== "Actif") {
            return res.status(403).json({ message: "Ce compte a été désactivé." });
        }

        const passwordMatches = await bcrypt.compare(password, user.mot_de_passe);

        if (!passwordMatches) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        const updated = await pool.query(
            `UPDATE utilisateurs SET derniere_connexion = NOW()
             WHERE id = $1
             RETURNING *`,
            [user.id]
        );

        res.json(toFrontend(updated.rows[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la connexion." });
    }
}

module.exports = { login };