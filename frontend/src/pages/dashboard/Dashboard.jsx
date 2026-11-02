import {
    Package,
    ShoppingCart,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    DollarSign,
    ShoppingBag,
    Wallet,
} from "lucide-react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";


/* =========================
   DONNÉES FICTIVES
========================= */

const salesByDay = [
    { name: "Lun", ventes: 12 },
    { name: "Mar", ventes: 18 },
    { name: "Mer", ventes: 15 },
    { name: "Jeu", ventes: 25 },
    { name: "Ven", ventes: 30 },
    { name: "Sam", ventes: 38 },
    { name: "Dim", ventes: 28 },
];

const salesByMonth = [
    { name: "Jan", ventes: 120 },
    { name: "Fév", ventes: 145 },
    { name: "Mar", ventes: 180 },
    { name: "Avr", ventes: 165 },
    { name: "Mai", ventes: 210 },
    { name: "Juin", ventes: 245 },
];

const purchasesByMonth = [
    { name: "Jan", achats: 80 },
    { name: "Fév", achats: 110 },
    { name: "Mar", achats: 95 },
    { name: "Avr", achats: 140 },
    { name: "Mai", achats: 125 },
    { name: "Juin", achats: 160 },
];

const stockEvolution = [
    { name: "Jan", stock: 850 },
    { name: "Fév", stock: 920 },
    { name: "Mar", stock: 780 },
    { name: "Avr", stock: 1050 },
    { name: "Mai", stock: 980 },
    { name: "Juin", stock: 1150 },
];

const bestProducts = [
    { name: "Sac tissé PP", ventes: 185 },
    { name: "Film plastique PE", ventes: 162 },
    { name: "Sac poubelle", ventes: 143 },
    { name: "Sac shopping plastique", ventes: 128 },
    { name: "Emballage alimentaire", ventes: 105 },
];

const categories = [
    { name: "Sacs tissés", value: 35 },
    { name: "Films plastiques", value: 25 },
    { name: "Sacs plastiques", value: 20 },
    { name: "Emballages", value: 12 },
    { name: "Produits techniques", value: 8 },
];

const productsToRestock = [
    {
        name: "Sac tissé PP 50 kg",
        stock: 320,
        minimum: 1000,
    },
    {
        name: "Film PE transparent",
        stock: 450,
        minimum: 1500,
    },
    {
        name: "Sac poubelle 50L",
        stock: 280,
        minimum: 1000,
    },
    {
        name: "Sac shopping plastique",
        stock: 190,
        minimum: 800,
    },
];


/* =========================
   CARTE STATISTIQUE
========================= */

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    iconBg,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">

            <div className="flex items-start justify-between">

                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                        {value}
                    </h2>
                </div>

                <div className={`rounded-xl p-3 ${iconBg}`}>
                    <Icon size={22} />
                </div>

            </div>

            <p className="mt-3 text-xs text-gray-500">
                {description}
            </p>

        </div>
    );
}


/* =========================
   DASHBOARD
========================= */

export default function Dashboard() {

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">

            {/* =========================
                EN-TÊTE
            ========================= */}

            <div className="mb-8">

                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Tableau de bord
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Vue générale de votre activité et de votre stock.
                </p>

            </div>


            {/* =========================
                STATISTIQUES
            ========================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

                <StatCard
                    title="Total produits"
                    value="1 248"
                    description="Produits enregistrés"
                    icon={Package}
                    iconBg="bg-blue-50 text-blue-600"
                />

                <StatCard
                    title="Produits en stock"
                    value="1 156"
                    description="Produits actuellement disponibles"
                    icon={ShoppingBag}
                    iconBg="bg-green-50 text-green-600"
                />

                <StatCard
                    title="En rupture"
                    value="32"
                    description="Produits sans stock"
                    icon={AlertTriangle}
                    iconBg="bg-red-50 text-red-600"
                />

                <StatCard
                    title="Bientôt en rupture"
                    value="60"
                    description="Nécessitent une attention"
                    icon={TrendingDown}
                    iconBg="bg-orange-50 text-orange-600"
                />

                <StatCard
                    title="Valeur du stock"
                    value="24 850 000 Ar"
                    description="Valeur totale estimée"
                    icon={Wallet}
                    iconBg="bg-purple-50 text-purple-600"
                />

            </div>


            {/* =========================
                VENTES / ACHATS
            ========================= */}

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <StatCard
                    title="Nombre de ventes"
                    value="856"
                    description="+12,5% ce mois"
                    icon={ShoppingCart}
                    iconBg="bg-indigo-50 text-indigo-600"
                />

                <StatCard
                    title="Chiffre d'affaires"
                    value="18 450 000 Ar"
                    description="+8,4% ce mois"
                    icon={DollarSign}
                    iconBg="bg-emerald-50 text-emerald-600"
                />

                <StatCard
                    title="Nombre d'achats"
                    value="324"
                    description="Achats enregistrés"
                    icon={ShoppingBag}
                    iconBg="bg-cyan-50 text-cyan-600"
                />

                <StatCard
                    title="Bénéfice estimé"
                    value="6 820 000 Ar"
                    description="+15,2% ce mois"
                    icon={TrendingUp}
                    iconBg="bg-teal-50 text-teal-600"
                />

            </div>


            {/* =========================
                GRAPHIQUES PRINCIPAUX
            ========================= */}

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">


                {/* Ventes par jour */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="mb-5">
                        <h2 className="font-semibold text-gray-900">
                            Ventes par jour
                        </h2>

                        <p className="text-sm text-gray-500">
                            Nombre de ventes cette semaine
                        </p>
                    </div>

                    <div className="h-72">

                        <ResponsiveContainer width="100%" height="100%">

                            <LineChart data={salesByDay}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="name" />

                                <YAxis />

                                <Tooltip />

                                <Line
                                    type="monotone"
                                    dataKey="ventes"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* Ventes par mois */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="mb-5">
                        <h2 className="font-semibold text-gray-900">
                            Ventes par mois
                        </h2>

                        <p className="text-sm text-gray-500">
                            Évolution des ventes
                        </p>
                    </div>

                    <div className="h-72">

                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart data={salesByMonth}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="name" />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="ventes"
                                    fill="#2563eb"
                                    radius={[6, 6, 0, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* Achats par mois */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="mb-5">
                        <h2 className="font-semibold text-gray-900">
                            Achats par mois
                        </h2>

                        <p className="text-sm text-gray-500">
                            Évolution des achats
                        </p>
                    </div>

                    <div className="h-72">

                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart data={purchasesByMonth}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="name" />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="achats"
                                    fill="#8b5cf6"
                                    radius={[6, 6, 0, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* Évolution du stock */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="mb-5">
                        <h2 className="font-semibold text-gray-900">
                            Évolution du stock
                        </h2>

                        <p className="text-sm text-gray-500">
                            Quantité de produits disponibles
                        </p>
                    </div>

                    <div className="h-72">

                        <ResponsiveContainer width="100%" height="100%">

                            <LineChart data={stockEvolution}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="name" />

                                <YAxis />

                                <Tooltip />

                                <Line
                                    type="monotone"
                                    dataKey="stock"
                                    stroke="#16a34a"
                                    strokeWidth={3}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>


            {/* =========================
                PRODUITS / CATÉGORIES
            ========================= */}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">


                {/* Produits les plus vendus */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="mb-5">

                        <h2 className="font-semibold text-gray-900">
                            Produits les plus vendus
                        </h2>

                        <p className="text-sm text-gray-500">
                            Top des produits
                        </p>

                    </div>

                    <div className="h-80">

                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart
                                data={bestProducts}
                                layout="vertical"
                            >

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis type="number" />

                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={110}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="ventes"
                                    fill="#f59e0b"
                                    radius={[0, 6, 6, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* Catégories les plus vendues */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="mb-5">

                        <h2 className="font-semibold text-gray-900">
                            Catégories les plus vendues
                        </h2>

                        <p className="text-sm text-gray-500">
                            Répartition des ventes
                        </p>

                    </div>

                    <div className="h-80">

                        <ResponsiveContainer width="100%" height="100%">

                            <PieChart>

                                <Pie
                                    data={categories}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >

                                    {categories.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                [
                                                    "#2563eb",
                                                    "#16a34a",
                                                    "#f59e0b",
                                                    "#8b5cf6",
                                                ][index]
                                            }
                                        />
                                    ))}

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>


            {/* =========================
                RÉAPPROVISIONNEMENT
            ========================= */}

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="flex flex-col gap-2 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="font-semibold text-gray-900">
                            Produits nécessitant un réapprovisionnement
                        </h2>

                        <p className="text-sm text-gray-500">
                            Produits dont le stock est faible
                        </p>

                    </div>

                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        Voir tous
                    </button>

                </div>


                {/* Tableau desktop */}

                <div className="hidden overflow-x-auto md:block">

                    <table className="w-full text-left">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-5 py-3 text-sm font-medium text-gray-500">
                                    Produit
                                </th>

                                <th className="px-5 py-3 text-sm font-medium text-gray-500">
                                    Stock actuel
                                </th>

                                <th className="px-5 py-3 text-sm font-medium text-gray-500">
                                    Stock minimum
                                </th>

                                <th className="px-5 py-3 text-sm font-medium text-gray-500">
                                    État
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {productsToRestock.map((product) => (

                                <tr key={product.name} className="hover:bg-gray-50">

                                    <td className="px-5 py-4 font-medium text-gray-900">
                                        {product.name}
                                    </td>

                                    <td className="px-5 py-4 text-gray-600">
                                        {product.stock}
                                    </td>

                                    <td className="px-5 py-4 text-gray-600">
                                        {product.minimum}
                                    </td>

                                    <td className="px-5 py-4">

                                        <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                                            Stock faible
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* Version mobile */}

                <div className="divide-y divide-gray-100 md:hidden">

                    {productsToRestock.map((product) => (

                        <div
                            key={product.name}
                            className="p-5"
                        >

                            <div className="flex items-center justify-between">

                                <h3 className="font-medium text-gray-900">
                                    {product.name}
                                </h3>

                                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                                    Stock faible
                                </span>

                            </div>

                            <div className="mt-3 flex justify-between text-sm">

                                <span className="text-gray-500">
                                    Stock :{" "}
                                    <strong className="text-gray-900">
                                        {product.stock}
                                    </strong>
                                </span>

                                <span className="text-gray-500">
                                    Minimum :{" "}
                                    <strong className="text-gray-900">
                                        {product.minimum}
                                    </strong>
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}