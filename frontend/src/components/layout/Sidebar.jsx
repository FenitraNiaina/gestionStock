import {
    LayoutDashboard,
    Users,
    Package,
    Tags,
    Truck,
    UserRound,
    ShoppingCart,
    Receipt,
    FileText,
    History,
    BarChart3,
    Settings,
    X,
    ArrowLeftRight,

} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
    {
        label: "Tableau de bord",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        label: "Utilisateurs",
        icon: Users,
        path: "/dashboard/utilisateurs",
    },
    {
        label: "Produits",
        icon: Package,
        path: "/dashboard/produits",
    },
    {
        label: "Catégories",
        icon: Tags,
        path: "/dashboard/categories",
    },
    {
        label: "Fournisseurs",
        icon: Truck,
        path: "/dashboard/fournisseurs",
    },
    {
        label: "Clients",
        icon: UserRound,
        path: "/dashboard/clients",
    },
    {
        label: "Achats",
        icon: ShoppingCart,
        path: "/dashboard/achats",
    },
    {
        label: "Ventes",
        icon: Receipt,
        path: "/dashboard/ventes",
    },
    {
        label: "Factures",
        icon: FileText,
        path: "/dashboard/factures",
    },
    {
        label: "Historique",
        icon: History,
        path: "/dashboard/historique",
    },
    {
        label: "Mouvements de stock",
        icon: ArrowLeftRight,
        path: "/dashboard/mouvements-stock",
    },
    {
        label: "Rapports",
        icon: BarChart3,
        path: "/dashboard/rapports",
    },
    {
        label: "Paramètres",
        icon: Settings,
        path: "/dashboard/parametres",
    },
    
];

import Logo from "../../assets/logo/images.png";
export default function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Overlay mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed left-0 top-0 z-50
                    flex h-screen w-64 flex-col
                    border-r border-gray-200
                    bg-white
                    transition-transform duration-300
                    dark:border-gray-800
                    dark:bg-gray-950

                    lg:translate-x-0

                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Logo */}
                <div className="flex h-20 items-center justify-between border-b border-gray-200 px-5 dark:border-gray-800">

                    <div className="flex items-center gap-3">

                        <img src={Logo} alt="Logo" className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white" />

                        <div>
                            <h1 className="font-bold text-gray-900 dark:text-white">
                                GestionStock
                            </h1>

                            <p className="text-xs text-gray-500">
                                Administration
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">

                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Menu principal
                    </p>

                    <div className="space-y-1">

                        {menuItems.map((item) => {

                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === "/dashboard"}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `
                                        flex items-center gap-3
                                        rounded-xl px-3 py-3
                                        text-sm font-medium
                                        transition-all

                                        ${
                                            isActive
                                                ? "bg-[var(--couleur-principale)] text-white shadow-sm"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
                                        }
                                        `
                                    }
                                >
                                    <Icon size={20} />

                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}

                    </div>

                </nav>

                {/* Footer sidebar */}
                <div className="border-t border-gray-200 p-4 dark:border-gray-800">

                    <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900">

                        <p className="text-xs font-medium text-gray-500">
                            Version
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                            v1.0.0
                        </p>

                    </div>

                </div>

            </aside>
        </>
    );
}