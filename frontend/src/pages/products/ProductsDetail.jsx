import { X } from "lucide-react";

function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
}

export default function ProductDetails({ product, onClose }) {
    const rows = [
        ["Nom", product.name],
        ["SKU", product.sku],
        ["Code-barres", product.barcode],
        ["Catégorie", product.category],
        ["Marque", product.brand],
        ["Unité", product.unit],
        ["Prix d'achat", formatPrice(product.purchasePrice)],
        ["Prix de vente", formatPrice(product.sellingPrice)],
        ["Stock", product.stock],
        ["Stock minimum", product.minStock],
        ["Stock maximum", product.maxStock],
        ["Emplacement", product.location],
        ["Fournisseur", product.supplier],
        ["Créé le", product.createdAt],
        ["Modifié le", product.updatedAt],
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Détails du produit
                        </h2>

                        <p className="text-sm text-gray-500">{product.sku}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                    {rows.map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">{label}</p>

                            <p className="mt-1 font-medium text-gray-900">
                                {value || "-"}
                            </p>
                        </div>
                    ))}

                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">Statut</p>

                        <p className="mt-1 font-medium">
                            {product.active ? "Actif" : "Inactif"}
                        </p>
                    </div>

                    <div className="sm:col-span-2 rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">Description</p>

                        <p className="mt-1 text-sm text-gray-700">
                            {product.description || "-"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}