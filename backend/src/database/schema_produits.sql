-- À exécuter une fois, connecté à la base "gestion_stock_sfoi"
-- psql -U postgres -d gestion_stock_sfoi -f database/schema_produits.sql
 
CREATE TABLE IF NOT EXISTS produits (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    barcode VARCHAR(50),
    nom VARCHAR(200) NOT NULL,
    description TEXT,
    categorie VARCHAR(100),
    marque VARCHAR(100),
    unite VARCHAR(50) NOT NULL DEFAULT 'Pièce',
    prix_achat NUMERIC(12, 2) NOT NULL DEFAULT 0,
    prix_vente NUMERIC(12, 2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    stock_min INTEGER NOT NULL DEFAULT 0,
    stock_max INTEGER NOT NULL DEFAULT 0,
    emplacement VARCHAR(150),
    fournisseur VARCHAR(150),
    image TEXT,
    actif BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);