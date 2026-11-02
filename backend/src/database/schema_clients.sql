-- À exécuter une fois, connecté à la base "gestion_stock_sfoi"
-- psql -U postgres -d gestion_stock_sfoi -f database/schema_clients.sql

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    telephone VARCHAR(50),
    email VARCHAR(150),
    adresse VARCHAR(255),
    entreprise VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Remarque : le nombre de commandes, le total dépensé et l'historique de commandes
-- ne sont pas stockés ici. Ils sont calculés par jointure avec la table "ventes"
-- ci-dessous (comme le nombre de produits par catégorie/fournisseur), et non dupliqués.

-- Table minimaliste, en attendant le futur module "Ventes" complet.
-- Elle permet dès maintenant de calculer le nombre de commandes, le total
-- dépensé et l'historique d'un client par simple jointure.
CREATE TABLE IF NOT EXISTS ventes (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50) NOT NULL UNIQUE,
    client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    montant NUMERIC(14, 2) NOT NULL DEFAULT 0,
    statut VARCHAR(30) NOT NULL DEFAULT 'Terminée',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);