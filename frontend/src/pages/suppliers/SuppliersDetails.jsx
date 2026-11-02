import { Pencil, Trash2, Truck, Package, Mail, Phone } from "lucide-react";

export default function SuppliersDetail({ supplier, onEdit, onDelete }) {
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Truck size={18} />
                    </div>

                    <div>
                        <p className="font-medium text-gray-900">
                            {supplier.name}
                        </p>

                        <p className="text-xs text-gray-500">
                            {supplier.company || "-"}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-5 py-4">
                <p className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail size={14} className="text-gray-400" />
                    {supplier.email || "-"}
                </p>

                <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <Phone size={13} className="text-gray-400" />
                    {supplier.phone || "-"}
                </p>
            </td>

            <td className="px-5 py-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    <Package size={14} />
                    {supplier.products}
                </span>
            </td>

            <td className="px-5 py-4">
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => onEdit(supplier)}
                        title="Modifier"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                    >
                        <Pencil size={17} />
                    </button>

                    <button
                        onClick={() => onDelete(supplier.id)}
                        title="Supprimer"
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                        <Trash2 size={17} />
                    </button>
                </div>
            </td>
        </tr>
    );
}