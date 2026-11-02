import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    SlidersHorizontal,
    ArrowUpDown,
    Eye,
    Pencil,
    Trash2,
    Package,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import ProductForm from "./ProductForm";
import ProductDetails from "./ProductsDetail";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct as deleteProductRequest,
} from "../../data/products.js";

function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
}

function getStockStatus(product) {
    if (product.stock === 0) {
        return { label: "Rupture", className: "bg-red-50 text-red-600" };
    }

    if (product.stock <= product.minStock) {
        return {
            label: "Stock faible",
            className: "bg-orange-50 text-orange-600",
        };
    }

    return { label: "En stock", className: "bg-green-50 text-green-600" };
}

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("Toutes");
    const [statusFilter, setStatusFilter] = useState("Tous");
    const [sortBy, setSortBy] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);

    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const productsPerPage = 5;

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        setLoading(true);
        setError("");

        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const categories = [
        "Toutes",
        ...new Set(products.map((product) => product.category)),
    ];

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (search.trim()) {
            const query = search.toLowerCase();

            result = result.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.sku.toLowerCase().includes(query) ||
                    product.barcode.includes(query) ||
                    product.brand.toLowerCase().includes(query)
            );
        }

        if (categoryFilter !== "Toutes") {
            result = result.filter(
                (product) => product.category === categoryFilter
            );
        }

        if (statusFilter === "Actifs") {
            result = result.filter((product) => product.active);
        }

        if (statusFilter === "Inactifs") {
            result = result.filter((product) => !product.active);
        }

        if (statusFilter === "Rupture") {
            result = result.filter((product) => product.stock === 0);
        }

        if (statusFilter === "Stock faible") {
            result = result.filter(
                (product) => product.stock > 0 && product.stock <= product.minStock
            );
        }

        result.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "stock") return b.stock - a.stock;
            if (sortBy === "price") return b.sellingPrice - a.sellingPrice;
            if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
            return 0;
        });

        return result;
    }, [products, search, categoryFilter, statusFilter, sortBy]);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    function openAddForm() {
        setEditingProduct(null);
        setShowForm(true);
    }

    function openEditForm(product) {
        setEditingProduct(product);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingProduct(null);
    }

    async function handleFormSubmit(productData) {
        try {
            if (editingProduct) {
                const updated = await updateProduct(editingProduct.id, productData);

                setProducts((previous) =>
                    previous.map((product) =>
                        product.id === editingProduct.id ? updated : product
                    )
                );
            } else {
                const created = await createProduct(productData);

                setProducts((previous) => [created, ...previous]);
            }

            closeForm();
        } catch (err) {
            alert(err.message);
        }
    }

    async function deleteProduct(id) {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer ce produit ?"
        );

        if (!confirmed) return;

        try {
            await deleteProductRequest(id);
            setProducts((previous) => previous.filter((product) => product.id !== id));
        } catch (err) {
            alert(err.message);
        }
    }

    function openDetails(product) {
        setSelectedProduct(product);
        setShowDetails(true);
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Produits
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Gérez votre catalogue de produits et votre stock.
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--couleur-principale)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--couleur-hover)]"
                >
                    <Plus size={18} />
                    Ajouter un produit
                </button>
            </div>

            {/* STATISTIQUES RAPIDES */}
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Total produits</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        {products.length}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">En stock</p>
                    <p className="mt-1 text-2xl font-bold text-green-600">
                        {
                            products.filter(
                                (product) => product.stock > product.minStock
                            ).length
                        }
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Stock faible</p>
                    <p className="mt-1 text-2xl font-bold text-orange-500">
                        {
                            products.filter(
                                (product) =>
                                    product.stock > 0 &&
                                    product.stock <= product.minStock
                            ).length
                        }
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">En rupture</p>
                    <p className="mt-1 text-2xl font-bold text-red-600">
                        {products.filter((product) => product.stock === 0).length}
                    </p>
                </div>
            </div>

            {/* BARRE DE RECHERCHE */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
                    <div className="relative lg:col-span-2">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Rechercher par nom, SKU, code-barres..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--input-border)] focus:ring-2 focus:ring-[var(--input-border)]"
                        />
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                        <option value="Tous">Tous les statuts</option>
                        <option value="Actifs">Actifs</option>
                        <option value="Inactifs">Inactifs</option>
                        <option value="Rupture">En rupture</option>
                        <option value="Stock faible">Stock faible</option>
                    </select>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <SlidersHorizontal size={16} />
                        Filtres :
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                        <option value="name">Nom</option>
                        <option value="stock">Stock</option>
                        <option value="price">Prix</option>
                        <option value="date">Date</option>
                    </select>

                    <ArrowUpDown size={16} className="text-gray-400" />
                </div>
            </div>

            {error && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error} — vérifie que le serveur backend est démarré sur
                    le port attendu.
                </div>
            )}

            {/* TABLEAU */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Produit
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    SKU
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Catégorie
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Prix vente
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Stock
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Statut
                                </th>
                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-12 text-center text-sm text-gray-500"
                                    >
                                        Chargement des produits...
                                    </td>
                                </tr>
                            )}

                            {!loading && paginatedProducts.map((product) => {
                                const stockStatus = getStockStatus(product);

                                return (
                                    <tr
                                        key={product.id}
                                        className="transition hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                                    <Package size={19} />
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {product.name}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {product.brand}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {product.sku}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {product.category}
                                        </td>

                                        <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                            {formatPrice(product.sellingPrice)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="text-sm font-medium text-gray-900">
                                                {product.stock}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${stockStatus.className}`}
                                            >
                                                {stockStatus.label}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => openDetails(product)}
                                                    title="Voir détails"
                                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                <button
                                                    onClick={() => openEditForm(product)}
                                                    title="Modifier"
                                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-green-600"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    onClick={() => deleteProduct(product.id)}
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

                            {!loading && paginatedProducts.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-5 py-12 text-center">
                                        <Package
                                            size={40}
                                            className="mx-auto text-gray-300"
                                        />

                                        <p className="mt-3 font-medium text-gray-700">
                                            Aucun produit trouvé
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Essayez de modifier vos filtres.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
                    <p className="text-sm text-gray-500">
                        {filteredProducts.length} produit(s)
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((page) => page - 1)}
                            className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={17} />
                        </button>

                        <span className="text-sm text-gray-600">
                            Page {currentPage} / {Math.max(totalPages, 1)}
                        </span>

                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage((page) => page + 1)}
                            className="rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight size={17} />
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL AJOUT / MODIFICATION */}
            {showForm && (
                <ProductForm
                    editingProduct={editingProduct}
                    onClose={closeForm}
                    onSubmit={handleFormSubmit}
                />
            )}

            {/* MODAL DÉTAILS */}
            {showDetails && selectedProduct && (
                <ProductDetails
                    product={selectedProduct}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </div>
    );
}