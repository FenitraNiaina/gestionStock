import { useEffect, useMemo, useState } from "react";
import {
    Users as UsersIcon,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    ShieldCheck,
    UserCheck,
    UserX,
    Mail,
    Phone,
    KeyRound,
    Check,
    Lock,
} from "lucide-react";
import UserForm from "./UsersForm";
import { UserDetailsModal, UserPermissionsModal } from "./UsersDetails";
import {
    fetchUsers,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser as deleteUserRequest,
} from "../../data/users.js";

function getInitials(name) {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getRoleStyle(role) {
    const styles = {
        Administrateur: "bg-purple-100 text-purple-700",
        Gestionnaire: "bg-blue-100 text-blue-700",
        Vendeur: "bg-green-100 text-green-700",
        Magasinier: "bg-orange-100 text-orange-700",
        Consultation: "bg-gray-100 text-gray-700",
    };

    return styles[role] || "bg-gray-100 text-gray-700";
}

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("Tous");
    const [statusFilter, setStatusFilter] = useState("Tous");

    const [showModal, setShowModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showPermissions, setShowPermissions] = useState(false);

    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        setError("");

        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const searchMatch =
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.phone.toLowerCase().includes(search.toLowerCase());

            const roleMatch =
                roleFilter === "Tous" || user.role === roleFilter;

            const statusMatch =
                statusFilter === "Tous" || user.status === statusFilter;

            return searchMatch && roleMatch && statusMatch;
        });
    }, [users, search, roleFilter, statusFilter]);

    const statistics = useMemo(() => {
        return {
            total: users.length,
            active: users.filter((user) => user.status === "Actif").length,
            inactive: users.filter((user) => user.status === "Inactif")
                .length,
            admins: users.filter((user) => user.role === "Administrateur")
                .length,
        };
    }, [users]);

    function openAddModal() {
        setEditingUser(null);
        setShowModal(true);
    }

    function openEditModal(user) {
        setEditingUser(user);
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEditingUser(null);
    }

    async function handleFormSubmit(form) {
        try {
            if (editingUser) {
                const updated = await updateUser(editingUser.id, form);

                setUsers((previous) =>
                    previous.map((user) =>
                        user.id === editingUser.id ? updated : user
                    )
                );

                alert("Utilisateur modifié avec succès.");
            } else {
                const created = await createUser(form);

                setUsers((previous) => [created, ...previous]);

                alert("Utilisateur ajouté avec succès.");
            }

            closeModal();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleDeleteUser(user) {
        const confirmed = window.confirm(
            `Voulez-vous supprimer l'utilisateur "${user.name}" ?`
        );

        if (!confirmed) return;

        try {
            await deleteUserRequest(user.id);

            setUsers((previous) => previous.filter((item) => item.id !== user.id));

            if (selectedUser?.id === user.id) {
                setSelectedUser(null);
                setShowDetails(false);
            }
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleToggleStatus(user) {
        try {
            const updated = await toggleUserStatus(user.id);

            setUsers((previous) =>
                previous.map((item) => (item.id === user.id ? updated : item))
            );
        } catch (err) {
            alert(err.message);
        }
    }

    function openDetails(user) {
        setSelectedUser(user);
        setShowDetails(true);
    }

    function openPermissions(user) {
        setSelectedUser(user);
        setShowPermissions(true);
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* HEADER */}
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <UsersIcon size={24} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Utilisateurs
                                </h1>

                                <p className="text-sm text-gray-500">
                                    Gérez les comptes, rôles et accès des
                                    utilisateurs.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[var(--couleur-principale)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--couleur-hover)] active:scale-[0.99]"
                    >
                        <Plus size={19} />
                        Nouvel utilisateur
                    </button>
                </div>

                {/* STATISTIQUES */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total utilisateurs"
                        value={statistics.total}
                        icon={UsersIcon}
                        iconClass="bg-blue-100 text-blue-600"
                    />

                    <StatCard
                        title="Utilisateurs actifs"
                        value={statistics.active}
                        icon={UserCheck}
                        iconClass="bg-green-100 text-green-600"
                    />

                    <StatCard
                        title="Utilisateurs inactifs"
                        value={statistics.inactive}
                        icon={UserX}
                        iconClass="bg-red-100 text-red-600"
                    />

                    <StatCard
                        title="Administrateurs"
                        value={statistics.admins}
                        icon={ShieldCheck}
                        iconClass="bg-purple-100 text-purple-600"
                    />
                </div>

                {/* FILTRES */}
                <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="relative">
                            <Search
                                size={19}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Rechercher un utilisateur..."
                                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--input-border)] focus:ring-2 focus:ring-[var(--input-border)]"
                            />
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(event) =>
                                setRoleFilter(event.target.value)
                            }
                            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
                        >
                            <option value="Tous">Tous les rôles</option>
                            <option value="Administrateur">
                                Administrateur
                            </option>
                            <option value="Gestionnaire">Gestionnaire</option>
                            <option value="Vendeur">Vendeur</option>
                            <option value="Magasinier">Magasinier</option>
                            <option value="Consultation">Consultation</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500"
                        >
                            <option value="Tous">Tous les statuts</option>
                            <option value="Actif">Actif</option>
                            <option value="Inactif">Inactif</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error} — vérifie que le serveur backend est démarré
                        sur le port attendu.
                    </div>
                )}

                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-5 py-4">
                        <h2 className="font-semibold text-gray-900">
                            Liste des utilisateurs
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            {filteredUsers.length} utilisateur(s) affiché(s)
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[950px]">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    <th className="px-5 py-4">Utilisateur</th>
                                    <th className="px-5 py-4">Contact</th>
                                    <th className="px-5 py-4">Rôle</th>
                                    <th className="px-5 py-4">Statut</th>
                                    <th className="px-5 py-4">
                                        Dernière connexion
                                    </th>
                                    <th className="px-5 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {loading && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-10 text-center text-sm text-gray-500"
                                        >
                                            Chargement des utilisateurs...
                                        </td>
                                    </tr>
                                )}

                                {!loading && filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="transition hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                                    {getInitials(user.name)}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {user.name}
                                                    </p>

                                                    <p className="text-xs text-gray-400">
                                                        Créé le{" "}
                                                        {user.createdAt}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="flex items-center gap-2 text-sm text-gray-700">
                                                <Mail
                                                    size={15}
                                                    className="text-gray-400"
                                                />
                                                {user.email}
                                            </p>

                                            <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                                <Phone
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                                {user.phone ||
                                                    "Non renseigné"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(
                                                    user.role
                                                )}`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() =>
                                                    handleToggleStatus(user)
                                                }
                                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                                    user.status === "Actif"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                <span
                                                    className={`h-2 w-2 rounded-full ${
                                                        user.status ===
                                                        "Actif"
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                    }`}
                                                />
                                                {user.status}
                                            </button>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {user.lastLogin}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-1">
                                                <ActionButton
                                                    title="Voir"
                                                    onClick={() =>
                                                        openDetails(user)
                                                    }
                                                >
                                                    <Eye size={17} />
                                                </ActionButton>

                                                <ActionButton
                                                    title="Permissions"
                                                    onClick={() =>
                                                        openPermissions(user)
                                                    }
                                                >
                                                    <KeyRound size={17} />
                                                </ActionButton>

                                                <ActionButton
                                                    title="Modifier"
                                                    onClick={() =>
                                                        openEditModal(user)
                                                    }
                                                >
                                                    <Edit size={17} />
                                                </ActionButton>

                                                <ActionButton
                                                    title={
                                                        user.status ===
                                                        "Actif"
                                                            ? "Désactiver"
                                                            : "Activer"
                                                    }
                                                    onClick={() =>
                                                        handleToggleStatus(user)
                                                    }
                                                >
                                                    {user.status ===
                                                    "Actif" ? (
                                                        <Lock size={17} />
                                                    ) : (
                                                        <Check size={17} />
                                                    )}
                                                </ActionButton>

                                                <ActionButton
                                                    title="Supprimer"
                                                    danger
                                                    onClick={() =>
                                                        handleDeleteUser(user)
                                                    }
                                                >
                                                    <Trash2 size={17} />
                                                </ActionButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {!loading && filteredUsers.length === 0 && (
                        <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">
                            <UsersIcon
                                size={45}
                                className="mb-3 text-gray-300"
                            />

                            <h3 className="font-semibold text-gray-900">
                                Aucun utilisateur trouvé
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Modifiez vos critères de recherche.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL AJOUT / MODIFICATION */}
            {showModal && (
                <UserForm
                    editingUser={editingUser}
                    onClose={closeModal}
                    onSubmit={handleFormSubmit}
                />
            )}

            {/* MODAL DETAILS */}
            {showDetails && selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setShowDetails(false)}
                />
            )}

            {/* MODAL PERMISSIONS */}
            {showPermissions && selectedUser && (
                <UserPermissionsModal
                    user={selectedUser}
                    onClose={() => setShowPermissions(false)}
                />
            )}
        </div>
    );
}

/* =========================
   COMPOSANTS
========================= */

function StatCard({ title, value, icon: Icon, iconClass }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        {value}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={21} />
                </div>
            </div>
        </div>
    );
}

function ActionButton({ children, title, onClick, danger = false }) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`rounded-lg p-2 transition ${
                danger
                    ? "text-gray-500 hover:bg-red-100 hover:text-red-600"
                    : "text-gray-500 hover:bg-blue-100 hover:text-blue-600"
            }`}
        >
            {children}
        </button>
    );
}