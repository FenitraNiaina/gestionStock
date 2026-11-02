import { useMemo, useState } from "react";

import {
    Search,
    History as HistoryIcon,
    User,
    Calendar,
    Clock,
    Eye,
    X,
    LogIn,
    Plus,
    Pencil,
    Trash2,
    ShoppingCart,
    PackageCheck,
    ArrowLeftRight,
    Settings2,
    Filter,
    ChevronLeft,
    ChevronRight,
    Activity,
} from "lucide-react";

const initialHistory = [
    {
        id: 1,
        user: "Admin",
        action: "Connexion",
        type: "connexion",
        element: "Compte administrateur",
        elementType: "Utilisateur",
        date: "2026-09-14",
        time: "08:15:32",
        description: "Connexion réussie au tableau de bord.",
    },
    {
        id: 2,
        user: "Admin",
        action: "Création",
        type: "creation",
        element: "Ordinateur HP",
        elementType: "Produit",
        date: "2026-09-14",
        time: "08:32:14",
        description: "Création d'un nouveau produit.",
    },
    {
        id: 3,
        user: "Admin",
        action: "Modification",
        type: "modification",
        element: "Souris sans fil",
        elementType: "Produit",
        date: "2026-09-14",
        time: "08:45:21",
        description: "Modification du prix de vente du produit.",
    },
    {
        id: 4,
        user: "Manager",
        action: "Vente",
        type: "vente",
        element: "FAC-2026-005",
        elementType: "Facture",
        date: "2026-09-14",
        time: "09:05:48",
        description: "Vente validée pour le client Paul Andrianina.",
    },
    {
        id: 5,
        user: "Manager",
        action: "Mouvement de stock",
        type: "stock",
        element: "Ordinateur HP",
        elementType: "Stock",
        date: "2026-09-14",
        time: "09:06:03",
        description: "Sortie de 2 unités suite à une vente.",
    },
    {
        id: 6,
        user: "Admin",
        action: "Achat",
        type: "achat",
        element: "ACH-2026-008",
        elementType: "Commande d'achat",
        date: "2026-09-14",
        time: "09:20:17",
        description: "Commande d'achat reçue du fournisseur Tech Mada.",
    },
    {
        id: 7,
        user: "Admin",
        action: "Mouvement de stock",
        type: "stock",
        element: "Écran 24 pouces",
        elementType: "Stock",
        date: "2026-09-14",
        time: "09:21:02",
        description: "Entrée de 10 unités suite à la réception d'un achat.",
    },
    {
        id: 8,
        user: "Manager",
        action: "Modification",
        type: "modification",
        element: "Client ABC",
        elementType: "Client",
        date: "2026-09-14",
        time: "09:42:36",
        description: "Modification des coordonnées du client.",
    },
    {
        id: 9,
        user: "Admin",
        action: "Suppression",
        type: "suppression",
        element: "Ancienne souris",
        elementType: "Produit",
        date: "2026-09-14",
        time: "10:03:12",
        description: "Suppression du produit du catalogue.",
    },
    {
        id: 10,
        user: "Admin",
        action: "Ajustement",
        type: "ajustement",
        element: "Clé USB 64 Go",
        elementType: "Stock",
        date: "2026-09-14",
        time: "10:15:45",
        description: "Ajustement manuel du stock après inventaire.",
    },
    {
        id: 11,
        user: "Manager",
        action: "Création",
        type: "creation",
        element: "Client Jean Rakoto",
        elementType: "Client",
        date: "2026-09-13",
        time: "14:20:10",
        description: "Création d'un nouveau client.",
    },
    {
        id: 12,
        user: "Admin",
        action: "Vente",
        type: "vente",
        element: "FAC-2026-004",
        elementType: "Facture",
        date: "2026-09-13",
        time: "15:32:54",
        description: "Facture validée.",
    },
    {
        id: 13,
        user: "Admin",
        action: "Connexion",
        type: "connexion",
        element: "Compte administrateur",
        elementType: "Utilisateur",
        date: "2026-09-13",
        time: "08:01:24",
        description: "Connexion réussie au tableau de bord.",
    },
    {
        id: 14,
        user: "Manager",
        action: "Achat",
        type: "achat",
        element: "ACH-2026-007",
        elementType: "Commande d'achat",
        date: "2026-09-12",
        time: "11:24:18",
        description: "Nouvelle commande d'achat créée.",
    },
    {
        id: 15,
        user: "Admin",
        action: "Ajustement",
        type: "ajustement",
        element: "Imprimante HP",
        elementType: "Stock",
        date: "2026-09-12",
        time: "16:10:42",
        description: "Correction manuelle de la quantité disponible.",
    },
];

const actionTypes = [
    {
        value: "tous",
        label: "Toutes les actions",
    },
    {
        value: "connexion",
        label: "Connexions",
    },
    {
        value: "creation",
        label: "Créations",
    },
    {
        value: "modification",
        label: "Modifications",
    },
    {
        value: "suppression",
        label: "Suppressions",
    },
    {
        value: "vente",
        label: "Ventes",
    },
    {
        value: "achat",
        label: "Achats",
    },
    {
        value: "stock",
        label: "Mouvements de stock",
    },
    {
        value: "ajustement",
        label: "Ajustements",
    },
];

function getActionIcon(type) {
    switch (type) {
        case "connexion":
            return <LogIn size={18} />;

        case "creation":
            return <Plus size={18} />;

        case "modification":
            return <Pencil size={18} />;

        case "suppression":
            return <Trash2 size={18} />;

        case "vente":
            return <ShoppingCart size={18} />;

        case "achat":
            return <PackageCheck size={18} />;

        case "stock":
            return <ArrowLeftRight size={18} />;

        case "ajustement":
            return <Settings2 size={18} />;

        default:
            return <Activity size={18} />;
    }
}

function getActionStyle(type) {
    switch (type) {
        case "connexion":
            return "bg-blue-100 text-blue-600";

        case "creation":
            return "bg-green-100 text-green-600";

        case "modification":
            return "bg-yellow-100 text-yellow-600";

        case "suppression":
            return "bg-red-100 text-red-600";

        case "vente":
            return "bg-purple-100 text-purple-600";

        case "achat":
            return "bg-indigo-100 text-indigo-600";

        case "stock":
            return "bg-orange-100 text-orange-600";

        case "ajustement":
            return "bg-pink-100 text-pink-600";

        default:
            return "bg-gray-100 text-gray-600";
    }
}

function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR").format(
        new Date(`${date}T00:00:00`)
    );
}

export default function History() {
    const [history, setHistory] = useState(initialHistory);

    const [search, setSearch] = useState("");

    const [actionFilter, setActionFilter] = useState("tous");

    const [userFilter, setUserFilter] = useState("tous");

    const [dateFilter, setDateFilter] = useState("");

    const [selectedHistory, setSelectedHistory] = useState(null);

    const [showFilters, setShowFilters] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 8;

    const users = useMemo(() => {
        return [...new Set(history.map((item) => item.user))];
    }, [history]);

    const filteredHistory = useMemo(() => {
        return history.filter((item) => {
            const searchValue = search
                .toLowerCase()
                .trim();

            const matchesSearch =
                item.user
                    .toLowerCase()
                    .includes(searchValue) ||
                item.action
                    .toLowerCase()
                    .includes(searchValue) ||
                item.element
                    .toLowerCase()
                    .includes(searchValue) ||
                item.elementType
                    .toLowerCase()
                    .includes(searchValue) ||
                item.description
                    .toLowerCase()
                    .includes(searchValue);

            const matchesAction =
                actionFilter === "tous" ||
                item.type === actionFilter;

            const matchesUser =
                userFilter === "tous" ||
                item.user === userFilter;

            const matchesDate =
                !dateFilter ||
                item.date === dateFilter;

            return (
                matchesSearch &&
                matchesAction &&
                matchesUser &&
                matchesDate
            );
        });
    }, [
        history,
        search,
        actionFilter,
        userFilter,
        dateFilter,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredHistory.length / itemsPerPage
        )
    );

    const paginatedHistory = filteredHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalActivities = history.length;

    const today = "2026-09-14";

    const todayActivities = history.filter(
        (item) => item.date === today
    ).length;

    const connectionCount = history.filter(
        (item) => item.type === "connexion"
    ).length;

    const stockCount = history.filter(
        (item) =>
            item.type === "stock" ||
            item.type === "ajustement"
    ).length;

    function resetFilters() {
        setSearch("");
        setActionFilter("tous");
        setUserFilter("tous");
        setDateFilter("");
        setCurrentPage(1);
    }

    function changeSearch(value) {
        setSearch(value);
        setCurrentPage(1);
    }

    function changeAction(value) {
        setActionFilter(value);
        setCurrentPage(1);
    }

    function changeUser(value) {
        setUserFilter(value);
        setCurrentPage(1);
    }

    function changeDate(value) {
        setDateFilter(value);
        setCurrentPage(1);
    }

    function clearHistory() {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer tout l'historique ? Cette action est irréversible."
        );

        if (!confirmed) return;

        setHistory([]);
        setSelectedHistory(null);
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">

            {/* HEADER */}

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <HistoryIcon size={24} />
                        </div>

                        <div>

                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Historique
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Consultez toutes les activités réalisées dans l'application.
                            </p>

                        </div>

                    </div>

                </div>

                <button
                    onClick={clearHistory}
                    disabled={history.length === 0}
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Trash2 size={17} />
                    Effacer l'historique
                </button>

            </div>

            {/* STATISTIQUES */}

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Total activités
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {totalActivities}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <Activity size={21} />
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Aujourd'hui
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {todayActivities}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <Calendar size={21} />
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Connexions
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {connectionCount}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <LogIn size={21} />
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Stock
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {stockCount}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                            <ArrowLeftRight size={21} />
                        </div>

                    </div>

                </div>

            </div>

            {/* RECHERCHE + FILTRES */}

            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                <div className="flex flex-col gap-3 lg:flex-row">

                    <div className="relative flex-1">

                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                changeSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Rechercher une activité, un utilisateur, un élément..."
                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--input-border)] focus:ring-2 focus:ring-[var(--input-border)]"
                        />

                    </div>

                    <button
                        onClick={() =>
                            setShowFilters(
                                (value) => !value
                            )
                        }
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                            showFilters
                                ? "border-blue-200 bg-blue-50 text-blue-600"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <Filter size={18} />
                        Filtres
                    </button>

                </div>

                {showFilters && (
                    <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 md:grid-cols-3">

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Type d'action
                            </label>

                            <select
                                value={actionFilter}
                                onChange={(event) =>
                                    changeAction(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                            >
                                {actionTypes.map(
                                    (action) => (
                                        <option
                                            key={
                                                action.value
                                            }
                                            value={
                                                action.value
                                            }
                                        >
                                            {action.label}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Utilisateur
                            </label>

                            <select
                                value={userFilter}
                                onChange={(event) =>
                                    changeUser(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                            >

                                <option value="tous">
                                    Tous les utilisateurs
                                </option>

                                {users.map((user) => (
                                    <option
                                        key={user}
                                        value={user}
                                    >
                                        {user}
                                    </option>
                                ))}

                            </select>

                        </div>

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Date
                            </label>

                            <div className="flex gap-2">

                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(event) =>
                                        changeDate(
                                            event.target.value
                                        )
                                    }
                                    className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                                />

                                <button
                                    onClick={resetFilters}
                                    className="rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    Réinitialiser
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </div>

            {/* TABLE */}

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[950px]">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Utilisateur
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Action
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Élément concerné
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Date
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Heure
                                </th>

                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Détails
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {paginatedHistory.map(
                                (item) => (
                                    <tr
                                        key={item.id}
                                        className="transition hover:bg-gray-50"
                                    >

                                        {/* UTILISATEUR */}

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                                                    <User size={18} />
                                                </div>

                                                <div>

                                                    <p className="font-semibold text-gray-900">
                                                        {item.user}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        Utilisateur
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        {/* ACTION */}

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${getActionStyle(
                                                        item.type
                                                    )}`}
                                                >
                                                    {getActionIcon(
                                                        item.type
                                                    )}
                                                </div>

                                                <span className="text-sm font-medium text-gray-900">
                                                    {item.action}
                                                </span>

                                            </div>

                                        </td>

                                        {/* ELEMENT */}

                                        <td className="px-5 py-4">

                                            <div>

                                                <p className="font-medium text-gray-900">
                                                    {item.element}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {item.elementType}
                                                </p>

                                            </div>

                                        </td>

                                        {/* DATE */}

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-2 text-sm text-gray-600">

                                                <Calendar
                                                    size={16}
                                                    className="text-gray-400"
                                                />

                                                {formatDate(
                                                    item.date
                                                )}

                                            </div>

                                        </td>

                                        {/* HEURE */}

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-2 text-sm text-gray-600">

                                                <Clock
                                                    size={16}
                                                    className="text-gray-400"
                                                />

                                                {item.time}

                                            </div>

                                        </td>

                                        {/* DETAILS */}

                                        <td className="px-5 py-4 text-right">

                                            <button
                                                onClick={() =>
                                                    setSelectedHistory(
                                                        item
                                                    )
                                                }
                                                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                title="Voir les détails"
                                            >
                                                <Eye
                                                    size={18}
                                                />
                                            </button>

                                        </td>

                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>

                </div>

                {/* AUCUN RESULTAT */}

                {paginatedHistory.length === 0 && (
                    <div className="px-6 py-16 text-center">

                        <HistoryIcon
                            size={46}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="mt-4 font-semibold text-gray-900">
                            Aucun historique trouvé
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Aucune activité ne correspond aux filtres sélectionnés.
                        </p>

                        <button
                            onClick={resetFilters}
                            className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Réinitialiser les filtres
                        </button>

                    </div>
                )}

                {/* PAGINATION */}

                {filteredHistory.length > 0 && (
                    <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-gray-500">
                            {filteredHistory.length} activité(s)
                            {" "}• Page {currentPage} sur{" "}
                            {totalPages}
                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                disabled={
                                    currentPage === 1
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (page) =>
                                            Math.max(
                                                page - 1,
                                                1
                                            )
                                    )
                                }
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft
                                    size={18}
                                />
                            </button>

                            {Array.from(
                                {
                                    length: totalPages,
                                },
                                (_, index) =>
                                    index + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() =>
                                        setCurrentPage(
                                            page
                                        )
                                    }
                                    className={`h-9 w-9 rounded-lg text-sm font-medium ${
                                        currentPage ===
                                        page
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (page) =>
                                            Math.min(
                                                page + 1,
                                                totalPages
                                            )
                                    )
                                }
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight
                                    size={18}
                                />
                            </button>

                        </div>

                    </div>
                )}

            </div>

            {/* MODAL DETAILS */}

            {selectedHistory && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
                    onClick={() =>
                        setSelectedHistory(null)
                    }
                >

                    <div
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                            <div className="flex items-center gap-3">

                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${getActionStyle(
                                        selectedHistory.type
                                    )}`}
                                >
                                    {getActionIcon(
                                        selectedHistory.type
                                    )}
                                </div>

                                <div>

                                    <h2 className="font-bold text-gray-900">
                                        Détails de l'activité
                                    </h2>

                                    <p className="text-xs text-gray-500">
                                        ID #{selectedHistory.id}
                                    </p>

                                </div>

                            </div>

                            <button
                                onClick={() =>
                                    setSelectedHistory(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* MODAL BODY */}

                        <div className="space-y-4 p-5">

                            <div className="rounded-xl bg-gray-50 p-4">

                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Action
                                </p>

                                <div className="mt-2 flex items-center gap-3">

                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${getActionStyle(
                                            selectedHistory.type
                                        )}`}
                                    >
                                        {getActionIcon(
                                            selectedHistory.type
                                        )}
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        {
                                            selectedHistory.action
                                        }
                                    </p>

                                </div>

                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                <div className="rounded-xl border border-gray-200 p-4">

                                    <p className="text-xs text-gray-400">
                                        Utilisateur
                                    </p>

                                    <div className="mt-2 flex items-center gap-2">

                                        <User
                                            size={17}
                                            className="text-gray-400"
                                        />

                                        <p className="font-semibold text-gray-900">
                                            {
                                                selectedHistory.user
                                            }
                                        </p>

                                    </div>

                                </div>

                                <div className="rounded-xl border border-gray-200 p-4">

                                    <p className="text-xs text-gray-400">
                                        Élément
                                    </p>

                                    <p className="mt-2 font-semibold text-gray-900">
                                        {
                                            selectedHistory.element
                                        }
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {
                                            selectedHistory.elementType
                                        }
                                    </p>

                                </div>

                                <div className="rounded-xl border border-gray-200 p-4">

                                    <p className="text-xs text-gray-400">
                                        Date
                                    </p>

                                    <div className="mt-2 flex items-center gap-2">

                                        <Calendar
                                            size={17}
                                            className="text-gray-400"
                                        />

                                        <p className="font-semibold text-gray-900">
                                            {formatDate(
                                                selectedHistory.date
                                            )}
                                        </p>

                                    </div>

                                </div>

                                <div className="rounded-xl border border-gray-200 p-4">

                                    <p className="text-xs text-gray-400">
                                        Heure
                                    </p>

                                    <div className="mt-2 flex items-center gap-2">

                                        <Clock
                                            size={17}
                                            className="text-gray-400"
                                        />

                                        <p className="font-semibold text-gray-900">
                                            {
                                                selectedHistory.time
                                            }
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="rounded-xl border border-gray-200 p-4">

                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Description
                                </p>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {
                                        selectedHistory.description
                                    }
                                </p>

                            </div>

                        </div>

                        {/* MODAL FOOTER */}

                        <div className="border-t border-gray-200 px-5 py-4">

                            <button
                                onClick={() =>
                                    setSelectedHistory(
                                        null
                                    )
                                }
                                className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                            >
                                Fermer
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}