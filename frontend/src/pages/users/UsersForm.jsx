import { useEffect, useState } from "react";
import { ShieldCheck, Check, X } from "lucide-react";

const emptyForm = {
    name: "",
    email: "",
    phone: "",
    role: "Vendeur",
    status: "Actif",
    password: "",
};

export const rolePermissions = {
    Administrateur: [
        "Gérer les utilisateurs",
        "Gérer les produits",
        "Gérer les achats",
        "Gérer les ventes",
        "Gérer le stock",
        "Gérer les paramètres",
        "Consulter les rapports",
    ],
    Gestionnaire: [
        "Gérer les produits",
        "Gérer les achats",
        "Gérer les ventes",
        "Gérer le stock",
        "Consulter les rapports",
    ],
    Vendeur: [
        "Créer des ventes",
        "Consulter les produits",
        "Consulter les clients",
        "Gérer les factures",
    ],
    Magasinier: [
        "Gérer le stock",
        "Consulter les produits",
        "Gérer les mouvements",
        "Consulter les fournisseurs",
    ],
    Consultation: [
        "Consulter les produits",
        "Consulter les ventes",
        "Consulter les achats",
        "Consulter les rapports",
    ],
};

export default function UserForm({ editingUser, onClose, onSubmit }) {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (editingUser) {
            setForm({
                name: editingUser.name,
                email: editingUser.email,
                phone: editingUser.phone,
                role: editingUser.role,
                status: editingUser.status,
                password: "",
            });
        } else {
            setForm(emptyForm);
        }
    }, [editingUser]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!form.name.trim() || !form.email.trim()) {
            alert("Veuillez remplir le nom et l'adresse email.");
            return;
        }

        if (!editingUser && !form.password.trim()) {
            alert("Veuillez définir un mot de passe.");
            return;
        }

        onSubmit(form);
    }

    return (
        <Modal
            title={
                editingUser
                    ? "Modifier l'utilisateur"
                    : "Nouvel utilisateur"
            }
            onClose={onClose}
            size="max-w-2xl"
        >
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                        label="Nom complet *"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ex: Jean Rakoto"
                    />

                    <Input
                        label="Adresse email *"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="exemple@email.com"
                    />

                    <Input
                        label="Téléphone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+261 34 00 000 00"
                    />

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Rôle
                        </label>

                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option>Administrateur</option>
                            <option>Gestionnaire</option>
                            <option>Vendeur</option>
                            <option>Magasinier</option>
                            <option>Consultation</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Statut
                        </label>

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option>Actif</option>
                            <option>Inactif</option>
                        </select>
                    </div>

                    <Input
                        label={
                            editingUser
                                ? "Nouveau mot de passe"
                                : "Mot de passe *"
                        }
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder={
                            editingUser
                                ? "Laisser vide pour conserver"
                                : "••••••••"
                        }
                    />
                </div>

                {/* PERMISSIONS */}
                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-blue-600" />

                        <h3 className="text-sm font-semibold text-gray-900">
                            Permissions du rôle
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {rolePermissions[form.role].map((permission) => (
                            <div
                                key={permission}
                                className="flex items-center gap-2 text-sm text-gray-600"
                            >
                                <Check size={15} className="text-green-600" />
                                {permission}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Annuler
                    </button>

                    <button
                        type="submit"
                        className="rounded-xl bg-[var(--couleur-principale)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--couleur-hover)]"
                    >
                        {editingUser
                            ? "Enregistrer les modifications"
                            : "Créer l'utilisateur"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function Input({ label, name, type = "text", value, onChange, placeholder }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
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