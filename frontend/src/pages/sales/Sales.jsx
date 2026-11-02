import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    UserRound,
    Calendar,
    Receipt,
    CheckCircle2,
    Clock3,
    Ban,
    Banknote,
    CreditCard,
    Smartphone,
    FileCheck,
    ShoppingCart,
} from "lucide-react";
import SalesForm from "./SalesForm";
import SalesDetails from "./SalesDetails";
import {
    fetchSales,
    createSale,
    updateSale,
    deleteSale as deleteSaleRequest,
    validateSale as validateSaleRequest,
    cancelSale as cancelSaleRequest,
} from "../../data/sales";
import { fetchCustomers } from "../../data/customers";
import { fetchProducts } from "../../data/products";

/* =========================================================
   OUTILS
========================================================= */

function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
}

function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
}

function calculateTotal(sale) {
    const subtotal = sale.products.reduce(
        (total, product) => total + Number(product.quantity) * Number(product.unitPrice),
        0
    );
    return subtotal - Number(sale.discount || 0) + Number(sale.tax || 0);
}

/* =========================================================
   BADGE STATUT
========================================================= */

function StatusBadge({ status }) {
    const configuration = {
        Brouillon: { icon: Clock3, className: "bg-gray-100 text-gray-600" },
        "En attente": { icon: Clock3, className: "bg-orange-50 text-orange-600" },
        Validée: { icon: CheckCircle2, className: "bg-green-50 text-green-600" },
        Annulée: { icon: Ban, className: "bg-red-50 text-red-600" },
    };

    const config = configuration[status];
    if (!config) return null;

    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.className}`}>
            <Icon size={14} />
            {status}
        </span>
    );
}

const paymentIcons = {
    Espèces: Banknote,
    "Carte bancaire": CreditCard,
    "Mobile Money": Smartphone,
    Chèque: FileCheck,
    Crédit: Receipt,
};

/* =========================================================
   PAGE
========================================================= */

export default function Sales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Tous");

    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [editingSale, setEditingSale] = useState(null);
    const [selectedSale, setSelectedSale] = useState(null);

    useEffect(() => {
        loadSales();

        fetchCustomers()
            .then(setCustomers)
            .catch(() => setCustomers([]));

        fetchProducts()
            .then(setProducts)
            .catch(() => setProducts([]));
    }, []);

    async function loadSales() {
        setLoading(true);
        setError("");

        try {
            const data = await fetchSales();
            setSales(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    /* =====================================================
       FILTRAGE
    ====================================================== */

    const filteredSales = useMemo(() => {
        const query = search.toLowerCase().trim();

        return sales.filter((sale) => {
            const matchesSearch =
                !query ||
                sale.number.toLowerCase().includes(query) ||
                sale.customerName.toLowerCase().includes(query) ||
                sale.user.toLowerCase().includes(query);

            const matchesStatus = statusFilter === "Tous" || sale.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [sales, search, statusFilter]);

    /* =====================================================
       STATISTIQUES
    ====================================================== */

    const totalSales = sales.length;
    const validatedSales = sales.filter((sale) => sale.status === "Validée").length;
    const pendingSales = sales.filter((sale) => sale.status === "En attente").length;
    const totalRevenue = sales
        .filter((sale) => sale.status === "Validée")
        .reduce((total, sale) => total + calculateTotal(sale), 0);

    /* =====================================================
       FORMULAIRE
    ====================================================== */

    function openAddForm() {
        setEditingSale(null);
        setShowForm(true);
    }

    function openEditForm(sale) {
        if (sale.status === "Validée") {
            alert("Une vente déjà validée ne peut plus être modifiée.");
            return;
        }
        setEditingSale(sale);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingSale(null);
    }

    async function handleSave(saleData) {
        try {
            if (editingSale) {
                const updated = await updateSale(editingSale.id, saleData);

                setSales((previous) =>
                    previous.map((sale) => (sale.id === editingSale.id ? updated : sale))
                );
            } else {
                const created = await createSale(saleData);

                setSales((previous) => [created, ...previous]);
            }

            closeForm();

            // Une validation a pu changer le stock : on rafraîchit la liste des produits
            // pour que le prochain formulaire affiche les bonnes quantités disponibles.
            fetchProducts().then(setProducts).catch(() => {});
        } catch (err) {
            alert(err.message);
        }
    }

    /* =====================================================
       VALIDATION
    ====================================================== */

    async function validateSale(sale) {
        const confirmed = window.confirm(
            `Valider la facture ${sale.number} ?\n\nLe stock sera automatiquement diminué.`
        );
        if (!confirmed) return;

        try {
            const updated = await validateSaleRequest(sale.id);

            setSales((previous) =>
                previous.map((item) => (item.id === sale.id ? updated : item))
            );

            if (selectedSale?.id === sale.id) {
                setSelectedSale(updated);
            }

            fetchProducts().then(setProducts).catch(() => {});

            alert(`Vente ${sale.number} validée avec succès.\n\nLe stock a été automatiquement diminué.`);
        } catch (err) {
            alert(err.message);
        }
    }

    /* =====================================================
       ANNULATION
    ====================================================== */

    async function cancelSale(sale) {
        if (sale.status === "Validée") {
            alert("Une vente déjà validée ne peut pas être annulée depuis cette interface.");
            return;
        }

        const confirmed = window.confirm(`Annuler la facture ${sale.number} ?`);
        if (!confirmed) return;

        try {
            const updated = await cancelSaleRequest(sale.id);

            setSales((previous) =>
                previous.map((item) => (item.id === sale.id ? updated : item))
            );
        } catch (err) {
            alert(err.message);
        }
    }

    /* =====================================================
       SUPPRESSION
    ====================================================== */

    async function deleteSale(id) {
        const sale = sales.find((item) => item.id === id);
        if (!sale) return;

        if (sale.status === "Validée") {
            alert("Une vente validée ne peut pas être supprimée.");
            return;
        }

        const confirmed = window.confirm(`Voulez-vous vraiment supprimer ${sale.number} ?`);
        if (!confirmed) return;

        try {
            await deleteSaleRequest(id);
            setSales((previous) => previous.filter((item) => item.id !== id));
        } catch (err) {
            alert(err.message);
        }
    }

    /* =====================================================
       DETAILS
    ====================================================== */

    function openDetails(sale) {
        setSelectedSale(sale);
        setShowDetails(true);
    }

    /* =====================================================
       RENDU
    ====================================================== */

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Ventes
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gérez vos ventes, factures et sorties de stock.
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--couleur-principale)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--couleur-hover)]"
                >
                    <Plus size={18} />
                    Nouvelle vente
                </button>
            </div>

            {/* STATISTIQUES */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total ventes</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{totalSales}</p>
                        </div>
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <Receipt size={22} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Validées</p>
                            <p className="mt-2 text-2xl font-bold text-green-600">{validatedSales}</p>
                        </div>
                        <div className="rounded-xl bg-green-50 p-3 text-green-600">
                            <CheckCircle2 size={22} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">En attente</p>
                            <p className="mt-2 text-2xl font-bold text-orange-600">{pendingSales}</p>
                        </div>
                        <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                            <Clock3 size={22} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Chiffre d'affaires</p>
                            <p className="mt-2 text-xl font-bold text-gray-900">
                                {formatPrice(totalRevenue)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                            <ShoppingCart size={22} />
                        </div>
                    </div>
                </div>
            </div>

            {/* RECHERCHE */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Rechercher par facture, client ou utilisateur..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--input-border)] focus:ring-2 focus:ring-[var(--input-border)]"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
                    >
                        <option value="Tous">Tous les statuts</option>
                        <option value="Brouillon">Brouillon</option>
                        <option value="En attente">En attente</option>
                        <option value="Validée">Validée</option>
                        <option value="Annulée">Annulée</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error} — vérifie que le serveur backend est démarré sur
                    le port attendu.
                </div>
            )}

            {/* TABLE */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px] text-left">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Facture</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Client</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Date</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Produits</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Paiement</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Total</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Statut</th>
                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-500">
                                        Chargement des ventes...
                                    </td>
                                </tr>
                            )}

                            {!loading && filteredSales.map((sale) => {
                                const PaymentIcon = paymentIcons[sale.paymentMethod] || Receipt;

                                return (
                                    <tr key={sale.id} className="transition hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-900">{sale.number}</p>
                                            <p className="text-xs text-gray-500">Facture #{sale.id}</p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <UserRound size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{sale.customerName}</p>
                                                    <p className="text-xs text-gray-500">Client</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar size={15} />
                                                {formatDate(sale.date)}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-gray-900">
                                                {sale.products.length} produit{sale.products.length > 1 ? "s" : ""}
                                            </p>
                                            <p className="max-w-[200px] truncate text-xs text-gray-500">
                                                {sale.products.map((p) => p.productName).join(", ")}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <PaymentIcon size={16} />
                                                {sale.paymentMethod}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-900">
                                                {formatPrice(calculateTotal(sale))}
                                            </p>
                                            {sale.discount > 0 && (
                                                <p className="text-xs text-green-600">
                                                    Remise : -{formatPrice(sale.discount)}
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge status={sale.status} />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => openDetails(sale)}
                                                    title="Voir détails"
                                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                <button
                                                    onClick={() => openEditForm(sale)}
                                                    title="Modifier"
                                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-green-600"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                {sale.status !== "Validée" && sale.status !== "Annulée" && (
                                                    <button
                                                        onClick={() => validateSale(sale)}
                                                        title="Valider la vente"
                                                        className="rounded-lg p-2 text-gray-500 hover:bg-green-50 hover:text-green-600"
                                                    >
                                                        <CheckCircle2 size={17} />
                                                    </button>
                                                )}

                                                {sale.status !== "Validée" && sale.status !== "Annulée" && (
                                                    <button
                                                        onClick={() => cancelSale(sale)}
                                                        title="Annuler"
                                                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Ban size={17} />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => deleteSale(sale.id)}
                                                    title="Supprimer"
                                                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {!loading && filteredSales.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-5 py-12 text-center">
                                        <Receipt size={40} className="mx-auto text-gray-300" />
                                        <p className="mt-3 font-medium text-gray-700">Aucune vente trouvée</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL FORMULAIRE */}
            {showForm && (
                <SalesForm
                    initialSale={editingSale}
                    customers={customers}
                    products={products}
                    onSave={handleSave}
                    onClose={closeForm}
                />
            )}

            {/* MODAL DETAILS */}
            {showDetails && selectedSale && (
                <SalesDetails
                    sale={selectedSale}
                    onClose={() => setShowDetails(false)}
                    onValidate={validateSale}
                />
            )}
        </div>
    );
}