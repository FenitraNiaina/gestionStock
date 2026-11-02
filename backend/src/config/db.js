const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "gestion_stock_sfoi",
});

pool.on("error", (err) => {
    console.error("❌ Erreur inattendue du pool PostgreSQL :", err);
});

pool.connect()
    .then((client) => {
        console.log("✅ Connecté à PostgreSQL (" + (process.env.DB_NAME || "gestion_stock_sfoi") + ")");
        client.release();
    })
    .catch((err) => {
        console.error("❌ Impossible de se connecter à PostgreSQL :", err.message);
    });

module.exports = pool;