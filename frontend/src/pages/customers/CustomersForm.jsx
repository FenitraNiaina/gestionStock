import { X } from "lucide-react";

export default function CustomersForm({
    form,
    editingCustomer,
    onChange,
    onSubmit,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                    <div>
                        <h2 className="font-semibold text-gray-900">
                            {editingCustomer
                                ? "Modifier le client"
                                : "Ajouter un client"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Renseignez les informations du client.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Nom */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Nom *
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                required
                                placeholder="Nom du client"
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Téléphone */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Téléphone
                            </label>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={onChange}
                                placeholder="+261..."
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                placeholder="client@email.com"
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Entreprise */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Entreprise
                            </label>
                            <input
                                name="company"
                                value={form.company}
                                onChange={onChange}
                                placeholder="Nom de l'entreprise"
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Adresse */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">
                                Adresse
                            </label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={onChange}
                                placeholder="Adresse complète"
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={onChange}
                                rows="4"
                                placeholder="Notes concernant le client..."
                                className="mt-1 w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>
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
                            {editingCustomer
                                ? "Enregistrer"
                                : "Ajouter le client"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}