import { X, CheckCircle2 } from "lucide-react";

function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
}

function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
}

function calculateSubtotal(sale) {
    return sale.products.reduce(
        (total, product) => total + Number(product.quantity) * Number(product.unitPrice),
        0
    );
}

function calculateTotal(sale) {
    return calculateSubtotal(sale) - Number(sale.discount || 0) + Number(sale.tax || 0);
}

function StatusBadge({ status }) {
    const classNameByStatus = {
        Brouillon: "bg-gray-100 text-gray-600",
        "En attente": "bg-orange-50 text-orange-600",
        Validée: "bg-green-50 text-green-600",
        Annulée: "bg-red-50 text-red-600",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                classNameByStatus[status] || "bg-gray-100 text-gray-600"
            }`}
        >
            {status}
        </span>
    );
}

export default function SalesDetails({ sale, onClose, onValidate }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                    <div>
                        <h2 className="font-semibold text-gray-900">{sale.number}</h2>
                        <p className="text-sm text-gray-500">
                            Détails de la facture
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-5 p-5">
                    {/* INFOS */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">Client</p>
                            <p className="mt-1 font-medium text-gray-900">
                                {sale.customerName}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="mt-1 font-medium text-gray-900">
                                {formatDate(sale.date)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">Paiement</p>
                            <p className="mt-1 font-medium text-gray-900">
                                {sale.paymentMethod}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">Statut</p>
                            <div className="mt-2">
                                <StatusBadge status={sale.status} />
                            </div>
                        </div>
                    </div>

                    {/* PRODUITS */}
                    <div>
                        <h3 className="mb-3 font-semibold text-gray-900">
                            Produits
                        </h3>

                        <div className="overflow-hidden rounded-xl border border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px] text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">
                                                Produit
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs uppercase text-gray-500">
                                                Quantité
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs uppercase text-gray-500">
                                                Prix
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs uppercase text-gray-500">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {sale.products.map((product, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3 font-medium text-gray-900">
                                                    {product.productName}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-600">
                                                    {product.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-600">
                                                    {formatPrice(product.unitPrice)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                                    {formatPrice(
                                                        product.quantity * product.unitPrice
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* TOTAL */}
                    <div className="ml-auto max-w-sm rounded-xl bg-gray-50 p-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Sous-total</span>
                            <span className="font-medium text-gray-900">
                                {formatPrice(calculateSubtotal(sale))}
                            </span>
                        </div>

                        <div className="mt-2 flex justify-between text-sm">
                            <span className="text-gray-500">Remise</span>
                            <span className="text-green-600">
                                -{formatPrice(sale.discount)}
                            </span>
                        </div>

                        <div className="mt-2 flex justify-between text-sm">
                            <span className="text-gray-500">Taxe</span>
                            <span className="text-gray-900">
                                {formatPrice(sale.tax)}
                            </span>
                        </div>

                        <div className="mt-3 border-t border-gray-200 pt-3">
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-900">
                                    Total
                                </span>
                                <span className="text-xl font-bold text-blue-600">
                                    {formatPrice(calculateTotal(sale))}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* UTILISATEUR */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">Utilisateur</p>
                        <p className="mt-1 font-medium text-gray-900">{sale.user}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 p-5">
                    {sale.status !== "Validée" && sale.status !== "Annulée" && (
                        <button
                            onClick={() => onValidate(sale)}
                            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                        >
                            <CheckCircle2 size={17} />
                            Valider la vente
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}