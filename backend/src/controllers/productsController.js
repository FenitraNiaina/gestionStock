const pool = require("../config/db");
const { toFrontend } = require("../utils/formatProduct");

async function getAllProducts(req, res) {
    try {
        const result = await pool.query(
            "SELECT * FROM produits ORDER BY created_at DESC"
        );

        res.json(result.rows.map(toFrontend));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des produits.",
        });
    }
}

async function createProduct(req, res) {
    try {
        const {
            sku,
            barcode,
            name,
            description,
            category,
            brand,
            unit,
            purchasePrice,
            sellingPrice,
            stock,
            minStock,
            maxStock,
            location,
            supplier,
            image,
            active,
        } = req.body;

        if (!name?.trim() || !sku?.trim()) {
            return res.status(400).json({
                message: "Le nom et la référence (SKU) sont obligatoires.",
            });
        }

        const result = await pool.query(
            `INSERT INTO produits
                (sku, barcode, nom, description, categorie, marque, unite,
                 prix_achat, prix_vente, stock, stock_min, stock_max,
                 emplacement, fournisseur, image, actif)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
             RETURNING *`,
            [
                sku,
                barcode || null,
                name,
                description || null,
                category || null,
                brand || null,
                unit || "Pièce",
                purchasePrice || 0,
                sellingPrice || 0,
                stock || 0,
                minStock || 0,
                maxStock || 0,
                location || null,
                supplier || null,
                image || null,
                active !== undefined ? active : true,
            ]
        );

        res.status(201).json(toFrontend(result.rows[0]));
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "Cette référence (SKU) existe déjà." });
        }

        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la création du produit.",
        });
    }
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const {
            sku,
            barcode,
            name,
            description,
            category,
            brand,
            unit,
            purchasePrice,
            sellingPrice,
            stock,
            minStock,
            maxStock,
            location,
            supplier,
            image,
            active,
        } = req.body;

        if (!name?.trim() || !sku?.trim()) {
            return res.status(400).json({
                message: "Le nom et la référence (SKU) sont obligatoires.",
            });
        }

        const result = await pool.query(
            `UPDATE produits SET
                sku = $1, barcode = $2, nom = $3, description = $4,
                categorie = $5, marque = $6, unite = $7,
                prix_achat = $8, prix_vente = $9, stock = $10,
                stock_min = $11, stock_max = $12, emplacement = $13,
                fournisseur = $14, image = $15, actif = $16,
                updated_at = NOW()
             WHERE id = $17
             RETURNING *`,
            [
                sku,
                barcode || null,
                name,
                description || null,
                category || null,
                brand || null,
                unit || "Pièce",
                purchasePrice || 0,
                sellingPrice || 0,
                stock || 0,
                minStock || 0,
                maxStock || 0,
                location || null,
                supplier || null,
                image || null,
                active !== undefined ? active : true,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Produit introuvable." });
        }

        res.json(toFrontend(result.rows[0]));
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "Cette référence (SKU) existe déjà." });
        }

        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la modification du produit.",
        });
    }
}

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM produits WHERE id = $1 RETURNING id",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Produit introuvable." });
        }

        res.json({ message: "Produit supprimé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la suppression du produit.",
        });
    }
}

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};