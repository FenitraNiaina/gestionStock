import { useEffect, useState } from "react";
import { X, Barcode } from "lucide-react";
import { fetchCategories } from "../../data/categories";
import { fetchSuppliers } from "../../data/suppliers";

const emptyForm = {
    sku: "",
    barcode: "",
    name: "",
    description: "",
    category: "",
    brand: "",
    unit: "Pièce",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
    minStock: "",
    maxStock: "",
    location: "",
    supplier: "",
    image: "",
    active: true,
};

export default function ProductForm({ editingProduct, onClose, onSubmit }) {
    const [form, setForm] = useState(emptyForm);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(true);

    useEffect(() => {
        fetchCategories()
            .then(setCategories)
            .catch(() => setCategories([]))
            .finally(() => setLoadingCategories(false));

        fetchSuppliers()
            .then(setSuppliers)
            .catch(() => setSuppliers([]))
            .finally(() => setLoadingSuppliers(false));
    }, []);

    useEffect(() => {
        if (editingProduct) {
            setForm({
                ...editingProduct,
                purchasePrice: String(editingProduct.purchasePrice),
                sellingPrice: String(editingProduct.sellingPrice),
                stock: String(editingProduct.stock),
                minStock: String(editingProduct.minStock),
                maxStock: String(editingProduct.maxStock),
            });
        } else {
            setForm(emptyForm);
        }
    }, [editingProduct]);

    function handleInputChange(e) {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!form.name || !form.sku) {
            alert("Le nom et la référence sont obligatoires.");
            return;
        }

        const productData = {
            ...form,
            purchasePrice: Number(form.purchasePrice) || 0,
            sellingPrice: Number(form.sellingPrice) || 0,
            stock: Number(form.stock) || 0,
            minStock: Number(form.minStock) || 0,
            maxStock: Number(form.maxStock) || 0,
        };

        onSubmit(productData);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {editingProduct
                                ? "Modifier le produit"
                                : "Ajouter un produit"}
                        </h2>

                        <p className="text-sm text-gray-500">
                            Renseignez les informations du produit.
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Nom *
                            </label>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Référence / SKU *
                            </label>

                            <input
                                name="sku"
                                value={form.sku}
                                onChange={handleInputChange}
                                required
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Code-barres
                            </label>

                            <div className="relative">
                                <Barcode
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    name="barcode"
                                    value={form.barcode}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Catégorie
                            </label>

                            <select
                                name="category"
                                value={form.category}
                                onChange={handleInputChange}
                                disabled={loadingCategories}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">
                                    {loadingCategories
                                        ? "Chargement..."
                                        : "Sélectionner une catégorie"}
                                </option>

                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}

                                {/* Garde une catégorie existante sur le produit même si elle
                                    a été supprimée entre-temps, pour ne pas perdre la donnée */}
                                {form.category &&
                                    !categories.some(
                                        (category) => category.name === form.category
                                    ) && (
                                        <option value={form.category}>
                                            {form.category} (introuvable)
                                        </option>
                                    )}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Marque
                            </label>

                            <input
                                name="brand"
                                value={form.brand}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Unité
                            </label>

                            <select
                                name="unit"
                                value={form.unit}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            >
                                <option>Pièce</option>
                                <option>Kg</option>
                                <option>Litre</option>
                                <option>Boîte</option>
                                <option>Carton</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Prix d'achat
                            </label>

                            <input
                                type="number"
                                name="purchasePrice"
                                value={form.purchasePrice}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Prix de vente
                            </label>

                            <input
                                type="number"
                                name="sellingPrice"
                                value={form.sellingPrice}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Quantité en stock
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Stock minimum
                            </label>

                            <input
                                type="number"
                                name="minStock"
                                value={form.minStock}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Stock maximum
                            </label>

                            <input
                                type="number"
                                name="maxStock"
                                value={form.maxStock}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Emplacement
                            </label>

                            <input
                                name="location"
                                value={form.location}
                                onChange={handleInputChange}
                                placeholder="Ex : Rayon A1"
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Fournisseur
                            </label>

                            <select
                                name="supplier"
                                value={form.supplier}
                                onChange={handleInputChange}
                                disabled={loadingSuppliers}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">
                                    {loadingSuppliers
                                        ? "Chargement..."
                                        : "Sélectionner un fournisseur"}
                                </option>

                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.name}>
                                        {supplier.name}
                                    </option>
                                ))}

                                {/* Garde un fournisseur existant sur le produit même s'il
                                    a été supprimé entre-temps, pour ne pas perdre la donnée */}
                                {form.supplier &&
                                    !suppliers.some(
                                        (supplier) => supplier.name === form.supplier
                                    ) && (
                                        <option value={form.supplier}>
                                            {form.supplier} (introuvable)
                                        </option>
                                    )}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Image
                            </label>

                            <input
                                type="text"
                                name="image"
                                value={form.image}
                                onChange={handleInputChange}
                                placeholder="URL de l'image"
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-7">
                            <input
                                type="checkbox"
                                name="active"
                                checked={form.active}
                                onChange={handleInputChange}
                                className="h-4 w-4"
                            />

                            <label className="text-sm text-gray-700">
                                Produit actif
                            </label>
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="text-sm font-medium text-gray-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
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
                            {editingProduct ? "Enregistrer" : "Ajouter le produit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}