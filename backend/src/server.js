const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db"); // initialise et teste la connexion PostgreSQL

const usersRoutes = require("./routes/usersRoutes");
const authRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/productsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const suppliersRoutes = require("./routes/suppliersRoutes");
const customersRoutes = require("./routes/customersRoutes");
const purchasesRoutes = require("./routes/purchasesRoutes");
const salesRoutes = require("./routes/salesRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
    res.json({
        message: "API GestionStock opérationnelle",
    });
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend Node.js fonctionne correctement",
    });
});

// Routes utilisateurs
app.use("/api/users", usersRoutes);

// Routes authentification
app.use("/api/auth", authRoutes);

// Routes produits
app.use("/api/products", productsRoutes);

// Routes catégories
app.use("/api/categories", categoriesRoutes);

// Routes fournisseurs
app.use("/api/suppliers", suppliersRoutes);

// Routes clients
app.use("/api/customers", customersRoutes);

// Routes achats
app.use("/api/purchases", purchasesRoutes);

// Routes ventes
app.use("/api/sales", salesRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});