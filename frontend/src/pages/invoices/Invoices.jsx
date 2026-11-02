import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import {
    Search,
    FileText,
    Eye,
    Download,
    Printer,
    X,
    Calendar,
    User,
    CreditCard,
    Package,
    Receipt,
    CheckCircle2,
    Clock3,
    Ban,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { fetchSales } from "../../data/sales";

const company = {
    name: "GestionStock",
    address: "Antananarivo, Madagascar",
    phone: "+261 34 00 000 00",
    email: "contact@gestionstock.mg",
    website: "www.gestionstock.mg",
    logoText: "GS",
};

// Une vente en "Brouillon" n'est pas encore une facture ; on ne l'affiche pas ici.
// "Validée" devient "Payée" côté facturation, les autres statuts sont conservés tels quels.
function mapSaleStatus(status) {
    if (status === "Validée") return "Payée";
    return status;
}

function mapSaleToInvoice(sale) {
    return {
        id: sale.id,
        number: sale.number,
        date: sale.date,
        client: {
            name: sale.customerName,
            phone: sale.customerPhone,
            email: sale.customerEmail,
            address: sale.customerAddress,
        },
        products: sale.products.map((product) => ({
            id: product.productId,
            name: product.productName,
            quantity: product.quantity,
            price: product.unitPrice,
        })),
        discount: sale.discount,
        tax: sale.tax,
        paymentMethod: sale.paymentMethod,
        status: mapSaleStatus(sale.status),
        user: sale.user,
    };
}

// La taxe est ici un montant fixe (comme dans le module Ventes), pas un pourcentage.
function calculateInvoice(invoice) {
    const subtotal = invoice.products.reduce(
        (total, product) => total + Number(product.quantity) * Number(product.price),
        0
    );

    const discount = Number(invoice.discount || 0);
    const taxAmount = Number(invoice.tax || 0);
    const total = subtotal - discount + taxAmount;

    return { subtotal, discount, taxAmount, total };
}

function formatMoney(value) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
}

function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR").format(new Date(`${date}T00:00:00`));
}

function getStatusClass(status) {
    switch (status) {
        case "Payée":
            return "bg-green-100 text-green-700";
        case "En attente":
            return "bg-orange-100 text-orange-700";
        case "Annulée":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

function getStatusIcon(status) {
    switch (status) {
        case "Payée":
            return <CheckCircle2 size={15} />;
        case "En attente":
            return <Clock3 size={15} />;
        case "Annulée":
            return <Ban size={15} />;
        default:
            return <Clock3 size={15} />;
    }
}

export default function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Toutes");

    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);

    const invoicesPerPage = 5;

    useEffect(() => {
        loadInvoices();
    }, []);

    async function loadInvoices() {
        setLoading(true);
        setError("");

        try {
            const sales = await fetchSales();

            const mapped = sales
                .filter((sale) => sale.status !== "Brouillon")
                .map(mapSaleToInvoice);

            setInvoices(mapped);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const filteredInvoices = useMemo(() => {
        return invoices.filter((invoice) => {
            const searchValue = search.toLowerCase().trim();

            const matchesSearch =
                invoice.number.toLowerCase().includes(searchValue) ||
                invoice.client.name.toLowerCase().includes(searchValue) ||
                invoice.client.email.toLowerCase().includes(searchValue);

            const matchesStatus =
                statusFilter === "Toutes" || invoice.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [invoices, search, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / invoicesPerPage));

    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * invoicesPerPage,
        currentPage * invoicesPerPage
    );

    const totalInvoices = invoices.length;

    const paidInvoices = invoices.filter((invoice) => invoice.status === "Payée").length;

    const pendingInvoices = invoices.filter(
        (invoice) => invoice.status === "En attente"
    ).length;

    const totalRevenue = invoices
        .filter((invoice) => invoice.status === "Payée")
        .reduce((total, invoice) => total + calculateInvoice(invoice).total, 0);

    function handleSearch(value) {
        setSearch(value);
        setCurrentPage(1);
    }

    function handleStatusChange(value) {
        setStatusFilter(value);
        setCurrentPage(1);
    }

    function generatePDF(invoice) {
        const pdf = new jsPDF();
        const calculations = calculateInvoice(invoice);

        let y = 20;

        pdf.setFillColor(37, 99, 235);
        pdf.rect(15, 15, 30, 30, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(company.logoText, 21, 34);

        pdf.setTextColor(30, 30, 30);
        pdf.setFontSize(20);
        pdf.text("FACTURE", 55, 27);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`N° ${invoice.number}`, 55, 35);
        pdf.text(`Date : ${formatDate(invoice.date)}`, 55, 41);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(company.name, 140, 22);

        pdf.setFont("helvetica", "normal");
        pdf.text(company.address, 140, 29);
        pdf.text(company.phone, 140, 35);
        pdf.text(company.email, 140, 41);

        y = 60;

        pdf.setFillColor(245, 247, 250);
        pdf.rect(15, y, 180, 28, "F");

        pdf.setTextColor(30, 30, 30);
        pdf.setFont("helvetica", "bold");
        pdf.text("FACTURÉ À", 20, y + 9);

        pdf.setFont("helvetica", "normal");
        pdf.text(invoice.client.name, 20, y + 16);
        pdf.text(invoice.client.address || "-", 20, y + 22);

        pdf.text(`Téléphone : ${invoice.client.phone || "-"}`, 110, y + 16);
        pdf.text(`Email : ${invoice.client.email || "-"}`, 110, y + 22);

        y += 40;

        pdf.setFillColor(37, 99, 235);
        pdf.rect(15, y, 180, 10, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);

        pdf.text("Produit", 20, y + 7);
        pdf.text("Qté", 115, y + 7);
        pdf.text("Prix unitaire", 135, y + 7);
        pdf.text("Total", 175, y + 7);

        y += 10;

        pdf.setTextColor(30, 30, 30);
        pdf.setFont("helvetica", "normal");

        invoice.products.forEach((product) => {
            const lineTotal = Number(product.quantity) * Number(product.price);

            pdf.line(15, y + 10, 195, y + 10);

            pdf.text(product.name, 20, y + 7);
            pdf.text(String(product.quantity), 117, y + 7);
            pdf.text(formatMoney(product.price), 135, y + 7);
            pdf.text(formatMoney(lineTotal), 172, y + 7);

            y += 12;
        });

        y += 8;

        pdf.setFont("helvetica", "normal");

        pdf.text("Sous-total :", 125, y);
        pdf.text(formatMoney(calculations.subtotal), 170, y);

        y += 8;

        pdf.text("Remise :", 125, y);
        pdf.text(formatMoney(calculations.discount), 170, y);

        y += 8;

        pdf.text("Taxe :", 125, y);
        pdf.text(formatMoney(calculations.taxAmount), 170, y);

        y += 10;

        pdf.setFillColor(37, 99, 235);
        pdf.rect(120, y - 6, 75, 13, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.text("TOTAL :", 125, y + 2);
        pdf.text(formatMoney(calculations.total), 168, y + 2);

        y += 25;

        pdf.setTextColor(30, 30, 30);
        pdf.setFont("helvetica", "bold");
        pdf.text("Mode de paiement", 20, y);

        pdf.setFont("helvetica", "normal");
        pdf.text(invoice.paymentMethod, 20, y + 7);

        pdf.setFont("helvetica", "bold");
        pdf.text("Statut", 100, y);

        pdf.setFont("helvetica", "normal");
        pdf.text(invoice.status, 100, y + 7);

        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);

        pdf.text("Merci pour votre confiance.", 20, 280);
        pdf.text(`${company.name} - ${company.website}`, 20, 286);

        pdf.save(`${invoice.number}.pdf`);
    }

    function printInvoice(invoice) {
        const calculations = calculateInvoice(invoice);

        const printWindow = window.open("", "_blank");

        if (!printWindow) {
            alert("Impossible d'ouvrir la fenêtre d'impression. Vérifiez le bloqueur de fenêtres.");
            return;
        }

        const productsHTML = invoice.products
            .map(
                (product) => `
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.quantity}</td>
                        <td>${formatMoney(product.price)}</td>
                        <td>${formatMoney(product.quantity * product.price)}</td>
                    </tr>
                `
            )
            .join("");

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>${invoice.number}</title>
                <style>
                    * { box-sizing: border-box; }
                    body { margin: 0; padding: 40px; font-family: Arial, sans-serif; color: #111827; }
                    .invoice { max-width: 900px; margin: auto; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
                    .logo { width: 60px; height: 60px; background: #2563eb; color: white; display: flex; align-items: center; justify-content: center; border-radius: 12px; font-weight: bold; font-size: 22px; }
                    .company { text-align: right; }
                    h1 { margin: 0 0 8px; font-size: 28px; }
                    .client { background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #2563eb; color: white; padding: 12px; text-align: left; }
                    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
                    .totals { width: 320px; margin-left: auto; margin-top: 30px; }
                    .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
                    .grand-total { background: #2563eb; color: white; padding: 14px; border-radius: 6px; font-weight: bold; font-size: 18px; }
                    .footer { margin-top: 70px; color: #6b7280; font-size: 13px; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <div><div class="logo">${company.logoText}</div></div>
                        <div>
                            <h1>FACTURE</h1>
                            <div>N° ${invoice.number}</div>
                            <div>Date : ${formatDate(invoice.date)}</div>
                        </div>
                        <div class="company">
                            <strong>${company.name}</strong><br>
                            ${company.address}<br>
                            ${company.phone}<br>
                            ${company.email}
                        </div>
                    </div>
                    <div class="client">
                        <strong>FACTURÉ À</strong>
                        <p>
                            <strong>${invoice.client.name}</strong><br>
                            ${invoice.client.address || "-"}<br>
                            ${invoice.client.phone || "-"}<br>
                            ${invoice.client.email || "-"}
                        </p>
                    </div>
                    <table>
                        <thead>
                            <tr><th>Produit</th><th>Quantité</th><th>Prix unitaire</th><th>Total</th></tr>
                        </thead>
                        <tbody>${productsHTML}</tbody>
                    </table>
                    <div class="totals">
                        <div class="total-row"><span>Sous-total</span><strong>${formatMoney(calculations.subtotal)}</strong></div>
                        <div class="total-row"><span>Remise</span><strong>${formatMoney(calculations.discount)}</strong></div>
                        <div class="total-row"><span>Taxe</span><strong>${formatMoney(calculations.taxAmount)}</strong></div>
                        <div class="grand-total">
                            <div class="total-row"><span>TOTAL</span><span>${formatMoney(calculations.total)}</span></div>
                        </div>
                    </div>
                    <div style="margin-top:30px"><strong>Mode de paiement :</strong> ${invoice.paymentMethod}</div>
                    <div style="margin-top:10px"><strong>Statut :</strong> ${invoice.status}</div>
                    <div class="footer">
                        Merci pour votre confiance.<br>
                        ${company.name} - ${company.website}
                    </div>
                </div>
                <script>
                    window.onload = function() { window.print(); };
                </script>
            </body>
            </html>
        `);

        printWindow.document.close();
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Factures
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gérez, consultez et imprimez vos factures.
                    </p>
                </div>
            </div>

            {/* STATISTIQUES */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total factures</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{totalInvoices}</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <FileText size={22} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Factures payées</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{paidInvoices}</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <CheckCircle2 size={22} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">En attente</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{pendingInvoices}</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                            <Clock3 size={22} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Chiffre facturé</p>
                            <p className="mt-2 text-xl font-bold text-gray-900">
                                {formatMoney(totalRevenue)}
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <Receipt size={22} />
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTRES */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <div className="relative flex-1">
                        <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => handleSearch(event.target.value)}
                            placeholder="Rechercher une facture, un client..."
                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--input-border)] focus:ring-2 focus:ring-[var(--input-border)]"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) => handleStatusChange(event.target.value)}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                    >
                        <option value="Toutes">Toutes les factures</option>
                        <option value="Payée">Payées</option>
                        <option value="En attente">En attente</option>
                        <option value="Annulée">Annulées</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error} — vérifie que le serveur backend est démarré sur
                    le port attendu.
                </div>
            )}

            {/* TABLE */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Facture</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Client</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Paiement</th>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Statut</th>
                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-500">
                                        Chargement des factures...
                                    </td>
                                </tr>
                            )}

                            {!loading && paginatedInvoices.map((invoice) => {
                                const calculations = calculateInvoice(invoice);

                                return (
                                    <tr key={invoice.id} className="transition hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                                    <FileText size={19} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{invoice.number}</p>
                                                    <p className="text-xs text-gray-500">{invoice.products.length} produit(s)</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <User size={17} className="text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{invoice.client.name}</p>
                                                    <p className="text-xs text-gray-500">{invoice.client.email || "-"}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} />
                                                {formatDate(invoice.date)}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-900">{formatMoney(calculations.total)}</p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <CreditCard size={16} />
                                                {invoice.paymentMethod}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(invoice.status)}`}>
                                                {getStatusIcon(invoice.status)}
                                                {invoice.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedInvoice(invoice)}
                                                    title="Consulter"
                                                    className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                <button
                                                    onClick={() => generatePDF(invoice)}
                                                    title="Télécharger PDF"
                                                    className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
                                                >
                                                    <Download size={18} />
                                                </button>

                                                <button
                                                    onClick={() => printInvoice(invoice)}
                                                    title="Imprimer"
                                                    className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50"
                                                >
                                                    <Printer size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {!loading && paginatedInvoices.length === 0 && (
                    <div className="px-6 py-16 text-center">
                        <FileText size={45} className="mx-auto text-gray-300" />
                        <h3 className="mt-4 font-semibold text-gray-900">Aucune facture trouvée</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Essayez de modifier votre recherche ou votre filtre.
                        </p>
                    </div>
                )}

                {!loading && filteredInvoices.length > 0 && (
                    <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500">
                            Page {currentPage} sur {totalPages}
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`h-9 w-9 rounded-lg text-sm font-medium ${
                                        currentPage === page ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                                className="rounded-lg border border-gray-200 p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DÉTAIL */}
            {selectedInvoice && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedInvoice(null)}
                >
                    <div
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                    <FileText size={21} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900">{selectedInvoice.number}</h2>
                                    <p className="text-xs text-gray-500">{formatDate(selectedInvoice.date)}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6 p-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="rounded-xl bg-gray-50 p-4">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Entreprise
                                    </p>
                                    <p className="font-bold text-gray-900">{company.name}</p>
                                    <p className="mt-1 text-sm text-gray-500">{company.address}</p>
                                    <p className="text-sm text-gray-500">{company.phone}</p>
                                    <p className="text-sm text-gray-500">{company.email}</p>
                                </div>

                                <div className="rounded-xl bg-gray-50 p-4">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Client
                                    </p>
                                    <p className="font-bold text-gray-900">{selectedInvoice.client.name}</p>
                                    <p className="mt-1 text-sm text-gray-500">{selectedInvoice.client.address || "-"}</p>
                                    <p className="text-sm text-gray-500">{selectedInvoice.client.phone || "-"}</p>
                                    <p className="text-sm text-gray-500">{selectedInvoice.client.email || "-"}</p>
                                </div>
                            </div>

                            <div>
                                <div className="mb-3 flex items-center gap-2">
                                    <Package size={19} className="text-blue-600" />
                                    <h3 className="font-bold text-gray-900">Produits</h3>
                                </div>

                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                    <table className="w-full min-w-[600px]">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Produit</th>
                                                <th className="px-4 py-3 text-center text-xs uppercase text-gray-500">Quantité</th>
                                                <th className="px-4 py-3 text-right text-xs uppercase text-gray-500">Prix</th>
                                                <th className="px-4 py-3 text-right text-xs uppercase text-gray-500">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {selectedInvoice.products.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                                                    <td className="px-4 py-3 text-center text-gray-600">{product.quantity}</td>
                                                    <td className="px-4 py-3 text-right text-gray-600">{formatMoney(product.price)}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                                        {formatMoney(product.quantity * product.price)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="rounded-xl border border-gray-200 p-4">
                                    <p className="text-xs text-gray-500">Date</p>
                                    <p className="mt-1 font-semibold text-gray-900">{formatDate(selectedInvoice.date)}</p>
                                </div>

                                <div className="rounded-xl border border-gray-200 p-4">
                                    <p className="text-xs text-gray-500">Paiement</p>
                                    <p className="mt-1 font-semibold text-gray-900">{selectedInvoice.paymentMethod}</p>
                                </div>

                                <div className="rounded-xl border border-gray-200 p-4">
                                    <p className="text-xs text-gray-500">Statut</p>
                                    <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(selectedInvoice.status)}`}>
                                        {getStatusIcon(selectedInvoice.status)}
                                        {selectedInvoice.status}
                                    </span>
                                </div>
                            </div>

                            <div className="ml-auto w-full max-w-sm rounded-xl bg-gray-50 p-5">
                                {(() => {
                                    const calculations = calculateInvoice(selectedInvoice);

                                    return (
                                        <>
                                            <div className="flex justify-between py-2 text-sm">
                                                <span className="text-gray-500">Sous-total</span>
                                                <span className="font-medium">{formatMoney(calculations.subtotal)}</span>
                                            </div>

                                            <div className="flex justify-between py-2 text-sm">
                                                <span className="text-gray-500">Remise</span>
                                                <span className="font-medium">{formatMoney(calculations.discount)}</span>
                                            </div>

                                            <div className="flex justify-between py-2 text-sm">
                                                <span className="text-gray-500">Taxe</span>
                                                <span className="font-medium">{formatMoney(calculations.taxAmount)}</span>
                                            </div>

                                            <div className="mt-3 flex justify-between rounded-xl bg-blue-600 px-4 py-4 text-white">
                                                <span className="font-bold">Total</span>
                                                <span className="font-bold">{formatMoney(calculations.total)}</span>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    onClick={() => printInvoice(selectedInvoice)}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    <Printer size={18} />
                                    Imprimer
                                </button>

                                <button
                                    onClick={() => generatePDF(selectedInvoice)}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    <Download size={18} />
                                    Télécharger PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}