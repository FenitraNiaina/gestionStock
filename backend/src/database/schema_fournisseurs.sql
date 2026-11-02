-- À exécuter une fois, connecté à la base "gestion_stock_sfoi"
-- psql -U postgres -d gestion_stock_sfoi -f database/schema_fournisseurs.sql

CREATE TABLE IF NOT EXISTS fournisseurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL UNIQUE,
    entreprise VARCHAR(200),
    email VARCHAR(150),
    telephone VARCHAR(50),
    adresse TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Reprend les fournisseurs de démonstration utilisés jusqu'ici côté frontend
INSERT INTO fournisseurs (nom, entreprise)
VALUES
    ('ABC Distribution', 'ABC Distribution SARL'),
    ('Tech Madagascar', 'Tech Madagascar'),
    ('Mada Fournitures', 'Mada Fournitures')
ON CONFLICT (nom) DO NOTHING;