import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Folder, Package } from "lucide-react";
import CategoryForm from "./CategoryForm";
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory as deleteCategoryRequest,
} from "../../data/categories.js";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        setLoading(true);
        setError("");

        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const filteredCategories = useMemo(() => {
        if (!search.trim()) {
            return categories;
        }

        const query = search.toLowerCase();

        return categories.filter(
            (category) =>
                category.name.toLowerCase().includes(query) ||
                category.description.toLowerCase().includes(query)
        );
    }, [categories, search]);

    function openAddForm() {
        setEditingCategory(null);
        setShowForm(true);
    }

    function openEditForm(category) {
        setEditingCategory(category);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingCategory(null);
    }

    async function handleFormSubmit(form) {
        try {
            if (editingCategory) {
                const updated = await updateCategory(editingCategory.id, form);

                setCategories((previous) =>
                    previous.map((category) =>
                        category.id === editingCategory.id ? updated : category
                    )
                );
            } else {
                const created = await createCategory(form);

                setCategories((previous) => [...previous, created]);
            }

            closeForm();
        } catch (err) {
            alert(err.message);
        }
    }

    async function deleteCategory(id) {
        const category = categories.find((item) => item.id === id);

        if (category.products > 0) {
            alert(
                "Impossible de supprimer cette catégorie car elle contient des produits."
            );
            return;
        }

        if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
            return;
        }

        try {
            await deleteCategoryRequest(id);
            setCategories((previous) => previous.filter((item) => item.id !== id));
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Catégories
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Organisez vos produits par catégorie.
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--couleur-principale)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--couleur-hover)]"
                >
                    <Plus size={18} />
                    Ajouter une catégorie
                </button>
            </div>

            {/* STATISTIQUE */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Total catégories
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {categories.length}
                            </p>
                        </div>

                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <Folder size={22} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Produits catégorisés
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {categories.reduce(
                                    (total, category) => total + category.products,
                                    0
                                )}
                            </p>
                        </div>

                        <div className="rounded-xl bg-green-50 p-3 text-green-600">
                            <Package size={22} />
                        </div>
                    </div>
                </div>
            </div>

            {/* RECHERCHE */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="relative max-w-xl">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher une catégorie..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[var(--input-border)] focus:ring-2 focus:ring-[var(--input-border)]"
                    />
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error} — vérifie que le serveur backend est démarré sur
                    le port attendu.
                </div>
            )}

            {/* TABLEAU */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Catégorie
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Description
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Nombre de produits
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
                                        colSpan={4}
                                        className="px-5 py-12 text-center text-sm text-gray-500"
                                    >
                                        Chargement des catégories...
                                    </td>
                                </tr>
                            )}

                            {!loading && filteredCategories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <Folder size={18} />
                                            </div>

                                            <span className="font-medium text-gray-900">
                                                {category.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {category.description || "-"}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                            <Package size={14} />
                                            {category.products}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => openEditForm(category)}
                                                title="Modifier"
                                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                onClick={() => deleteCategory(category.id)}
                                                title="Supprimer"
                                                className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && filteredCategories.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-5 py-12 text-center">
                                        <Folder
                                            size={40}
                                            className="mx-auto text-gray-300"
                                        />

                                        <p className="mt-3 font-medium text-gray-700">
                                            Aucune catégorie trouvée
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {showForm && (
                <CategoryForm
                    editingCategory={editingCategory}
                    onClose={closeForm}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
}