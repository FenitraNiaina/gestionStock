// Formatte une date JS en "JJ/MM/AAAA" ou "JJ/MM/AAAA HH:mm"
function formatDate(date, withTime = false) {
    if (!date) return withTime ? "Jamais" : "";

    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, "0");

    const jour = pad(d.getDate());
    const mois = pad(d.getMonth() + 1);
    const annee = d.getFullYear();

    if (!withTime) return `${jour}/${mois}/${annee}`;

    const heures = pad(d.getHours());
    const minutes = pad(d.getMinutes());

    return `${jour}/${mois}/${annee} ${heures}:${minutes}`;
}

// Transforme une ligne SQL (snake_case) en objet attendu par le frontend (camelCase)
// Ne renvoie jamais le mot de passe (même haché).
function toFrontend(row) {
    return {
        id: row.id,
        name: row.nom,
        email: row.email,
        phone: row.telephone || "",
        role: row.role,
        status: row.statut,
        lastLogin: formatDate(row.derniere_connexion, true),
        createdAt: formatDate(row.created_at),
    };
}

module.exports = { formatDate, toFrontend };