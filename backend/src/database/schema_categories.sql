-- À exécuter une fois, connecté à la base "gestion_stock_sfoi"
-- psql -U postgres -d gestion_stock_sfoi -f database/schema_categories.sql

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Optionnel : reprend les catégories déjà utilisées dans la table produits
-- (à lancer seulement si tu as déjà des produits en base et pas encore de catégories).
INSERT INTO categories (nom)
SELECT DISTINCT categorie FROM produits
WHERE categorie IS NOT NULL AND categorie <> ''
ON CONFLICT (nom) DO NOTHING;