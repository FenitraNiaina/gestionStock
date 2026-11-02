import { useMemo, useState } from "react";
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    ArrowLeftRight,
    RotateCcw,
    SlidersHorizontal,
    Plus,
    Search,
    Eye,
    X,
    Package,
    User,
    Calendar,
    FileText,
    AlertTriangle,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| PRODUITS DE TEST
|--------------------------------------------------------------------------
| Plus tard, ces données viendront du module Produits / backend.
*/
const initialProducts = [
    {
        id: 1,
        name: "Seau plastique 10L",
        reference: "SFOI-001",
        stock: 245,
    },
    {
        id: 2,
        name: "Bassine plastique 15L",
        reference: "SFOI-002",
        stock: 180,
    },
    {
        id: 3,
        name: "Cuvette plastique",
        reference: "SFOI-003",
        stock: 320,
    },
    {
        id: 4,
        name: "Arrosoir plastique",
        reference: "SFOI-004",
        stock: 95,
    },
    {
        id: 5,
        name: "Bidon plastique 20L",
        reference: "SFOI-005",
        stock: 72,
    },
    {
        id: 6,
        name: "Sac PP tissé",
        reference: "SFOI-006",
        stock: 2500,
    },
    {
        id: 7,
        name: "Film plastique PE",
        reference: "SFOI-007",
        stock: 38,
    },
    {
        id: 8,
        name: "Sachet plastique personnalisé",
        reference: "SFOI-008",
        stock: 14,
    },
    {
        id: 9,
        name: "Bouteille plastique",
        reference: "SFOI-009",
        stock: 850,
    },
    {
        id: 10,
        name: "Matière plastique recyclée",
        reference: "SFOI-010",
        stock: 680,
    },
];

/*
|--------------------------------------------------------------------------
| MOUVEMENTS DE TEST
|--------------------------------------------------------------------------
*/
const initialMovements = [
    {
        id: 1,
        reference: "MVT-2026-0001",
        productId: 1,
        productName: "Seau plastique 10L",
        quantity: 10,
        type: "Entrée",
        user: "Admin",
        date: "2026-09-14T08:30",
        reason: "Réception fournisseur",
        stockBefore: 15,
        stockAfter: 25,
    },
    {
        id: 2,
        reference: "MVT-2026-0002",
        productId: 2,
        productName: "Bassine plastique 15L",
        quantity: 5,
        type: "Sortie",
        user: "Admin",
        date: "2026-09-14T09:10",
        reason: "Vente client",
        stockBefore: 45,
        stockAfter: 40,
    },
    {
        id: 3,
        reference: "MVT-2026-0003",
        productId: 3,
        productName: "Cuvette plastique",
        quantity: 3,
        type: "Retour",
        user: "Admin",
        date: "2026-09-13T15:20",
        reason: "Retour client",
        stockBefore: 57,
        stockAfter: 60,
    },
];

/*
|--------------------------------------------------------------------------
| TYPES DE MOUVEMENT
|--------------------------------------------------------------------------
*/
const movementTypes = [
    {
        value: "Entrée",
        label: "Entrée",
        icon: ArrowDownToLine,
        color: "green",
    },
    {
        value: "Sortie",
        label: "Sortie",
        icon: ArrowUpFromLine,
        color: "red",
    },
    {
        value: "Retour",
        label: "Retour",
        icon: RotateCcw,
        color: "blue",
    },
    {
        value: "Ajustement",
        label: "Ajustement",
        icon: SlidersHorizontal,
        color: "orange",
    },
    {
        value: "Transfert",
        label: "Transfert",
        icon: ArrowLeftRight,
        color: "purple",
    },
];

const emptyForm = {
    productId: "",
    type: "Entrée",
    quantity: "",
    reason: "",
};

/*
|--------------------------------------------------------------------------
| OUTILS
|--------------------------------------------------------------------------
*/
function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR").format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(date));
}

function generateReference() {
    const number = Date.now().toString().slice(-6);

    return `MVT-${new Date().getFullYear()}-${number}`;
}

/*
|--------------------------------------------------------------------------
| BADGE TYPE
|--------------------------------------------------------------------------
*/
function MovementBadge({ type }) {
    const config = movementTypes.find(
        (movement) => movement.value === type
    );

    if (!config) {
        return null;
    }

    const Icon = config.icon;

    const styles = {
        green: "bg-green-50 text-green-700",
        red: "bg-red-50 text-red-700",
        blue: "bg-blue-50 text-blue-700",
        orange: "bg-orange-50 text-orange-700",
        purple: "bg-purple-50 text-purple-700",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${styles[config.color]}`}
        >
            <Icon size={14} />
            {config.label}
        </span>
    );
}

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/
export default function StockMovements() {
    const [products, setProducts] = useState(initialProducts);
    const [movements, setMovements] = useState(initialMovements);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("Tous");

    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const [selectedMovement, setSelectedMovement] =
        useState(null);

    const [form, setForm] = useState(emptyForm);

    /*
    |--------------------------------------------------------------------------
    | FILTRAGE
    |--------------------------------------------------------------------------
    */
    const filteredMovements = useMemo(() => {
        const query = search.toLowerCase().trim();

        return movements.filter((movement) => {
            const matchesSearch =
                !query ||
                movement.reference
                    .toLowerCase()
                    .includes(query) ||
                movement.productName
                    .toLowerCase()
                    .includes(query) ||
                movement.user
                    .toLowerCase()
                    .includes(query) ||
                movement.reason
                    .toLowerCase()
                    .includes(query);

            const matchesType =
                typeFilter === "Tous" ||
                movement.type === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [movements, search, typeFilter]);

    /*
    |--------------------------------------------------------------------------
    | STATISTIQUES
    |--------------------------------------------------------------------------
    */
    const totalMovements = movements.length;

    const totalEntries = movements.filter(
        (movement) => movement.type === "Entrée"
    ).length;

    const totalOutputs = movements.filter(
        (movement) => movement.type === "Sortie"
    ).length;

    const totalReturns = movements.filter(
        (movement) => movement.type === "Retour"
    ).length;

    /*
    |--------------------------------------------------------------------------
    | FORMULAIRE
    |--------------------------------------------------------------------------
    */
    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function openAddForm() {
        setForm(emptyForm);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setForm(emptyForm);
    }

    /*
    |--------------------------------------------------------------------------
    | CALCUL DU NOUVEAU STOCK
    |--------------------------------------------------------------------------
    */
    function calculateStock(type, stockBefore, quantity) {
        const qty = Number(quantity);

        switch (type) {
            case "Entrée":
                return stockBefore + qty;

            case "Retour":
                return stockBefore + qty;

            case "Sortie":
                return stockBefore - qty;

            case "Ajustement":
                /*
                Pour un ajustement, la quantité représente
                ici la correction du stock.

                Exemple :
                stock = 20
                quantité = -5
                nouveau stock = 15
                */
                return stockBefore + qty;

            case "Transfert":
                /*
                Dans cette première version,
                le transfert est enregistré comme
                un mouvement sortant du stock.
                */
                return stockBefore - qty;

            default:
                return stockBefore;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | AJOUT MOUVEMENT
    |--------------------------------------------------------------------------
    */
    function handleSubmit(event) {
        event.preventDefault();

        const product = products.find(
            (item) =>
                item.id === Number(form.productId)
        );

        if (!product) {
            alert("Veuillez sélectionner un produit.");
            return;
        }

        const quantity = Number(form.quantity);

        if (!quantity || quantity <= 0) {
            alert(
                "La quantité doit être supérieure à zéro."
            );
            return;
        }

        if (!form.reason.trim()) {
            alert("Veuillez indiquer le motif du mouvement.");
            return;
        }

        const stockBefore = product.stock;

        /*
        |--------------------------------------------------------------
        | Pour Ajustement :
        | la quantité peut être positive ou négative.
        |--------------------------------------------------------------
        */
        let stockAfter;

        if (form.type === "Ajustement") {
            const adjustment = Number(form.quantity);

            stockAfter =
                stockBefore + adjustment;
        } else {
            stockAfter = calculateStock(
                form.type,
                stockBefore,
                quantity
            );
        }

        /*
        |--------------------------------------------------------------
        | INTERDICTION DU STOCK NÉGATIF
        |--------------------------------------------------------------
        */
        if (stockAfter < 0) {
            alert(
                `Stock insuffisant.\n\nStock disponible : ${stockBefore}\nQuantité demandée : ${quantity}\n\nLe stock ne peut pas devenir négatif.`
            );

            return;
        }

        /*
        |--------------------------------------------------------------
        | NOUVEAU MOUVEMENT
        |--------------------------------------------------------------
        */
        const newMovement = {
            id: Date.now(),
            reference: generateReference(),
            productId: product.id,
            productName: product.name,
            quantity:
                form.type === "Ajustement"
                    ? Number(form.quantity)
                    : quantity,
            type: form.type,
            user: "Admin",
            date: new Date().toISOString(),
            reason: form.reason,
            stockBefore,
            stockAfter,
        };

        /*
        |--------------------------------------------------------------
        | MISE À JOUR AUTOMATIQUE DU STOCK
        |--------------------------------------------------------------
        */
        setProducts((previous) =>
            previous.map((item) =>
                item.id === product.id
                    ? {
                          ...item,
                          stock: stockAfter,
                      }
                    : item
            )
        );

        /*
        |--------------------------------------------------------------
        | AJOUT À L'HISTORIQUE
        |--------------------------------------------------------------
        */
        setMovements((previous) => [
            newMovement,
            ...previous,
        ]);

        closeForm();

        alert(
            `Mouvement enregistré avec succès.\n\nStock avant : ${stockBefore}\nStock après : ${stockAfter}`
        );
    }

    /*
    |--------------------------------------------------------------------------
    | DETAILS
    |--------------------------------------------------------------------------
    */
    function openDetails(movement) {
        setSelectedMovement(movement);
        setShowDetails(true);
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">

            {/* =====================================================
                HEADER
            ====================================================== */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Mouvements de stock
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Suivez toutes les entrées, sorties et
                        modifications de votre stock.
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--couleur-principale)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--couleur-hover)]"
                >
                    <Plus size={18} />
                    Nouveau mouvement
                </button>
            </div>

            {/* =====================================================
                STATISTIQUES
            ====================================================== */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Total mouvements
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {totalMovements}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
                            <ArrowLeftRight size={22} />
                        </div>

                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Entrées
                            </p>

                            <p className="mt-2 text-2xl font-bold text-green-600">
                                {totalEntries}
                            </p>
                        </div>

                        <div className="rounded-xl bg-green-50 p-3 text-green-600">
                            <ArrowDownToLine size={22} />
                        </div>

                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Sorties
                            </p>

                            <p className="mt-2 text-2xl font-bold text-red-600">
                                {totalOutputs}
                            </p>
                        </div>

                        <div className="rounded-xl bg-red-50 p-3 text-red-600">
                            <ArrowUpFromLine size={22} />
                        </div>

                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Retours
                            </p>

                            <p className="mt-2 text-2xl font-bold text-blue-600">
                                {totalReturns}
                            </p>
                        </div>

                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <RotateCcw size={22} />
                        </div>

                    </div>
                </div>

            </div>

            {/* =====================================================
                RECHERCHE + FILTRE
            ====================================================== */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                <div className="flex flex-col gap-3 lg:flex-row">

                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Rechercher par produit, référence, utilisateur ou motif..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--input-border)] focus:ring-2 focus:ring-[var(--input-border)]"
                        />

                    </div>

                    <select
                        value={typeFilter}
                        onChange={(event) =>
                            setTypeFilter(event.target.value)
                        }
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
                    >
                        <option value="Tous">
                            Tous les types
                        </option>

                        {movementTypes.map((type) => (
                            <option
                                key={type.value}
                                value={type.value}
                            >
                                {type.label}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            {/* =====================================================
                TABLE
            ====================================================== */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1100px] text-left">

                        <thead className="border-b border-gray-200 bg-gray-50">

                            <tr>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Référence
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Produit
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Type
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Quantité
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Stock
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Utilisateur
                                </th>

                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Date
                                </th>

                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {filteredMovements.map(
                                (movement) => (
                                    <tr
                                        key={movement.id}
                                        className="transition hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-4">
                                            <span className="font-medium text-gray-900">
                                                {movement.reference}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <Package
                                                        size={18}
                                                    />
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {
                                                            movement.productName
                                                        }
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        Produit #
                                                        {
                                                            movement.productId
                                                        }
                                                    </p>
                                                </div>

                                            </div>

                                        </td>

                                        <td className="px-5 py-4">
                                            <MovementBadge
                                                type={
                                                    movement.type
                                                }
                                            />
                                        </td>

                                        <td className="px-5 py-4">

                                            <span
                                                className={`font-semibold ${
                                                    movement.type ===
                                                        "Sortie" ||
                                                    movement.type ===
                                                        "Transfert"
                                                        ? "text-red-600"
                                                        : "text-green-600"
                                                }`}
                                            >
                                                {movement.type ===
                                                    "Sortie" ||
                                                movement.type ===
                                                    "Transfert"
                                                    ? "-"
                                                    : "+"}

                                                {Math.abs(
                                                    movement.quantity
                                                )}
                                            </span>

                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="text-sm">
                                                <span className="text-gray-500">
                                                    {
                                                        movement.stockBefore
                                                    }
                                                </span>

                                                <span className="mx-2 text-gray-300">
                                                    →
                                                </span>

                                                <span className="font-semibold text-gray-900">
                                                    {
                                                        movement.stockAfter
                                                    }
                                                </span>
                                            </div>

                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <User
                                                    size={15}
                                                />

                                                {
                                                    movement.user
                                                }
                                            </div>

                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {formatDate(
                                                movement.date
                                            )}
                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex justify-end">

                                                <button
                                                    onClick={() =>
                                                        openDetails(
                                                            movement
                                                        )
                                                    }
                                                    title="Voir les détails"
                                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                                                >
                                                    <Eye
                                                        size={17}
                                                    />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                )
                            )}

                            {filteredMovements.length ===
                                0 && (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="px-5 py-12 text-center"
                                    >
                                        <ArrowLeftRight
                                            size={40}
                                            className="mx-auto text-gray-300"
                                        />

                                        <p className="mt-3 font-medium text-gray-700">
                                            Aucun mouvement
                                            trouvé
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Modifiez votre
                                            recherche ou
                                            ajoutez un
                                            mouvement.
                                        </p>
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* =====================================================
                MODAL AJOUT
            ====================================================== */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-gray-200 p-5">

                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Nouveau mouvement
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Enregistrez une opération de
                                    stock.
                                </p>
                            </div>

                            <button
                                onClick={closeForm}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-5"
                        >

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                {/* PRODUIT */}
                                <div className="md:col-span-2">

                                    <label className="text-sm font-medium text-gray-700">
                                        Produit *
                                    </label>

                                    <select
                                        name="productId"
                                        value={
                                            form.productId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    >
                                        <option value="">
                                            Sélectionner un
                                            produit
                                        </option>

                                        {products.map(
                                            (product) => (
                                                <option
                                                    key={
                                                        product.id
                                                    }
                                                    value={
                                                        product.id
                                                    }
                                                >
                                                    {
                                                        product.name
                                                    }{" "}
                                                    — Stock :{" "}
                                                    {
                                                        product.stock
                                                    }
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                                {/* TYPE */}
                                <div>

                                    <label className="text-sm font-medium text-gray-700">
                                        Type *
                                    </label>

                                    <select
                                        name="type"
                                        value={form.type}
                                        onChange={
                                            handleChange
                                        }
                                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    >
                                        {movementTypes.map(
                                            (type) => (
                                                <option
                                                    key={
                                                        type.value
                                                    }
                                                    value={
                                                        type.value
                                                    }
                                                >
                                                    {
                                                        type.label
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                </div>

                                {/* QUANTITE */}
                                <div>

                                    <label className="text-sm font-medium text-gray-700">
                                        {form.type ===
                                        "Ajustement"
                                            ? "Ajustement *"
                                            : "Quantité *"}
                                    </label>

                                    <input
                                        type={
                                            form.type ===
                                            "Ajustement"
                                                ? "number"
                                                : "number"
                                        }
                                        name="quantity"
                                        value={
                                            form.quantity
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min={
                                            form.type ===
                                            "Ajustement"
                                                ? undefined
                                                : "1"
                                        }
                                        required
                                        placeholder={
                                            form.type ===
                                            "Ajustement"
                                                ? "Ex : -5 ou +5"
                                                : "Ex : 10"
                                        }
                                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    />

                                </div>

                                {/* MOTIF */}
                                <div className="md:col-span-2">

                                    <label className="text-sm font-medium text-gray-700">
                                        Motif *
                                    </label>

                                    <textarea
                                        name="reason"
                                        value={
                                            form.reason
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="4"
                                        required
                                        placeholder="Ex : Réception fournisseur, vente client, produit endommagé..."
                                        className="mt-1 w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    />

                                </div>

                            </div>

                            {/* INFORMATION */}
                            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

                                <div className="flex gap-3">

                                    <AlertTriangle
                                        size={20}
                                        className="mt-0.5 shrink-0 text-blue-600"
                                    />

                                    <div>

                                        <p className="text-sm font-semibold text-blue-900">
                                            Protection du stock
                                        </p>

                                        <p className="mt-1 text-sm text-blue-700">
                                            Le système calcule
                                            automatiquement le
                                            stock avant et
                                            après le mouvement.
                                            Un stock négatif
                                            sera
                                            automatiquement
                                            refusé.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* ACTIONS */}
                            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-[var(--couleur-principale)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--couleur-hover)]"
                                >
                                    Enregistrer le
                                    mouvement
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* =====================================================
                MODAL DETAILS
            ====================================================== */}
            {showDetails &&
                selectedMovement && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                            <div className="flex items-center justify-between border-b border-gray-200 p-5">

                                <div>
                                    <h2 className="font-semibold text-gray-900">
                                        Détails du mouvement
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        {
                                            selectedMovement.reference
                                        }
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        setShowDetails(
                                            false
                                        )
                                    }
                                    className="rounded-lg p-2 hover:bg-gray-100"
                                >
                                    <X size={20} />
                                </button>

                            </div>

                            <div className="space-y-4 p-5">

                                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Type
                                        </p>

                                        <div className="mt-2">
                                            <MovementBadge
                                                type={
                                                    selectedMovement.type
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            Quantité
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-gray-900">
                                            {selectedMovement.quantity}
                                        </p>
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <div className="rounded-xl border border-gray-100 p-4">

                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Package
                                                size={16}
                                            />

                                            <p className="text-xs">
                                                Produit
                                            </p>
                                        </div>

                                        <p className="mt-2 font-medium text-gray-900">
                                            {
                                                selectedMovement.productName
                                            }
                                        </p>

                                    </div>

                                    <div className="rounded-xl border border-gray-100 p-4">

                                        <div className="flex items-center gap-2 text-gray-500">
                                            <FileText
                                                size={16}
                                            />

                                            <p className="text-xs">
                                                Référence
                                            </p>
                                        </div>

                                        <p className="mt-2 font-medium text-gray-900">
                                            {
                                                selectedMovement.reference
                                            }
                                        </p>

                                    </div>

                                    <div className="rounded-xl border border-gray-100 p-4">

                                        <div className="flex items-center gap-2 text-gray-500">
                                            <User
                                                size={16}
                                            />

                                            <p className="text-xs">
                                                Utilisateur
                                            </p>
                                        </div>

                                        <p className="mt-2 font-medium text-gray-900">
                                            {
                                                selectedMovement.user
                                            }
                                        </p>

                                    </div>

                                    <div className="rounded-xl border border-gray-100 p-4">

                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar
                                                size={16}
                                            />

                                            <p className="text-xs">
                                                Date
                                            </p>
                                        </div>

                                        <p className="mt-2 font-medium text-gray-900">
                                            {formatDate(
                                                selectedMovement.date
                                            )}
                                        </p>

                                    </div>

                                </div>

                                {/* STOCK */}
                                <div className="rounded-2xl border border-gray-200 p-5">

                                    <h3 className="font-semibold text-gray-900">
                                        Évolution du stock
                                    </h3>

                                    <div className="mt-5 flex items-center justify-center gap-6">

                                        <div className="text-center">

                                            <p className="text-xs text-gray-500">
                                                Stock avant
                                            </p>

                                            <p className="mt-1 text-3xl font-bold text-gray-700">
                                                {
                                                    selectedMovement.stockBefore
                                                }
                                            </p>

                                        </div>

                                        <div className="text-gray-300">
                                            →
                                        </div>

                                        <div className="text-center">

                                            <p className="text-xs text-gray-500">
                                                Stock après
                                            </p>

                                            <p className="mt-1 text-3xl font-bold text-green-600">
                                                {
                                                    selectedMovement.stockAfter
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                {/* MOTIF */}
                                <div className="rounded-xl bg-gray-50 p-4">

                                    <p className="text-xs text-gray-500">
                                        Motif
                                    </p>

                                    <p className="mt-2 text-sm text-gray-700">
                                        {
                                            selectedMovement.reason
                                        }
                                    </p>

                                </div>

                            </div>

                            <div className="border-t border-gray-200 p-5 text-right">

                                <button
                                    onClick={() =>
                                        setShowDetails(
                                            false
                                        )
                                    }
                                    className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
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