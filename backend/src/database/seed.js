// Crée un premier administrateur avec un mot de passe correctement haché.
// Usage : node database/seed.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

async function seed() {
    const nom = "Admin Principal";
    const email = "admin@gestionstock.com";
    const telephone = "+261 34 00 000 01";
    const motDePasseClair = "Admin123!"; // à changer après la première connexion

    const hash = await bcrypt.hash(motDePasseClair, 10);

    try {
        const result = await pool.query(
            `INSERT INTO utilisateurs (nom, email, telephone, role, statut, mot_de_passe)
             VALUES ($1, $2, $3, 'Administrateur', 'Actif', $4)
             ON CONFLICT (email) DO NOTHING
             RETURNING id, nom, email`,
            [nom, email, telephone, hash]
        );

        if (result.rows.length > 0) {
            console.log("✅ Admin créé :", result.rows[0]);
            console.log(`   Mot de passe : ${motDePasseClair}`);
        } else {
            console.log("ℹ️  Un utilisateur avec cet email existe déjà, rien à faire.");
        }
    } catch (error) {
        console.error("❌ Erreur lors du seed :", error.message);
    } finally {
        await pool.end();
    }
}

seed();