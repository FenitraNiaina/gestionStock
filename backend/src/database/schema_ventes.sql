-- À exécuter une fois, connecté à la base "gestion_stock_sfoi"
-- psql -U postgres -d gestion_stock_sfoi -f database/schema_ventes.sql
--
-- Complète la table "ventes" créée dans schema_clients.sql (qui ne servait
-- jusqu'ici qu'à calculer les statistiques clients) pour en faire une vraie
-- table de ventes, avec ses lignes de produits.

ALTER TABLE ventes ADD COLUMN IF NOT EXISTS remise NUMERIC(14, 2) NOT NULL DEFAULT 0;
ALTER TABLE ventes ADD COLUMN IF NOT EXISTS taxe NUMERIC(14, 2) NOT NULL DEFAULT 0;
ALTER TABLE ventes ADD COLUMN IF NOT EXISTS mode_paiement VARCHAR(30) NOT NULL DEFAULT 'Espèces';
ALTER TABLE ventes ADD COLUMN IF NOT EXISTS utilisateur VARCHAR(100);

ALTER TABLE ventes ALTER COLUMN statut SET DEFAULT 'Brouillon';

ALTER TABLE ventes DROP CONSTRAINT IF EXISTS ventes_statut_check;
ALTER TABLE ventes ADD CONSTRAINT ventes_statut_check
    CHECK (statut IN ('Brouillon', 'En attente', 'Validée', 'Annulée'));

CREATE TABLE IF NOT EXISTS vente_lignes (
    id SERIAL PRIMARY KEY,
    vente_id INTEGER NOT NULL REFERENCES ventes(id) ON DELETE CASCADE,
    produit_id INTEGER NOT NULL REFERENCES produits(id),
    quantite INTEGER NOT NULL CHECK (quantite > 0),
    prix_unitaire NUMERIC(14, 2) NOT NULL DEFAULT 0
);