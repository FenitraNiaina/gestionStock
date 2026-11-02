
import { useEffect, useState } from "react";
import {
    Menu,
    Bell,
    Search,
    User,
    LogOut,
    ChevronDown,
    Moon,
    Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../index.css";

export default function Header({ onMenuClick }) {
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);

    // Mode sombre
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("gestionstock_theme") === "dark";
    });

    // Appliquer le thème
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("gestionstock_theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("gestionstock_theme", "light");
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((previous) => !previous);
    };

    const handleLogout = () => {
        localStorage.removeItem("gestionstock_auth");
        navigate("/login", { replace: true });
    };

    const handleNotifications = () => {
        navigate("/dashboard/notifications");
    };

    return (
        <header className="sticky top-0 z-30 h-20 border-b border-gray-200 bg-white/95 backdrop-blur transition-colors dark:border-gray-800 dark:bg-gray-950/95">
            <div className="flex h-full items-center justify-between px-4 sm:px-6">

                {/* =========================
                    GAUCHE
                ========================== */}
                <div className="flex items-center gap-3">

                    {/* Menu mobile */}
                    <button
                        onClick={onMenuClick}
                        className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
                        title="Ouvrir le menu"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Recherche */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-64 rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                </div>

                {/* =========================
                    DROITE
                ========================== */}
                <div className="flex items-center gap-2 sm:gap-4">

                    {/* =========================
                        MODE SOMBRE
                    ========================== */}
                    <button
                        onClick={toggleDarkMode}
                        className="rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                        title={
                            darkMode
                                ? "Activer le mode clair"
                                : "Activer le mode sombre"
                        }
                    >
                        {darkMode ? (
                            <Sun size={21} />
                        ) : (
                            <Moon size={21} />
                        )}
                    </button>

                    {/* =========================
                        NOTIFICATIONS
                    ========================== */}
                    <button
                        onClick={handleNotifications}
                        className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                        title="Notifications"
                    >
                        <Bell size={21} />

                        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                            3
                        </span>
                    </button>

                    {/* =========================
                        PROFIL
                    ========================== */}
                    <div className="relative">

                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {/* Avatar */}
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <User size={19} />
                            </div>

                            {/* Informations utilisateur */}
                            <div className="hidden text-left sm:block">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Administrateur
                                </p>

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Admin
                                </p>
                            </div>

                            <ChevronDown
                                size={16}
                                className="hidden text-gray-400 sm:block"
                            />
                        </button>

                        {/* =========================
                            MENU PROFIL
                        ========================== */}
                        {profileOpen && (
                            <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">

                                {/* Informations */}
                                <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Administrateur
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        admin@gestionstock.com
                                    </p>
                                </div>

                                {/* Mon profil */}
                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate("/dashboard/utilisateurs");
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    <User size={18} />
                                    Mon profil
                                </button>

                                {/* Mode sombre dans le menu */}
                                <button
                                    onClick={toggleDarkMode}
                                    className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    <div className="flex items-center gap-3">
                                        {darkMode ? (
                                            <Sun size={18} />
                                        ) : (
                                            <Moon size={18} />
                                        )}

                                        <span>
                                            {darkMode
                                                ? "Mode clair"
                                                : "Mode sombre"}
                                        </span>
                                    </div>

                                    {/* Indicateur */}
                                    <div
                                        className={`relative h-6 w-11 rounded-full transition ${
                                            darkMode
                                                ? "bg-blue-600"
                                                : "bg-gray-300"
                                        }`}
                                    >
                                        <div
                                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                                darkMode
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            }`}
                                        />
                                    </div>
                                </button>

                                {/* Déconnexion */}
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-gray-800 dark:hover:bg-red-950/20"
                                >
                                    <LogOut size={18} />
                                    Déconnexion
                                </button>

                            </div>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}
