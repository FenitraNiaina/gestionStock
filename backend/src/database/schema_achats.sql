-- À exécuter une fois, connecté à la base "gestion_stock_sfoi"
-- psql -U postgres -d gestion_stock_sfoi -f database/schema_achats.sql

CREATE TABLE IF NOT EXISTS achats (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) NOT NULL UNIQUE,
    fournisseur_id INTEGER NOT NULL REFERENCES fournisseurs(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    remise NUMERIC(14, 2) NOT NULL DEFAULT 0,
    taxe NUMERIC(14, 2) NOT NULL DEFAULT 0,
    statut VARCHAR(30) NOT NULL DEFAULT 'Brouillon'
        CHECK (statut IN ('Brouillon', 'Commandé', 'Reçu', 'Annulé')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achat_lignes (
    id SERIAL PRIMARY KEY,
    achat_id INTEGER NOT NULL REFERENCES achats(id) ON DELETE CASCADE,
    produit_id INTEGER NOT NULL REFERENCES produits(id),
    quantite INTEGER NOT NULL CHECK (quantite > 0),
    prix_unitaire NUMERIC(14, 2) NOT NULL DEFAULT 0
);