import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    User,
    Phone,
    Mail,
    ShoppingBag,
    Eye,
} from "lucide-react";

import CustomersForm from "./CustomersForm";
import CustomersDetails from "./CustomersDetails";
import {
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer as deleteCustomerRequest,
} from "../../data/customers";

const emptyForm = {
    name: "",
    phone: "",
    email: "",
    address: "",
    company: "",
    notes: "",
};

function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
}

function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
}

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const [editingCustomer, setEditingCustomer] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        setLoading(true);
        setError("");

        try {
            const data = await fetchCustomers();
            setCustomers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    /* =========================
       RECHERCHE
    ========================= */

    const filteredCustomers = useMemo(() => {
        if (!search.trim()) return customers;

        const query = search.toLowerCase();

        return customers.filter(
            (customer) =>
                customer.name.toLowerCase().includes(query) ||
                customer.phone.includes(query) ||
                customer.email.toLowerCase().includes(query) ||
                customer.company.toLowerCase().includes(query)
        );
    }, [customers, search]);

    /* =========================
       FORMULAIRE
    ========================= */

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function openAddForm() {
        setEditingCustomer(null);
        setForm(emptyForm);
        setShowForm(true);
    }

    function openEditForm(customer) {
        setEditingCustomer(customer);
        setForm({
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            address: customer.address,
            company: customer.company,
            notes: customer.notes,
        });
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingCustomer(null);
        setForm(emptyForm);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("Le nom du client est obligatoire.");
            return;
        }

        try {
            if (editingCustomer) {
                const updated = await updateCustomer(editingCustomer.id, form);

                setCustomers((previous) =>
                    previous.map((customer) =>
                        customer.id === editingCustomer.id ? updated : customer
                    )
                );
            } else {
                const created = await createCustomer(form);

                setCustomers((previous) => [created, ...previous]);
            }

            closeForm();
        } catch (err) {
            alert(err.message);
        }
    }

    /* =========================
       SUPPRESSION
    ========================= */

    async function deleteCustomer(id) {
        const customer = customers.find((item) => item.id === id);

        if (customer && customer.ordersCount > 0) {
            const confirmed = window.confirm(
                "Ce client possède un historique de commandes. Voulez-vous vraiment le supprimer ?"
            );
            if (!confirmed) return;
        } else {
            if (!window.confirm("Voulez-vous vraiment supprimer ce client ?")) {
                return;
            }
        }

        try {
            await deleteCustomerRequest(id);

            setCustomers((previous) =>
                previous.filter((customer) => customer.id !== id)
            );

            if (selectedCustomer?.id === id) {
                setSelectedCustomer(null);
                setShowDetails(false);
            }
        } catch (err) {
            alert(err.message);
        }
    }

    /* =========================
       DÉTAILS
    ========================= */

    function openDetails(customer) {
        setSelectedCustomer(customer);
        setShowDetails(true);
    }

    function closeDetails() {
        setShowDetails(false);
        setSelectedCustomer(null);
    }

    /* =========================
       STATISTIQUES
    ========================= */

    const totalCustomers = customers.length;

    const totalSpent = customers.reduce(
        (total, customer) => total + customer.totalSpent,
        0
    );

    const totalOrders = customers.reduce(
        (total, customer) => total + customer.ordersCount,
        0
    );

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Clients
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gérez vos clients et leur historique de commandes.
                    </p>
                </div>

                <button
                    onClick={openAddForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--couleur-principale)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--couleur-hover)]"
                >
                    <Plus size={18} />
                    Ajouter un client
                </button>
            </div>

            {/* STATISTIQUES */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total clients</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {totalCustomers}
                            </p>
                        </div>
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <User size={22} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Commandes</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {totalOrders}
                            </p>
                        </div>
                        <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                            <ShoppingBag size={22} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Total dépensé
                            </p>
                            <p className="mt-2 text-xl font-bold text-gray-900">
                                {formatPrice(totalSpent)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-green-50 p-3 text-green-600">
                            <ShoppingBag size={22} />
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
                        placeholder="Rechercher un client..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--input-border)] focus:ring-2 focus:ring-[var(--input-border)]"
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
                    <table className="w-full min-w-[1000px] text-left">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Client
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Contact
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Entreprise
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Commandes
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Total dépensé
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                    Dernière commande
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
                                        Chargement des clients...
                                    </td>
                                </tr>
                            )}

                            {!loading && filteredCustomers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="transition hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {customer.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Client #{customer.id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p className="flex items-center gap-2">
                                                <Phone size={14} />
                                                {customer.phone || "-"}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Mail size={14} />
                                                {customer.email || "-"}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {customer.company || "-"}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-600">
                                            {customer.ordersCount}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                                        {formatPrice(customer.totalSpent)}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {customer.lastOrder
                                            ? formatDate(customer.lastOrder)
                                            : "-"}
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => openDetails(customer)}
                                                title="Voir détails"
                                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                            >
                                                <Eye size={17} />
                                            </button>

                                            <button
                                                onClick={() => openEditForm(customer)}
                                                title="Modifier"
                                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-green-600"
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                onClick={() => deleteCustomer(customer.id)}
                                                title="Supprimer"
                                                className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-5 py-12 text-center">
                                        <User
                                            size={40}
                                            className="mx-auto text-gray-300"
                                        />
                                        <p className="mt-3 font-medium text-gray-700">
                                            Aucun client trouvé
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL AJOUT / MODIFICATION */}
            {showForm && (
                <CustomersForm
                    form={form}
                    editingCustomer={editingCustomer}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={closeForm}
                />
            )}

            {/* MODAL DÉTAILS */}
            {showDetails && selectedCustomer && (
                <CustomersDetails
                    customer={selectedCustomer}
                    onClose={closeDetails}
                />
            )}
        </div>
    );
}