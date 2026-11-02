import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    Truck,
    Calendar,
    Receipt,
    CheckCircle2,
    Clock3,
    Ban,
    ShoppingCart,
} from "lucide-react";
import PurchaseForm from "./PurchasesForm";
import PurchaseDetails from "./PurchasesDetails";
import {
    fetchPurchases,
    createPurchase,
    updatePurchase,
    deletePurchase as deletePurchaseRequest,
    receivePurchase as receivePurchaseRequest,
} from "../../data/purchases";
import { fetchSuppliers } from "../../data/suppliers";
import { fetchProducts } from "../../data/products";

/* =========================================================
   OUTILS
========================================================= */

export function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
}

export function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
}

export function calculateSubtotal(purchase) {
    return purchase.products.reduce(
        (total, product) => total + Number(product.quantity) * Number(product.unitPrice),
        0
    );
}

export function calculateTotal(purchase) {
    const subtotal = calculateSubtotal(purchase);
    return subtotal - Number(purchase.discount || 0) + Number(purchase.tax || 0);
}

/* =========================================================
   BADGE STATUT
========================================================= */

export function StatusBadge({ status }) {
    const configuration = {
        Brouillon: { icon: Clock3, className: "bg-gray-100 text-gray-600" },
        Commandé: { icon: ShoppingCart, className: "bg-blue-50 text-blue-600" },
        Reçu: { icon: CheckCircle2, className: "bg-green-50 text-green-600" },
        Annulé: { icon: Ban, className: "bg-red-50 text-red-600" },
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

/* =========================================================
   PAGE
========================================================= */

export default function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Tous");
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState(null);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    useEffect(() => {
        loadPurchases();

        fetchSuppliers()
            .then(setSuppliers)
            .catch(() => setSuppliers([]));

        fetchProducts()
            .then(setProducts)
            .catch(() => setProducts([]));
    }, []);

    async function loadPurchases() {
        setLoading(true);
        setError("");

        try {
            const data = await fetchPurchases();
            setPurchases(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    /* =====================================================
       FILTRE
    ====================================================== */

    const filteredPurchases = useMemo(() => {
        const query = search.toLowerCase().trim();

        return purchases.filter((purchase) => {
            const matchesSearch =
                !query ||
                purchase.number.toLowerCase().includes(query) ||
                purchase.supplierName.toLowerCase().includes(query);

            const matchesStatus = statusFilter === "Tous" || purchase.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [purchases, search, statusFilter]);

    /* =====================================================
       STATISTIQUES
    ====================================================== */

    const totalPurchases = purchases.length;
    const receivedPurchases = purchases.filter((p) => p.status === "Reçu").length;
    const orderedPurchases = purchases.filter((p) => p.status === "Commandé").length;
    const totalAmount = purchases.reduce((total, p) => total + calculateTotal(p), 0);

    /* =====================================================
       FORMULAIRE
    ====================================================== */

    function openAddForm() {
        setEditingPurchase(null);
        setShowForm(true);
    }

    function openEditForm(purchase) {
        if (purchase.status === "Reçu") {
            alert("Un achat déjà reçu ne peut plus être modifié.");
            return;
        }
        setEditingPurchase(purchase);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingPurchase(null);
    }

    async function handleSave(purchaseData) {
        try {
            if (editingPurchase) {
                const updated = await updatePurchase(editingPurchase.id, purchaseData);

                setPurchases((previous) =>
                    previous.map((purchase) =>
                        purchase.id === editingPurchase.id ? updated : purchase
                    )
                );
            } else {
                const created = await createPurchase(purchaseData);

                setPurchases((previous) => [created, ...previous]);
            }

            closeForm();
        } catch (err) {
            alert(err.message);
        }
    }

    /* =====================================================
       SUPPRESSION
    ====================================================== */

    async function deletePurchase(id) {
        const purchase = purchases.find((item) => item.id === id);
        if (!purchase) return;

        if (purchase.status === "Reçu") {
            alert("Un achat reçu ne peut pas être supprimé.");
            return;
        }

        const confirmed = window.confirm(`Voulez-vous vraiment supprimer ${purchase.number} ?`);
        if (!confirmed) return;

        try {
            await deletePurchaseRequest(id);
            setPurchases((previous) => previous.filter((item) => item.id !== id));
        } catch (err) {
            alert(err.message);
        }
    }

    /* =====================================================
       RÉCEPTION ACHAT
    ====================================================== */

    async function receivePurchase(purchase) {
        if (purchase.status === "Reçu") {
            alert("Cet achat a déjà été reçu.");
            return;
        }
        if (purchase.status === "Annulé") {
            alert("Un achat annulé ne peut pas être reçu.");
            return;
        }

        const confirmed = window.confirm(
            `Confirmer la réception de ${purchase.number} ?\n\nLe stock des produits sera automatiquement augmenté.`
        );
        if (!confirmed) return;

        try {
            const updated = await receivePurchaseRequest(purchase.id);

            setPurchases((previous) =>
                previous.map((item) => (item.id === purchase.id ? updated : item))
            );

            if (selectedPurchase?.id === purchase.id) {
                setSelectedPurchase(updated);
            }

            alert(`Achat ${purchase.number} marqué comme reçu. Le stock a été mis à jour.`);
        } catch (err) {
            alert(err.message);
        }
    }

    /* =====================================================
       DETAILS
    ====================================================== */

    function openDetails(purchase) {
        setSelectedPurchase(purchase);
        setShowDetails(true);
    }

    function closeDetails() {
        setShowDetails(false);
        setSelectedPurchase(null);
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Achats</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gérez vos commandes d'achat et leurs réceptions.
                    </p>
                </div>
                <button
                    onClick={openAddForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--couleur-principale)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--couleur-hover)]"
                >
                    <Plus size={18} />
                    Nouvel achat
                </button>
            </div>

            {/* STATISTIQUES */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total achats</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{totalPurchases}</p>
                        </div>
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <ShoppingCart size={22} />
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Reçus</p>
                            <p className="mt-2 text-2xl font-bold text-green-600">{receivedPurchases}</p>
                        </div>
                        <div className="rounded-xl bg-green-50 p-3 text-green-600">
                            <CheckCircle2 size={22} />
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Commandés</p>
                            <p className="mt-2 text-2xl font-bold text-blue-600">{orderedPurchases}</p>
                        </div>
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <Truck size={22} />
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Montant total</p>
                            <p className="mt-2 text-xl font-bold text-gray-900">{formatPrice(totalAmount)}</p>
                        </div>
                        <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                            <Receipt size={22} />
                        </div>
                    </div>
                </div>
            </div>

            {/* RECHERCHE / FILTRE */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher par numéro ou fournisseur..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--input-border)] focus:ring-2 focus:ring-[var(--input-border)]"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
                    >
                        <option value="Tous">Tous les statuts</option>
                        <option value="Brouillon">Brouillon</option>
                        <option value="Commandé">Commandé</option>
                        <option value="Reçu">Reçu</option>
                        <option value="Annulé">Annulé</option>
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
                    <table className="w-full min-w-[1100px] text-left">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Numéro</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Fournisseur</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Date</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Produits</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Total</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Statut</th>
                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-500">
                                        Chargement des achats...
                                    </td>
                                </tr>
                            )}

                            {!loading && filteredPurchases.map((purchase) => (
                                <tr key={purchase.id} className="transition hover:bg-gray-50">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-gray-900">{purchase.number}</p>
                                        <p className="text-xs text-gray-500">Achat #{purchase.id}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                <Truck size={18} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{purchase.supplierName}</p>
                                                <p className="text-xs text-gray-500">Fournisseur</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={15} />
                                            {formatDate(purchase.date)}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {purchase.products.length} produit{purchase.products.length > 1 ? "s" : ""}
                                            </p>
                                            <p className="max-w-[220px] truncate text-xs text-gray-500">
                                                {purchase.products.map((p) => p.productName).join(", ")}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-gray-900">{formatPrice(calculateTotal(purchase))}</p>
                                        {purchase.discount > 0 && (
                                            <p className="text-xs text-green-600">Remise : -{formatPrice(purchase.discount)}</p>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge status={purchase.status} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => openDetails(purchase)}
                                                title="Voir détails"
                                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                            >
                                                <Eye size={17} />
                                            </button>
                                            <button
                                                onClick={() => openEditForm(purchase)}
                                                title="Modifier"
                                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-green-600"
                                            >
                                                <Pencil size={17} />
                                            </button>
                                            {purchase.status !== "Reçu" && purchase.status !== "Annulé" && (
                                                <button
                                                    onClick={() => receivePurchase(purchase)}
                                                    title="Recevoir"
                                                    className="rounded-lg p-2 text-gray-500 hover:bg-green-50 hover:text-green-600"
                                                >
                                                    <CheckCircle2 size={17} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deletePurchase(purchase.id)}
                                                title="Supprimer"
                                                className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredPurchases.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-5 py-12 text-center">
                                        <ShoppingCart size={40} className="mx-auto text-gray-300" />
                                        <p className="mt-3 font-medium text-gray-700">Aucun achat trouvé</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL AJOUT / MODIFICATION */}
            {showForm && (
                <PurchaseForm
                    initialPurchase={editingPurchase}
                    suppliers={suppliers}
                    products={products}
                    onSave={handleSave}
                    onClose={closeForm}
                />
            )}

            {/* MODAL DETAILS */}
            {showDetails && selectedPurchase && (
                <PurchaseDetails
                    purchase={selectedPurchase}
                    onClose={closeDetails}
                    onReceive={receivePurchase}
                />
            )}
        </div>
    );
}