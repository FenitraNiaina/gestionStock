import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

import {
    BarChart3,
    Package,
    ArrowLeftRight,
    ShoppingCart,
    Truck,
    Users,
    UserRound,
    TrendingUp,
    TrendingDown,
    Download,
    FileText,
    FileSpreadsheet,
    Calendar,
    Filter,
    X,
} from "lucide-react";

/* =========================================================
   DONNÉES FICTIVES
========================================================= */


const stockData = [
    {
        id: 1,
        reference: "SFOI-001",
        product: "Seau plastique 10L",
        category: "Produits injectés",
        stock: 245,
        minStock: 50,
        purchasePrice: 8500,
        salePrice: 12000,
        value: 2082500,
    },
    {
        id: 2,
        reference: "SFOI-002",
        product: "Bassine plastique 15L",
        category: "Produits injectés",
        stock: 180,
        minStock: 40,
        purchasePrice: 11000,
        salePrice: 16000,
        value: 1980000,
    },
    {
        id: 3,
        reference: "SFOI-003",
        product: "Cuvette plastique",
        category: "Produits injectés",
        stock: 320,
        minStock: 60,
        purchasePrice: 7000,
        salePrice: 10000,
        value: 2240000,
    },
    {
        id: 4,
        reference: "SFOI-004",
        product: "Arrosoir plastique",
        category: "Produits soufflés",
        stock: 95,
        minStock: 30,
        purchasePrice: 14000,
        salePrice: 20000,
        value: 1330000,
    },
    {
        id: 5,
        reference: "SFOI-005",
        product: "Bidon plastique 20L",
        category: "Produits soufflés",
        stock: 72,
        minStock: 25,
        purchasePrice: 18000,
        salePrice: 26000,
        value: 1296000,
    },
    {
        id: 6,
        reference: "SFOI-006",
        product: "Sac PP tissé",
        category: "Produits tissés",
        stock: 2500,
        minStock: 500,
        purchasePrice: 1800,
        salePrice: 2800,
        value: 4500000,
    },
    {
        id: 7,
        reference: "SFOI-007",
        product: "Film plastique PE",
        category: "Films plastiques",
        stock: 38,
        minStock: 10,
        purchasePrice: 145000,
        salePrice: 190000,
        value: 5510000,
    },
    {
        id: 8,
        reference: "SFOI-008",
        product: "Sachet plastique personnalisé",
        category: "Sacherie",
        stock: 14,
        minStock: 20,
        purchasePrice: 95000,
        salePrice: 135000,
        value: 1330000,
    },
    {
        id: 9,
        reference: "SFOI-009",
        product: "Bouteille plastique",
        category: "Produits soufflés",
        stock: 850,
        minStock: 200,
        purchasePrice: 1200,
        salePrice: 1800,
        value: 1020000,
    },
    {
        id: 10,
        reference: "SFOI-010",
        product: "Matière plastique recyclée",
        category: "Matières recyclées",
        stock: 680,
        minStock: 150,
        purchasePrice: 4200,
        salePrice: 6500,
        value: 2856000,
    },
];

const movementsData = [
    {
        id: 1,
        date: "2026-09-14",
        product: "Sac PP tissé",
        type: "Sortie",
        quantity: 250,
        reason: "Commande client",
        user: "Administrateur",
    },
    {
        id: 2,
        date: "2026-09-14",
        product: "Seau plastique 10L",
        type: "Entrée",
        quantity: 100,
        reason: "Réception production",
        user: "Gestionnaire",
    },
    {
        id: 3,
        date: "2026-09-13",
        product: "Film plastique PE",
        type: "Sortie",
        quantity: 8,
        reason: "Commande client",
        user: "Administrateur",
    },
    {
        id: 4,
        date: "2026-09-12",
        product: "Sachet plastique personnalisé",
        type: "Ajustement",
        quantity: 6,
        reason: "Inventaire physique",
        user: "Administrateur",
    },
    {
        id: 5,
        date: "2026-09-10",
        product: "Matière plastique recyclée",
        type: "Entrée",
        quantity: 150,
        reason: "Réception recyclage",
        user: "Magasinier",
    },
];

const salesData = [
    {
        id: 1,
        date: "2026-09-14",
        invoice: "FAC-2026-005",
        client: "Société Agro Madagascar",
        product: "Sac PP tissé",
        quantity: 250,
        total: 700000,
        cost: 450000,
    },
    {
        id: 2,
        date: "2026-09-13",
        invoice: "FAC-2026-004",
        client: "Entreprise Mada Distribution",
        product: "Seau plastique 10L",
        quantity: 80,
        total: 960000,
        cost: 680000,
    },
    {
        id: 3,
        date: "2026-09-12",
        invoice: "FAC-2026-003",
        client: "Société Hydro Mada",
        product: "Bidon plastique 20L",
        quantity: 35,
        total: 910000,
        cost: 630000,
    },
    {
        id: 4,
        date: "2026-09-10",
        invoice: "FAC-2026-002",
        client: "Client Industriel ABC",
        product: "Film plastique PE",
        quantity: 8,
        total: 1520000,
        cost: 1160000,
    },
    {
        id: 5,
        date: "2026-09-05",
        invoice: "FAC-2026-001",
        client: "Société Packaging Mada",
        product: "Sachet plastique personnalisé",
        quantity: 6,
        total: 810000,
        cost: 570000,
    },
];

const purchasesData = [
    {
        id: 1,
        date: "2026-09-14",
        number: "ACH-2026-008",
        supplier: "Plastiques & Matières Mada",
        product: "Matière plastique recyclée",
        quantity: 150,
        total: 630000,
    },
    {
        id: 2,
        date: "2026-09-10",
        number: "ACH-2026-007",
        supplier: "Fournitures Industrielles Mada",
        product: "Film plastique PE",
        quantity: 15,
        total: 2175000,
    },
    {
        id: 3,
        date: "2026-09-06",
        number: "ACH-2026-006",
        supplier: "Matières Premières Océan Indien",
        product: "Sac PP tissé",
        quantity: 1000,
        total: 1800000,
    },
    {
        id: 4,
        date: "2026-09-03",
        number: "ACH-2026-005",
        supplier: "Fournitures Plastiques Madagascar",
        product: "Seau plastique 10L",
        quantity: 200,
        total: 1700000,
    },
];

const suppliersData = [
    {
        id: 1,
        name: "Plastiques & Matières Mada",
        purchases: 18,
        amount: 12500000,
    },
    {
        id: 2,
        name: "Fournitures Industrielles Mada",
        purchases: 15,
        amount: 9200000,
    },
    {
        id: 3,
        name: "Matières Premières Océan Indien",
        purchases: 12,
        amount: 8600000,
    },
    {
        id: 4,
        name: "Fournitures Plastiques Madagascar",
        purchases: 10,
        amount: 7100000,
    },
];

const customersData = [
    {
        id: 1,
        name: "Société Agro Madagascar",
        orders: 8,
        amount: 12500000,
    },
    {
        id: 2,
        name: "Entreprise Mada Distribution",
        orders: 12,
        amount: 18700000,
    },
    {
        id: 3,
        name: "Société Packaging Mada",
        orders: 6,
        amount: 8900000,
    },
    {
        id: 4,
        name: "Client Industriel ABC",
        orders: 9,
        amount: 15400000,
    },
];

const reports = [
    {
        id: "stock",
        label: "État du stock",
        icon: Package,
    },
    {
        id: "movements",
        label: "Mouvements de stock",
        icon: ArrowLeftRight,
    },
    {
        id: "sales",
        label: "Ventes",
        icon: ShoppingCart,
    },
    {
        id: "purchases",
        label: "Achats",
        icon: Truck,
    },
    {
        id: "profit",
        label: "Bénéfices",
        icon: TrendingUp,
    },
    {
        id: "best",
        label: "Produits les plus vendus",
        icon: TrendingUp,
    },
    {
        id: "worst",
        label: "Produits les moins vendus",
        icon: TrendingDown,
    },
    {
        id: "suppliers",
        label: "Fournisseurs",
        icon: Truck,
    },
    {
        id: "customers",
        label: "Clients",
        icon: UserRound,
    },
];


function formatMoney(value) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
}

function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR").format(
        new Date(`${date}T00:00:00`)
    );
}

function getToday() {
    return new Date("2026-09-14T00:00:00");
}

function getStartDate(period, customStart) {
    const today = getToday();
    const date = new Date(today);

    if (period === "today") {
        return today;
    }

    if (period === "week") {
        date.setDate(today.getDate() - 6);
        return date;
    }

    if (period === "month") {
        return new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );
    }

    if (period === "year") {
        return new Date(
            today.getFullYear(),
            0,
            1
        );
    }

    if (period === "custom" && customStart) {
        return new Date(`${customStart}T00:00:00`);
    }

    return null;
}

function isDateInPeriod(date, period, customStart, customEnd) {
    const itemDate = new Date(`${date}T00:00:00`);

    if (period === "all") {
        return true;
    }

    if (
        period === "custom" &&
        customStart &&
        customEnd
    ) {
        return (
            itemDate >=
                new Date(`${customStart}T00:00:00`) &&
            itemDate <=
                new Date(`${customEnd}T23:59:59`)
        );
    }

    const startDate = getStartDate(
        period,
        customStart
    );

    if (!startDate) {
        return true;
    }

    return itemDate >= startDate;
}

function exportCSV(data, filename) {
    if (!data || data.length === 0) {
        alert("Aucune donnée à exporter.");
        return;
    }

    const headers = Object.keys(data[0]);

    const rows = data.map((row) =>
        headers.map((header) => {
            const value = row[header] ?? "";

            return `"${String(value).replace(
                /"/g,
                '""'
            )}"`;
        })
    );

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(
        ["\ufeff" + csvContent],
        {
            type: "text/csv;charset=utf-8;",
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

function exportExcel(data, filename) {
    if (!data || data.length === 0) {
        alert("Aucune donnée à exporter.");
        return;
    }

    const worksheet =
        XLSX.utils.json_to_sheet(data);

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Rapport"
    );

    XLSX.writeFile(
        workbook,
        filename
    );
}

function exportPDF(title, data, columns, filename) {
    if (!data || data.length === 0) {
        alert("Aucune donnée à exporter.");
        return;
    }

    const pdf = new jsPDF({
        orientation: "landscape",
    });

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, 14, 18);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");

    pdf.text(
        `Rapport généré le ${formatDate(
            "2026-09-14"
        )}`,
        14,
        25
    );

    let y = 38;

    const columnWidth =
        270 / columns.length;

    pdf.setFillColor(37, 99, 235);

    pdf.rect(
        14,
        y - 6,
        270,
        9,
        "F"
    );

    pdf.setTextColor(
        255,
        255,
        255
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    columns.forEach(
        (column, index) => {
            pdf.text(
                column.label,
                14 +
                    index *
                        columnWidth +
                    2,
                y
            );
        }
    );

    y += 9;

    pdf.setTextColor(
        30,
        30,
        30
    );

    pdf.setFont(
        "helvetica",
        "normal"
    );

    data.forEach((row) => {
        if (y > 190) {
            pdf.addPage();
            y = 20;
        }

        columns.forEach(
            (column, index) => {
                let value =
                    row[column.key] ??
                    "";

                value = String(
                    value
                );

                if (
                    value.length > 25
                ) {
                    value =
                        value.substring(
                            0,
                            22
                        ) + "...";
                }

                pdf.text(
                    value,
                    14 +
                        index *
                            columnWidth +
                        2,
                    y
                );
            }
        );

        pdf.line(
            14,
            y + 2,
            284,
            y + 2
        );

        y += 9;
    });

    pdf.save(filename);
}

export default function Reports() {
    const [activeReport, setActiveReport] =
        useState("stock");

    const [period, setPeriod] =
        useState("month");

    const [customStart, setCustomStart] =
        useState("");

    const [customEnd, setCustomEnd] =
        useState("");

    const [showFilters, setShowFilters] =
        useState(false);

    const filteredSales = useMemo(
        () =>
            salesData.filter((item) =>
                isDateInPeriod(
                    item.date,
                    period,
                    customStart,
                    customEnd
                )
            ),
        [
            period,
            customStart,
            customEnd,
        ]
    );

    const filteredPurchases = useMemo(
        () =>
            purchasesData.filter(
                (item) =>
                    isDateInPeriod(
                        item.date,
                        period,
                        customStart,
                        customEnd
                    )
            ),
        [
            period,
            customStart,
            customEnd,
        ]
    );

    const filteredMovements = useMemo(
        () =>
            movementsData.filter(
                (item) =>
                    isDateInPeriod(
                        item.date,
                        period,
                        customStart,
                        customEnd
                    )
            ),
        [
            period,
            customStart,
            customEnd,
        ]
    );

    const totalSales =
        filteredSales.reduce(
            (sum, item) =>
                sum + item.total,
            0
        );

    const totalPurchases =
        filteredPurchases.reduce(
            (sum, item) =>
                sum + item.total,
            0
        );

    const totalProfit =
        filteredSales.reduce(
            (sum, item) =>
                sum +
                (item.total -
                    item.cost),
            0
        );

    const stockValue =
        stockData.reduce(
            (sum, item) =>
                sum + item.value,
            0
        );

    const lowStockProducts =
        stockData.filter(
            (item) =>
                item.stock <=
                item.minStock
        ).length;

    const bestSellingProducts =
        Object.values(
            filteredSales.reduce(
                (acc, sale) => {
                    if (
                        !acc[
                            sale.product
                        ]
                    ) {
                        acc[
                            sale.product
                        ] = {
                            product:
                                sale.product,
                            quantity: 0,
                            revenue: 0,
                        };
                    }

                    acc[
                        sale.product
                    ].quantity +=
                        sale.quantity;

                    acc[
                        sale.product
                    ].revenue +=
                        sale.total;

                    return acc;
                },
                {}
            )
        ).sort(
            (a, b) =>
                b.quantity -
                a.quantity
        );

    const worstSellingProducts =
        [...bestSellingProducts].sort(
            (a, b) =>
                a.quantity -
                b.quantity
        );

    function getReportData() {
        switch (activeReport) {
            case "stock":
                return stockData;

            case "movements":
                return filteredMovements;

            case "sales":
                return filteredSales;

            case "purchases":
                return filteredPurchases;

            case "profit":
                return filteredSales.map(
                    (sale) => ({
                        date: sale.date,
                        invoice:
                            sale.invoice,
                        client:
                            sale.client,
                        revenue:
                            sale.total,
                        cost: sale.cost,
                        profit:
                            sale.total -
                            sale.cost,
                    })
                );

            case "best":
                return bestSellingProducts;

            case "worst":
                return worstSellingProducts;

            case "suppliers":
                return suppliersData;

            case "customers":
                return customersData;

            default:
                return [];
        }
    }

    function getReportColumns() {
        switch (activeReport) {
            case "stock":
                return [
                    {
                        key: "reference",
                        label: "Référence",
                    },
                    {
                        key: "product",
                        label: "Produit",
                    },
                    {
                        key: "category",
                        label: "Catégorie",
                    },
                    {
                        key: "stock",
                        label: "Stock",
                    },
                    {
                        key: "purchasePrice",
                        label: "Prix achat",
                    },
                    {
                        key: "salePrice",
                        label: "Prix vente",
                    },
                    {
                        key: "value",
                        label: "Valeur",
                    },
                ];

            case "movements":
                return [
                    {
                        key: "date",
                        label: "Date",
                    },
                    {
                        key: "product",
                        label: "Produit",
                    },
                    {
                        key: "type",
                        label: "Type",
                    },
                    {
                        key: "quantity",
                        label: "Quantité",
                    },
                    {
                        key: "reason",
                        label: "Motif",
                    },
                    {
                        key: "user",
                        label: "Utilisateur",
                    },
                ];

            case "sales":
                return [
                    {
                        key: "date",
                        label: "Date",
                    },
                    {
                        key: "invoice",
                        label: "Facture",
                    },
                    {
                        key: "client",
                        label: "Client",
                    },
                    {
                        key: "product",
                        label: "Produit",
                    },
                    {
                        key: "quantity",
                        label: "Qté",
                    },
                    {
                        key: "total",
                        label: "Total",
                    },
                ];

            case "purchases":
                return [
                    {
                        key: "date",
                        label: "Date",
                    },
                    {
                        key: "number",
                        label: "Numéro",
                    },
                    {
                        key: "supplier",
                        label: "Fournisseur",
                    },
                    {
                        key: "product",
                        label: "Produit",
                    },
                    {
                        key: "quantity",
                        label: "Qté",
                    },
                    {
                        key: "total",
                        label: "Total",
                    },
                ];

            case "profit":
                return [
                    {
                        key: "date",
                        label: "Date",
                    },
                    {
                        key: "invoice",
                        label: "Facture",
                    },
                    {
                        key: "client",
                        label: "Client",
                    },
                    {
                        key: "revenue",
                        label: "Ventes",
                    },
                    {
                        key: "cost",
                        label: "Coût",
                    },
                    {
                        key: "profit",
                        label: "Bénéfice",
                    },
                ];

            case "best":
            case "worst":
                return [
                    {
                        key: "product",
                        label: "Produit",
                    },
                    {
                        key: "quantity",
                        label: "Quantité vendue",
                    },
                    {
                        key: "revenue",
                        label: "Chiffre d'affaires",
                    },
                ];

            case "suppliers":
                return [
                    {
                        key: "name",
                        label: "Fournisseur",
                    },
                    {
                        key: "purchases",
                        label: "Achats",
                    },
                    {
                        key: "amount",
                        label: "Montant",
                    },
                ];

            case "customers":
                return [
                    {
                        key: "name",
                        label: "Client",
                    },
                    {
                        key: "orders",
                        label: "Commandes",
                    },
                    {
                        key: "amount",
                        label: "Montant",
                    },
                ];

            default:
                return [];
        }
    }

    function getReportTitle() {
        return (
            reports.find(
                (report) =>
                    report.id ===
                    activeReport
            )?.label ||
            "Rapport"
        );
    }

    function handlePDF() {
        const data =
            getReportData();

        const columns =
            getReportColumns();

        exportPDF(
            getReportTitle(),
            data,
            columns,
            `rapport-${activeReport}.pdf`
        );
    }

    function handleExcel() {
        const data =
            getReportData();

        exportExcel(
            data,
            `rapport-${activeReport}.xlsx`
        );
    }

    function handleCSV() {
        const data =
            getReportData();

        exportCSV(
            data,
            `rapport-${activeReport}.csv`
        );
    }

    function resetCustomPeriod() {
        setCustomStart("");
        setCustomEnd("");
        setPeriod("month");
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">

            {/* HEADER */}

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <BarChart3 size={24} />
                    </div>

                    <div>

                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Rapports
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Analysez les données de votre gestion de stock.
                        </p>

                    </div>

                </div>

                <button
                    onClick={() =>
                        setShowFilters(
                            (value) => !value
                        )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                    <Filter size={18} />
                    Période
                </button>

            </div>

            {/* FILTRE PÉRIODE */}

            {showFilters && (
                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="flex flex-col gap-4">

                        <div className="flex flex-wrap gap-2">

                            <button
                                onClick={() =>
                                    setPeriod(
                                        "today"
                                    )
                                }
                                className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                                    period ===
                                    "today"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Aujourd'hui
                            </button>

                            <button
                                onClick={() =>
                                    setPeriod(
                                        "week"
                                    )
                                }
                                className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                                    period ===
                                    "week"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Cette semaine
                            </button>

                            <button
                                onClick={() =>
                                    setPeriod(
                                        "month"
                                    )
                                }
                                className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                                    period ===
                                    "month"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Ce mois
                            </button>

                            <button
                                onClick={() =>
                                    setPeriod(
                                        "year"
                                    )
                                }
                                className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                                    period ===
                                    "year"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Cette année
                            </button>

                            <button
                                onClick={() =>
                                    setPeriod(
                                        "custom"
                                    )
                                }
                                className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                                    period ===
                                    "custom"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Personnalisée
                            </button>

                            <button
                                onClick={() =>
                                    setPeriod("all")
                                }
                                className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                                    period === "all"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Toutes
                            </button>

                        </div>

                        {period === "custom" && (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Date de début
                                    </label>

                                    <div className="relative">

                                        <Calendar
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="date"
                                            value={
                                                customStart
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setCustomStart(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                                        />

                                    </div>

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Date de fin
                                    </label>

                                    <div className="relative">

                                        <Calendar
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="date"
                                            value={
                                                customEnd
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setCustomEnd(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                                        />

                                    </div>

                                </div>

                            </div>
                        )}

                        <div className="flex justify-end">

                            <button
                                onClick={
                                    resetCustomPeriod
                                }
                                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                            >
                                <X size={16} />
                                Réinitialiser
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* STATISTIQUES */}

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Chiffre d'affaires
                            </p>

                            <p className="mt-2 text-xl font-bold text-gray-900">
                                {formatMoney(
                                    totalSales
                                )}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <TrendingUp size={21} />
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Achats
                            </p>

                            <p className="mt-2 text-xl font-bold text-gray-900">
                                {formatMoney(
                                    totalPurchases
                                )}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                            <Truck size={21} />
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Bénéfice
                            </p>

                            <p className="mt-2 text-xl font-bold text-gray-900">
                                {formatMoney(
                                    totalProfit
                                )}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <BarChart3 size={21} />
                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Valeur du stock
                            </p>

                            <p className="mt-2 text-xl font-bold text-gray-900">
                                {formatMoney(
                                    stockValue
                                )}
                            </p>

                            <p className="mt-1 text-xs text-red-500">
                                {lowStockProducts} produit(s)
                                en stock faible
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <Package size={21} />
                        </div>

                    </div>

                </div>

            </div>

            {/* TYPES DE RAPPORTS */}

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

                {reports.map((report) => {

                    const Icon = report.icon;

                    return (
                        <button
                            key={report.id}
                            onClick={() =>
                                setActiveReport(
                                    report.id
                                )
                            }
                            className={`flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition ${
                                activeReport ===
                                report.id
                                    ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            <Icon size={23} />

                            <span className="text-xs font-semibold sm:text-sm">
                                {report.label}
                            </span>

                        </button>
                    );
                })}

            </div>

            {/* RAPPORT */}

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                {/* HEADER RAPPORT */}

                <div className="flex flex-col gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <h2 className="text-xl font-bold text-gray-900">
                            {getReportTitle()}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Rapport filtré selon la période sélectionnée.
                        </p>

                    </div>

                    <div className="flex flex-wrap gap-2">

                        <button
                            onClick={handlePDF}
                            className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                            <FileText size={17} />
                            PDF
                        </button>

                        <button
                            onClick={handleExcel}
                            className="flex items-center gap-2 rounded-xl border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-600 hover:bg-green-50"
                        >
                            <FileSpreadsheet
                                size={17}
                            />
                            Excel
                        </button>

                        <button
                            onClick={handleCSV}
                            className="flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                        >
                            <Download size={17} />
                            CSV
                        </button>

                    </div>

                </div>

                {/* TABLE RAPPORT */}

                <div className="overflow-x-auto">

                    {activeReport === "stock" && (
                        <table className="w-full min-w-[900px]">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Référence
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Produit
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Catégorie
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Stock
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Prix achat
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Prix vente
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Valeur
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {stockData.map(
                                    (item) => (
                                        <tr
                                            key={
                                                item.id
                                            }
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4 text-sm text-gray-500">
                                                {
                                                    item.reference
                                                }
                                            </td>

                                            <td className="px-5 py-4 font-medium text-gray-900">
                                                {
                                                    item.product
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {
                                                    item.category
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right">

                                                <span
                                                    className={
                                                        item.stock <=
                                                        item.minStock
                                                            ? "font-semibold text-red-600"
                                                            : "font-semibold text-gray-900"
                                                    }
                                                >
                                                    {
                                                        item.stock
                                                    }
                                                </span>

                                            </td>

                                            <td className="px-5 py-4 text-right text-sm text-gray-600">
                                                {formatMoney(
                                                    item.purchasePrice
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right text-sm text-gray-600">
                                                {formatMoney(
                                                    item.salePrice
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right font-semibold text-gray-900">
                                                {formatMoney(
                                                    item.value
                                                )}
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>
                    )}

                    {activeReport ===
                        "movements" && (
                        <table className="w-full min-w-[850px]">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Date
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Produit
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Type
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Quantité
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Motif
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Utilisateur
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredMovements.map(
                                    (item) => (
                                        <tr
                                            key={
                                                item.id
                                            }
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {formatDate(
                                                    item.date
                                                )}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-gray-900">
                                                {
                                                    item.product
                                                }
                                            </td>

                                            <td className="px-5 py-4">

                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    {
                                                        item.type
                                                    }
                                                </span>

                                            </td>

                                            <td className="px-5 py-4 text-right font-semibold text-gray-900">
                                                {
                                                    item.quantity
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {
                                                    item.reason
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {
                                                    item.user
                                                }
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>
                    )}

                    {activeReport ===
                        "sales" && (
                        <table className="w-full min-w-[900px]">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Date
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Facture
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Client
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Produit
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Qté
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Total
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredSales.map(
                                    (item) => (
                                        <tr
                                            key={
                                                item.id
                                            }
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {formatDate(
                                                    item.date
                                                )}
                                            </td>

                                            <td className="px-5 py-4 font-medium text-gray-900">
                                                {
                                                    item.invoice
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {
                                                    item.client
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {
                                                    item.product
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right font-medium">
                                                {
                                                    item.quantity
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right font-semibold text-gray-900">
                                                {formatMoney(
                                                    item.total
                                                )}
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>
                    )}

                    {activeReport ===
                        "purchases" && (
                        <table className="w-full min-w-[900px]">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Date
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Numéro
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Fournisseur
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Produit
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Qté
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Total
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredPurchases.map(
                                    (item) => (
                                        <tr
                                            key={
                                                item.id
                                            }
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {formatDate(
                                                    item.date
                                                )}
                                            </td>

                                            <td className="px-5 py-4 font-medium">
                                                {
                                                    item.number
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm">
                                                {
                                                    item.supplier
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm">
                                                {
                                                    item.product
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                {
                                                    item.quantity
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right font-semibold">
                                                {formatMoney(
                                                    item.total
                                                )}
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>
                    )}

                    {activeReport ===
                        "profit" && (
                        <table className="w-full min-w-[900px]">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Date
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Facture
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Client
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Ventes
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Coût
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Bénéfice
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredSales.map(
                                    (item) => (
                                        <tr
                                            key={
                                                item.id
                                            }
                                        >

                                            <td className="px-5 py-4 text-sm">
                                                {formatDate(
                                                    item.date
                                                )}
                                            </td>

                                            <td className="px-5 py-4 font-medium">
                                                {
                                                    item.invoice
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm">
                                                {
                                                    item.client
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                {formatMoney(
                                                    item.total
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                {formatMoney(
                                                    item.cost
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right font-bold text-green-600">
                                                {formatMoney(
                                                    item.total -
                                                        item.cost
                                                )}
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>
                    )}

                    {(activeReport === "best" ||
                        activeReport ===
                            "worst") && (
                        <table className="w-full min-w-[700px]">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Produit
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Quantité vendue
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Chiffre d'affaires
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {(activeReport ===
                                "best"
                                    ? bestSellingProducts
                                    : worstSellingProducts
                                ).map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                item.product
                                            }
                                        >

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600">
                                                        {index +
                                                            1}
                                                    </span>

                                                    <span className="font-medium text-gray-900">
                                                        {
                                                            item.product
                                                        }
                                                    </span>

                                                </div>

                                            </td>

                                            <td className="px-5 py-4 text-right font-semibold">
                                                {
                                                    item.quantity
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right font-semibold">
                                                {formatMoney(
                                                    item.revenue
                                                )}
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>
                    )}

                    {activeReport ===
                        "suppliers" && (
                        <table className="w-full min-w-[600px]">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Fournisseur
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Achats
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Montant
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {suppliersData.map(
                                    (item) => (
                                        <tr
                                            key={
                                                item.id
                                            }
                                        >

                                            <td className="px-5 py-4 font-medium">
                                                {
                                                    item.name
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                {
                                                    item.purchases
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right font-semibold">
                                                {formatMoney(
                                                    item.amount
                                                )}
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>
                    )}

                    {activeReport ===
                        "customers" && (
                        <table className="w-full min-w-[600px]">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-gray-500">
                                        Client
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Commandes
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-gray-500">
                                        Montant
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {customersData.map(
                                    (item) => (
                                        <tr
                                            key={
                                                item.id
                                            }
                                        >

                                            <td className="px-5 py-4 font-medium">
                                                {
                                                    item.name
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                {
                                                    item.orders
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right font-semibold">
                                                {formatMoney(
                                                    item.amount
                                                )}
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>
                    )}

                </div>

                {/* EMPTY */}

                {getReportData().length ===
                    0 && (
                    <div className="p-12 text-center">

                        <BarChart3
                            size={45}
                            className="mx-auto text-gray-300"
                        />

                        <p className="mt-4 font-semibold text-gray-900">
                            Aucune donnée
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Aucune donnée disponible pour cette période.
                        </p>

                    </div>
                )}

            </div>

        </div>
    );
}