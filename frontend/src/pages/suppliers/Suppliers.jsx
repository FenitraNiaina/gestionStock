import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Truck, Package } from "lucide-react";
import SupplierForm from "./SuppliersForm";
import SuppliersDetail from "./SuppliersDetails";
import {
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier as deleteSupplierRequest,
} from "../../data/suppliers";

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    useEffect(() => {
        loadSuppliers();
    }, []);

    async function loadSuppliers() {
        setLoading(true);
        setError("");

        try {
            const data = await fetchSuppliers();
            setSuppliers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const filteredSuppliers = useMemo(() => {
        if (!search.trim()) {
            return suppliers;
        }

        const query = search.toLowerCase();

        return suppliers.filter(
            (supplier) =>
                supplier.name.toLowerCase().includes(query) ||
                supplier.company.toLowerCase().includes(query) ||
                supplier.email.toLowerCase().includes(query)
        );
    }, [suppliers, search]);

    function openAddForm() {
        setEditingSupplier(null);
        setShowForm(true);
    }

    function openEditForm(supplier) {
        setEditingSupplier(supplier);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingSupplier(null);
    }

    async function handleFormSubmit(form) {
        try {
            if (editingSupplier) {
                const updated = await updateSupplier(editingSupplier.id, form);

                setSuppliers((previous) =>
                    previous.map((supplier) =>
                        supplier.id === editingSupplier.id ? updated : supplier
                    )
                );
            } else {
                const created = await createSupplier(form);

                setSuppliers((previous) => [...previous, created]);
            }

            closeForm();
        } catch (err) {
            alert(err.message);
        }
    }

    async function deleteSupplier(id) {
        const supplier = suppliers.find((item) => item.id === id);

        if (supplier.products > 0) {
            alert(
                "Impossible de supprimer ce fournisseur car il est associé à des produits."
            );
            return;
        }

        if (!window.confirm("Voulez-vous vraiment supprimer ce fournisseur ?")) {
            return;
        }

        try {
            await deleteSupplierRequest(id);
            setSuppliers((previous) => previous.filter((item) => item.id !== id));
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
                        Fournisseurs
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Gérez vos fournisseurs et leurs produits associés.
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--couleur-principale)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--couleur-hover)]"
                >
                    <Plus size={18} />
                    Ajouter un fournisseur
                </button>
            </div>

            {/* STATISTIQUE */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Total fournisseurs
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {suppliers.length}
                            </p>
                        </div>

                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <Truck size={22} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Produits fournis
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {suppliers.reduce(
                                    (total, supplier) => total + supplier.products,
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
                        placeholder="Rechercher un fournisseur..."
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
                    <table className="w-full min-w-[800px] text-left">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Fournisseur
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Contact
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
                                        Chargement des fournisseurs...
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                filteredSuppliers.map((supplier) => (
                                    <SuppliersDetail
                                        key={supplier.id}
                                        supplier={supplier}
                                        onEdit={openEditForm}
                                        onDelete={deleteSupplier}
                                    />
                                ))}

                            {!loading && filteredSuppliers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-5 py-12 text-center">
                                        <Truck
                                            size={40}
                                            className="mx-auto text-gray-300"
                                        />

                                        <p className="mt-3 font-medium text-gray-700">
                                            Aucun fournisseur trouvé
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
                <SupplierForm
                    editingSupplier={editingSupplier}
                    onClose={closeForm}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
}