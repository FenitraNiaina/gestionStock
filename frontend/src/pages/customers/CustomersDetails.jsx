import { X, User, MapPin } from "lucide-react";

function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
}

function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
}

export default function CustomersDetails({ customer, onClose }) {
    if (!customer) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <User size={20} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                {customer.name}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Détails du client
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Informations */}
                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">Téléphone</p>
                        <p className="mt-1 font-medium text-gray-900">
                            {customer.phone || "-"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="mt-1 font-medium text-gray-900">
                            {customer.email || "-"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">Entreprise</p>
                        <p className="mt-1 font-medium text-gray-900">
                            {customer.company || "-"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">Adresse</p>
                        <p className="mt-1 flex items-center gap-2 font-medium text-gray-900">
                            <MapPin size={15} />
                            {customer.address || "-"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">
                            Nombre de commandes
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                            {customer.ordersCount}
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">
                            Montant total dépensé
                        </p>
                        <p className="mt-1 font-bold text-gray-900">
                            {formatPrice(customer.totalSpent)}
                        </p>
                    </div>
                </div>

                {/* Dernières commandes */}
                <div className="border-t border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900">
                        Dernières commandes
                    </h3>

                    <div className="mt-4 space-y-3">
                        {customer.orders.length > 0 ? (
                            customer.orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {order.id}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(order.date)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                                            {order.status}
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            {formatPrice(order.amount)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
                                Aucune commande enregistrée.
                            </p>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div className="border-t border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900">Notes</h3>
                    <p className="mt-2 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                        {customer.notes || "Aucune note."}
                    </p>
                </div>
            </div>
        </div>
    );
}