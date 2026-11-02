// Formatte une date JS en "AAAA-MM-JJ" (même format que les données mock du frontend)
function formatDate(date) {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
}

// Transforme une ligne SQL (snake_case) en objet attendu par le frontend (camelCase)
function toFrontend(row) {
    return {
        id: row.id,
        sku: row.sku,
        barcode: row.barcode || "",
        name: row.nom,
        description: row.description || "",
        category: row.categorie || "",
        brand: row.marque || "",
        unit: row.unite,
        purchasePrice: Number(row.prix_achat),
        sellingPrice: Number(row.prix_vente),
        stock: row.stock,
        minStock: row.stock_min,
        maxStock: row.stock_max,
        location: row.emplacement || "",
        supplier: row.fournisseur || "",
        image: row.image || "",
        active: row.actif,
        createdAt: formatDate(row.created_at),
        updatedAt: formatDate(row.updated_at),
    };
}

module.exports = { formatDate, toFrontend };