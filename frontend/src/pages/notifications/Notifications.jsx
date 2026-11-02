import { useMemo, useState } from "react";
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    AlertTriangle,
    ShoppingCart,
    PackagePlus,
    X,
    Filter,
} from "lucide-react";

const initialNotifications = [
    {
        id: 1,
        type: "warning",
        title: "Stock faible",
        message: "Le produit Coca-Cola est presque en rupture.",
        date: "14/09/2026",
        time: "11:45",
        read: false,
    },
    {
        id: 2,
        type: "danger",
        title: "Rupture de stock",
        message: "Le produit Pepsi est en rupture de stock.",
        date: "14/09/2026",
        time: "10:30",
        read: false,
    },
    {
        id: 3,
        type: "sale",
        title: "Nouvelle vente",
        message: "Une nouvelle vente a été enregistrée.",
        date: "14/09/2026",
        time: "09:20",
        read: true,
    },
    {
        id: 4,
        type: "purchase",
        title: "Nouvel achat",
        message: "Un nouvel achat fournisseur a été enregistré.",
        date: "13/09/2026",
        time: "16:15",
        read: true,
    },
    {
        id: 5,
        type: "warning",
        title: "Stock faible",
        message: "Le produit Fanta est presque en rupture.",
        date: "13/09/2026",
        time: "14:10",
        read: false,
    },
];

const notificationConfig = {
    warning: {
        icon: AlertTriangle,
        bg: "bg-orange-100",
        text: "text-orange-600",
        badge: "bg-orange-100 text-orange-700",
    },
    danger: {
        icon: AlertTriangle,
        bg: "bg-red-100",
        text: "text-red-600",
        badge: "bg-red-100 text-red-700",
    },
    sale: {
        icon: ShoppingCart,
        bg: "bg-green-100",
        text: "text-green-600",
        badge: "bg-green-100 text-green-700",
    },
    purchase: {
        icon: PackagePlus,
        bg: "bg-blue-100",
        text: "text-blue-600",
        badge: "bg-blue-100 text-blue-700",
    },
};

export default function Notifications() {
    const [notifications, setNotifications] = useState(
        initialNotifications
    );

    const [filter, setFilter] = useState("all");

    const unreadCount = useMemo(
        () => notifications.filter((item) => !item.read).length,
        [notifications]
    );

    const filteredNotifications = useMemo(() => {
        if (filter === "unread") {
            return notifications.filter((item) => !item.read);
        }

        if (filter === "read") {
            return notifications.filter((item) => item.read);
        }

        return notifications;
    }, [notifications, filter]);

    function markAsRead(id) {
        setNotifications((previous) =>
            previous.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    }

    function markAllAsRead() {
        setNotifications((previous) =>
            previous.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    }

    function deleteNotification(id) {
        setNotifications((previous) =>
            previous.filter((notification) => notification.id !== id)
        );
    }

    function clearAll() {
        if (notifications.length === 0) return;

        const confirmed = window.confirm(
            "Voulez-vous supprimer toutes les notifications ?"
        );

        if (confirmed) {
            setNotifications([]);
        }
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <Bell size={22} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Notifications
                                </h1>

                                <p className="text-sm text-gray-500">
                                    Consultez les alertes et événements de votre
                                    application.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                <CheckCheck size={18} />
                                Tout marquer comme lu
                            </button>
                        )}

                        {notifications.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                                <Trash2 size={18} />
                                Tout supprimer
                            </button>
                        )}
                    </div>
                </div>

                {/* STATISTIQUES */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total
                                </p>

                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {notifications.length}
                                </p>
                            </div>

                            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                                <Bell size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Non lues
                                </p>

                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {unreadCount}
                                </p>
                            </div>

                            <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                                <AlertTriangle size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Lues
                                </p>

                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {notifications.length - unreadCount}
                                </p>
                            </div>

                            <div className="rounded-xl bg-green-100 p-3 text-green-600">
                                <Check size={22} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* FILTRES */}
                <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Filter size={18} />
                        Filtrer les notifications
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                filter === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Toutes
                        </button>

                        <button
                            onClick={() => setFilter("unread")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                filter === "unread"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Non lues
                        </button>

                        <button
                            onClick={() => setFilter("read")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                filter === "read"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Lues
                        </button>
                    </div>
                </div>

                {/* LISTE */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {filteredNotifications.length === 0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                <Bell size={28} />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900">
                                Aucune notification
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Vous n'avez aucune notification dans cette
                                catégorie.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredNotifications.map((notification) => {
                                const config =
                                    notificationConfig[notification.type];

                                const Icon = config.icon;

                                return (
                                    <div
                                        key={notification.id}
                                        className={`group flex flex-col gap-4 p-5 transition hover:bg-gray-50 sm:flex-row sm:items-center ${
                                            !notification.read
                                                ? "bg-blue-50/40"
                                                : "bg-white"
                                        }`}
                                    >
                                        {/* ICONE */}
                                        <div
                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.text}`}
                                        >
                                            <Icon size={22} />
                                        </div>

                                        {/* CONTENU */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">
                                                    {notification.title}
                                                </h3>

                                                {!notification.read && (
                                                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                                                        Nouveau
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-1 text-sm text-gray-600">
                                                {notification.message}
                                            </p>

                                            <p className="mt-2 text-xs text-gray-400">
                                                {notification.date} à{" "}
                                                {notification.time}
                                            </p>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="flex items-center gap-2">
                                            {!notification.read && (
                                                <button
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                    title="Marquer comme lu"
                                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-green-100 hover:text-green-600"
                                                >
                                                    <Check size={18} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() =>
                                                    deleteNotification(
                                                        notification.id
                                                    )
                                                }
                                                title="Supprimer"
                                                className="rounded-lg p-2 text-gray-500 transition hover:bg-red-100 hover:text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}