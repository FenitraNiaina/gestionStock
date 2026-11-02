export const dashboardStats = {
    totalProducts: 248,
    productsInStock: 218,
    outOfStock: 12,
    lowStock: 18,
    stockValue: 184750000,

    totalSales: 1248,
    revenue: 487500000,

    totalPurchases: 386,
    estimatedProfit: 126800000,
};

export const dailySales = [
    { day: "Lun", sales: 1850000 },
    { day: "Mar", sales: 2340000 },
    { day: "Mer", sales: 1980000 },
    { day: "Jeu", sales: 2750000 },
    { day: "Ven", sales: 3210000 },
    { day: "Sam", sales: 3890000 },
    { day: "Dim", sales: 2180000 },
];

export const monthlySales = [
    { month: "Jan", sales: 28500000 },
    { month: "Fév", sales: 32400000 },
    { month: "Mar", sales: 36700000 },
    { month: "Avr", sales: 41200000 },
    { month: "Mai", sales: 38900000 },
    { month: "Juin", sales: 45600000 },
    { month: "Juil", sales: 47800000 },
    { month: "Août", sales: 52100000 },
    { month: "Sep", sales: 48750000 },
];

export const monthlyPurchases = [
    { month: "Jan", purchases: 18500000 },
    { month: "Fév", purchases: 21300000 },
    { month: "Mar", purchases: 19800000 },
    { month: "Avr", purchases: 24500000 },
    { month: "Mai", purchases: 22700000 },
    { month: "Juin", purchases: 28900000 },
    { month: "Juil", purchases: 26400000 },
    { month: "Août", purchases: 31200000 },
    { month: "Sep", purchases: 29800000 },
];

export const stockEvolution = [
    { month: "Jan", stock: 185 },
    { month: "Fév", stock: 192 },
    { month: "Mar", stock: 205 },
    { month: "Avr", stock: 198 },
    { month: "Mai", stock: 214 },
    { month: "Juin", stock: 221 },
    { month: "Juil", stock: 228 },
    { month: "Août", stock: 236 },
    { month: "Sep", stock: 248 },
];

export const bestSellingProducts = [
    { name: "Coca Cola 33cl", quantity: 458 },
    { name: "Eau Vive 50cl", quantity: 392 },
    { name: "Fanta Orange", quantity: 347 },
    { name: "Chips Classic", quantity: 298 },
    { name: "Jus de Fruit", quantity: 267 },
];

export const bestSellingCategories = [
    { name: "Boissons", value: 42 },
    { name: "Snacks", value: 24 },
    { name: "Alimentation", value: 18 },
    { name: "Produits frais", value: 10 },
    { name: "Autres", value: 6 },
];

export const reorderProducts = [
    {
        id: 1,
        name: "Eau Vive 50cl",
        category: "Boissons",
        stock: 8,
        minStock: 30,
        status: "Critique",
    },
    {
        id: 2,
        name: "Coca Cola 33cl",
        category: "Boissons",
        stock: 15,
        minStock: 40,
        status: "Critique",
    },
    {
        id: 3,
        name: "Chips Classic",
        category: "Snacks",
        stock: 22,
        minStock: 50,
        status: "Faible",
    },
    {
        id: 4,
        name: "Jus de Fruit",
        category: "Boissons",
        stock: 18,
        minStock: 35,
        status: "Faible",
    },
    {
        id: 5,
        name: "Biscuits Chocolat",
        category: "Alimentation",
        stock: 12,
        minStock: 25,
        status: "Faible",
    },
];