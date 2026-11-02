import { useEffect, useState } from "react";
import { X, Plus, Trash2, Package } from "lucide-react";

function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
}

const emptyForm = {
    supplierId: "",
    date: new Date().toISOString().slice(0, 10),
    discount: 0,
    tax: 0,
    status: "Brouillon",
    products: [],
};

export default function PurchaseForm({
    initialPurchase,
    suppliers,
    products,
    onSave,
    onClose,
}) {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (initialPurchase) {
            setForm({
                supplierId: initialPurchase.supplierId,
                date: initialPurchase.date,
                discount: initialPurchase.discount,
                tax: initialPurchase.tax,
                status: initialPurchase.status,
                products: initialPurchase.products.map((product) => ({
                    ...product,
                })),
            });
        } else {
            setForm(emptyForm);
        }
    }, [initialPurchase]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    /* =====================================================
       LIGNES PRODUIT
    ====================================================== */

    function addProductLine() {
        setForm((previous) => ({
            ...previous,
            products: [
                ...previous.products,
                { productId: "", productName: "", quantity: 1, unitPrice: 0 },
            ],
        }));
    }

    function removeProductLine(index) {
        setForm((previous) => ({
            ...previous,
            products: previous.products.filter((_, i) => i !== index),
        }));
    }

    function updateProductLine(index, field, value) {
        setForm((previous) => {
            const updatedProducts = [...previous.products];

            updatedProducts[index] = {
                ...updatedProducts[index],
                [field]: value,
            };

            if (field === "productId") {
                const product = products.find((item) => item.id === Number(value));

                if (product) {
                    updatedProducts[index] = {
                        ...updatedProducts[index],
                        productId: product.id,
                        productName: product.name,
                        unitPrice: product.purchasePrice,
                    };
                }
            }

            return { ...previous, products: updatedProducts };
        });
    }

    const formSubtotal = form.products.reduce(
        (total, product) =>
            total + Number(product.quantity || 0) * Number(product.unitPrice || 0),
        0
    );

    const formTotal =
        formSubtotal - Number(form.discount || 0) + Number(form.tax || 0);

    /* =====================================================
       ENREGISTRER
    ====================================================== */

    function handleSubmit(event) {
        event.preventDefault();

        if (!form.supplierId) {
            alert("Veuillez sélectionner un fournisseur.");
            return;
        }

        if (!form.date) {
            alert("Veuillez sélectionner une date.");
            return;
        }

        if (form.products.length === 0) {
            alert("Ajoutez au moins un produit à l'achat.");
            return;
        }

        const invalidProduct = form.products.some(
            (product) =>
                !product.productId ||
                Number(product.quantity) <= 0 ||
                Number(product.unitPrice) < 0
        );

        if (invalidProduct) {
            alert("Vérifiez les produits, quantités et prix unitaires.");
            return;
        }

        onSave({
            supplierId: Number(form.supplierId),
            date: form.date,
            discount: Number(form.discount || 0),
            tax: Number(form.tax || 0),
            status: form.status,
            products: form.products.map((product) => ({
                productId: Number(product.productId),
                quantity: Number(product.quantity),
                unitPrice: Number(product.unitPrice),
            })),
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                    <div>
                        <h2 className="font-semibold text-gray-900">
                            {initialPurchase ? "Modifier l'achat" : "Nouvel achat"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Créez une commande d'achat.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5">
                    {/* FOURNISSEUR / DATE / STATUT */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Fournisseur *
                            </label>

                            <select
                                name="supplierId"
                                value={form.supplierId}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            >
                                <option value="">Sélectionner</option>

                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Date *
                            </label>

                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Statut
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            >
                                <option value="Brouillon">Brouillon</option>
                                <option value="Commandé">Commandé</option>
                            </select>
                        </div>
                    </div>

                    {/* PRODUITS */}
                    <div className="mt-6">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    Produits
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Ajoutez les produits de la commande.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addProductLine}
                                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                            >
                                <Plus size={16} />
                                Ajouter produit
                            </button>
                        </div>

                        {form.products.length === 0 && (
                            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                                <Package size={35} className="mx-auto text-gray-300" />
                                <p className="mt-2 text-sm text-gray-500">
                                    Aucun produit ajouté.
                                </p>
                                <button
                                    type="button"
                                    onClick={addProductLine}
                                    className="mt-3 text-sm font-medium text-[var(--couleur-principale)] hover:underline"
                                >
                                    Ajouter un produit
                                </button>
                            </div>
                        )}

                        <div className="space-y-3">
                            {form.products.map((product, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                                >
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500">
                                                Produit
                                            </label>

                                            <select
                                                value={product.productId}
                                                onChange={(event) =>
                                                    updateProductLine(
                                                        index,
                                                        "productId",
                                                        event.target.value
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                            >
                                                <option value="">Sélectionner</option>

                                                {products.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-gray-500">
                                                Quantité
                                            </label>

                                            <input
                                                type="number"
                                                min="1"
                                                value={product.quantity}
                                                onChange={(event) =>
                                                    updateProductLine(
                                                        index,
                                                        "quantity",
                                                        event.target.value
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-gray-500">
                                                Prix unitaire
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                value={product.unitPrice}
                                                onChange={(event) =>
                                                    updateProductLine(
                                                        index,
                                                        "unitPrice",
                                                        event.target.value
                                                    )
                                                }
                                                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                onClick={() => removeProductLine(index)}
                                                className="rounded-lg p-2.5 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-right">
                                        <span className="text-xs text-gray-500">
                                            Total ligne :
                                        </span>
                                        <span className="ml-2 text-sm font-semibold text-gray-900">
                                            {formatPrice(
                                                Number(product.quantity || 0) *
                                                    Number(product.unitPrice || 0)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TOTAUX */}
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Remise
                            </label>
                            <input
                                type="number"
                                name="discount"
                                min="0"
                                value={form.discount}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Taxes
                            </label>
                            <input
                                type="number"
                                name="tax"
                                min="0"
                                value={form.tax}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs text-gray-500">Sous-total</p>
                            <p className="mt-1 font-semibold text-gray-900">
                                {formatPrice(formSubtotal)}
                            </p>

                            <p className="mt-2 text-xs text-gray-500">Total</p>
                            <p className="mt-1 text-xl font-bold text-blue-600">
                                {formatPrice(formTotal)}
                            </p>
                        </div>
                    </div>

                    {/* ACTIONS */}
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
                            {initialPurchase ? "Enregistrer" : "Créer l'achat"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}