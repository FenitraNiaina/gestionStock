import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyForm = {
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
};

export default function SupplierForm({ editingSupplier, onClose, onSubmit }) {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (editingSupplier) {
            setForm({
                name: editingSupplier.name,
                company: editingSupplier.company,
                email: editingSupplier.email,
                phone: editingSupplier.phone,
                address: editingSupplier.address,
            });
        } else {
            setForm(emptyForm);
        }
    }, [editingSupplier]);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("Le nom du fournisseur est obligatoire.");
            return;
        }

        onSubmit(form);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                    <div>
                        <h2 className="font-semibold text-gray-900">
                            {editingSupplier
                                ? "Modifier le fournisseur"
                                : "Ajouter un fournisseur"}
                        </h2>

                        <p className="text-sm text-gray-500">
                            Renseignez les informations.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Nom *
                        </label>

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="Ex : ABC Distribution"
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700">
                            Entreprise
                        </label>

                        <input
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            placeholder="Ex : ABC Distribution SARL"
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="contact@fournisseur.com"
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Téléphone
                            </label>

                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+261 34 00 000 00"
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700">
                            Adresse
                        </label>

                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Adresse du fournisseur..."
                            className="mt-1 w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-[var(--couleur-principale)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--couleur-hover)]"
                        >
                            {editingSupplier ? "Enregistrer" : "Ajouter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}