import {
    X,
    Mail,
    Phone,
    Calendar,
    ShieldCheck,
    UserCheck,
    UserX,
    Check,
} from "lucide-react";
import { rolePermissions } from "./UsersForm";

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

export function UserDetailsModal({ user, onClose }) {
    return (
        <Modal
            title="Détails de l'utilisateur"
            onClose={onClose}
            size="max-w-xl"
        >
            <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                    {getInitials(user.name)}
                </div>

                <h2 className="mt-3 text-xl font-bold text-gray-900">
                    {user.name}
                </h2>

                <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(
                        user.role
                    )}`}
                >
                    {user.role}
                </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem icon={Mail} label="Email" value={user.email} />

                <InfoItem
                    icon={Phone}
                    label="Téléphone"
                    value={user.phone || "Non renseigné"}
                />

                <InfoItem
                    icon={Calendar}
                    label="Date de création"
                    value={user.createdAt}
                />

                <InfoItem
                    icon={Calendar}
                    label="Dernière connexion"
                    value={user.lastLogin}
                />

                <InfoItem
                    icon={user.status === "Actif" ? UserCheck : UserX}
                    label="Statut"
                    value={user.status}
                />

                <InfoItem
                    icon={ShieldCheck}
                    label="Rôle"
                    value={user.role}
                />
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-900">
                    Permissions
                </h3>

                <div className="space-y-2">
                    {rolePermissions[user.role].map((permission) => (
                        <div
                            key={permission}
                            className="flex items-center gap-2 text-sm text-gray-600"
                        >
                            <Check size={16} className="text-green-600" />
                            {permission}
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}

export function UserPermissionsModal({ user, onClose }) {
    return (
        <Modal
            title={`Permissions — ${user.name}`}
            onClose={onClose}
            size="max-w-lg"
        >
            <div className="mb-5 rounded-xl bg-blue-50 p-4">
                <p className="text-sm text-blue-700">
                    Rôle actuel :
                    <strong className="ml-1">{user.role}</strong>
                </p>
            </div>

            <div className="space-y-3">
                {rolePermissions[user.role].map((permission) => (
                    <div
                        key={permission}
                        className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
                    >
                        <span className="text-sm text-gray-700">
                            {permission}
                        </span>

                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <Check size={16} />
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <Icon size={15} />
                {label}
            </div>

            <p className="mt-1 break-words text-sm font-medium text-gray-800">
                {value}
            </p>
        </div>
    );
}

function Modal({ title, children, onClose, size = "max-w-xl" }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div
                className={`max-h-[90vh] w-full ${size} overflow-y-auto rounded-2xl bg-white shadow-2xl`}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
                    <h2 className="font-semibold text-gray-900">{title}</h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}