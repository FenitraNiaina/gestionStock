-- À exécuter une fois, connecté à la base "gestion_stock_sfoi"
-- psql -U postgres -d gestion_stock_sfoi -f database/schema.sql

CREATE TABLE IF NOT EXISTS utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telephone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'Vendeur'
        CHECK (role IN ('Administrateur', 'Gestionnaire', 'Vendeur', 'Magasinier', 'Consultation')),
    statut VARCHAR(20) NOT NULL DEFAULT 'Actif'
        CHECK (statut IN ('Actif', 'Inactif')),
    mot_de_passe VARCHAR(255) NOT NULL,
    derniere_connexion TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Pour créer un premier administrateur avec un mot de passe correctement haché,
-- lance le script "database/seed.js" (node database/seed.js) après avoir
-- configuré le fichier .env — voir les instructions fournies avec ces fichiers.