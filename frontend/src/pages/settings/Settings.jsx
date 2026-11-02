import { useEffect, useState } from "react";
import {
    Settings as SettingsIcon,
    Building2,
    ShoppingCart,
    Truck,
    Receipt,
    Bell,
    Shield,
    Database,
    Save,
    RotateCcw,
    Upload,
    Download,
    Check,
    AlertTriangle,
} from "lucide-react";

const defaultSettings = {
    // Général
    language: "Français",
    currency: "MGA",
    dateFormat: "DD/MM/YYYY",
    timezone: "Indian/Antananarivo",

    // Entreprise
    companyName: "GestionStock",
    companyEmail: "contact@gestionstock.com",
    companyPhone: "+261 34 00 000 00",
    companyAddress: "Antananarivo, Madagascar",
    companyWebsite: "www.gestionstock.com",
    taxNumber: "",

    // Stock
    lowStockThreshold: 10,
    criticalStockThreshold: 3,
    allowNegativeStock: false,
    autoStockUpdate: true,

    // Ventes
    defaultPaymentMethod: "Espèces",
    allowCredit: true,
    requireCustomer: false,
    autoInvoice: true,

    // Achats
    autoReceiveStock: true,
    defaultTax: 20,
    defaultDiscount: 0,

    // Facturation
    invoicePrefix: "FAC-",
    invoiceStartingNumber: 1001,
    invoiceFooter: "Merci pour votre confiance.",
    showCompanyLogo: true,

    // Notifications
    enableNotifications: true,
    lowStockNotifications: true,
    outOfStockNotifications: true,
    saleNotifications: true,
    purchaseNotifications: true,

    // Sécurité
    sessionTimeout: 30,
    requirePasswordChange: false,
    twoFactor: false,
};

const tabs = [
    {
        id: "general",
        label: "Général",
        icon: SettingsIcon,
    },
    {
        id: "company",
        label: "Entreprise",
        icon: Building2,
    },
    {
        id: "stock",
        label: "Stock",
        icon: Database,
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
        id: "invoices",
        label: "Facturation",
        icon: Receipt,
    },
    {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
    },
    {
        id: "security",
        label: "Sécurité",
        icon: Shield,
    },
    {
        id: "backup",
        label: "Sauvegarde",
        icon: Database,
    },
];

export default function Settings() {
    const [activeTab, setActiveTab] = useState("general");

    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem(
                "gestionstock_settings"
            );

            return saved
                ? {
                      ...defaultSettings,
                      ...JSON.parse(saved),
                  }
                : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        localStorage.setItem(
            "gestionstock_settings",
            JSON.stringify(settings)
        );
    }, [settings]);

    function updateSetting(name, value) {
        setSettings((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSaved(false);
    }

    function saveSettings() {
        localStorage.setItem(
            "gestionstock_settings",
            JSON.stringify(settings)
        );

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 3000);
    }

    function resetSettings() {
        const confirmed = window.confirm(
            "Voulez-vous vraiment réinitialiser tous les paramètres ?"
        );

        if (!confirmed) return;

        setSettings(defaultSettings);

        localStorage.setItem(
            "gestionstock_settings",
            JSON.stringify(defaultSettings)
        );

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 3000);
    }

    function exportSettings() {
        const data = JSON.stringify(settings, null, 2);

        const blob = new Blob([data], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "gestionstock-settings.json";
        link.click();

        URL.revokeObjectURL(url);
    }

    function importSettings(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);

                setSettings({
                    ...defaultSettings,
                    ...imported,
                });

                alert("Paramètres importés avec succès.");
            } catch {
                alert(
                    "Le fichier sélectionné n'est pas valide."
                );
            }
        };

        reader.readAsText(file);

        event.target.value = "";
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <SettingsIcon size={24} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Paramètres
                            </h1>

                            <p className="text-sm text-gray-500">
                                Configurez votre application et vos
                                préférences.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={resetSettings}
                            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <RotateCcw size={17} />
                            Réinitialiser
                        </button>

                        <button
                            onClick={saveSettings}
                            className="flex items-center gap-2 rounded-xl bg-[var(--couleur-principale)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--couleur-hover)]"
                        >
                            <Save size={17} />
                            Enregistrer
                        </button>
                    </div>
                </div>

                {/* MESSAGE SAUVEGARDE */}
                {saved && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        <Check size={19} />
                        Les paramètres ont été enregistrés avec succès.
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">

                    {/* MENU */}
                    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
                        <div className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() =>
                                            setActiveTab(tab.id)
                                        }
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                                            activeTab === tab.id
                                                ? "bg-[var(--couleur-principale)] text-white shadow-sm"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                    >
                                        <Icon size={19} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* CONTENU */}
                    <main className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                        {activeTab === "general" && (
                            <GeneralSettings
                                settings={settings}
                                updateSetting={updateSetting}
                            />
                        )}

                        {activeTab === "company" && (
                            <CompanySettings
                                settings={settings}
                                updateSetting={updateSetting}
                            />
                        )}

                        {activeTab === "stock" && (
                            <StockSettings
                                settings={settings}
                                updateSetting={updateSetting}
                            />
                        )}

                        {activeTab === "sales" && (
                            <SalesSettings
                                settings={settings}
                                updateSetting={updateSetting}
                            />
                        )}

                        {activeTab === "purchases" && (
                            <PurchaseSettings
                                settings={settings}
                                updateSetting={updateSetting}
                            />
                        )}

                        {activeTab === "invoices" && (
                            <InvoiceSettings
                                settings={settings}
                                updateSetting={updateSetting}
                            />
                        )}

                        {activeTab === "notifications" && (
                            <NotificationSettings
                                settings={settings}
                                updateSetting={updateSetting}
                            />
                        )}

                        {activeTab === "security" && (
                            <SecuritySettings
                                settings={settings}
                                updateSetting={updateSetting}
                            />
                        )}

                        {activeTab === "backup" && (
                            <BackupSettings
                                exportSettings={exportSettings}
                                importSettings={importSettings}
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   GENERAL
========================================================= */

function GeneralSettings({ settings, updateSetting }) {
    return (
        <SettingsSection
            title="Paramètres généraux"
            description="Configurez la langue, la devise et le format de votre application."
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <SelectField
                    label="Langue"
                    value={settings.language}
                    onChange={(value) =>
                        updateSetting("language", value)
                    }
                    options={[
                        "Français",
                        "English",
                        "Malagasy",
                    ]}
                />

                <SelectField
                    label="Devise"
                    value={settings.currency}
                    onChange={(value) =>
                        updateSetting("currency", value)
                    }
                    options={[
                        "MGA",
                        "EUR",
                        "USD",
                        "GBP",
                    ]}
                />

                <SelectField
                    label="Format de date"
                    value={settings.dateFormat}
                    onChange={(value) =>
                        updateSetting("dateFormat", value)
                    }
                    options={[
                        "DD/MM/YYYY",
                        "MM/DD/YYYY",
                        "YYYY-MM-DD",
                    ]}
                />

                <SelectField
                    label="Fuseau horaire"
                    value={settings.timezone}
                    onChange={(value) =>
                        updateSetting("timezone", value)
                    }
                    options={[
                        "Indian/Antananarivo",
                        "Europe/Paris",
                        "UTC",
                    ]}
                />
            </div>
        </SettingsSection>
    );
}

/* =========================================================
   ENTREPRISE
========================================================= */

function CompanySettings({ settings, updateSetting }) {
    return (
        <SettingsSection
            title="Informations de l'entreprise"
            description="Ces informations pourront être utilisées sur les factures et documents."
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <InputField
                    label="Nom de l'entreprise"
                    value={settings.companyName}
                    onChange={(value) =>
                        updateSetting("companyName", value)
                    }
                />

                <InputField
                    label="Email"
                    type="email"
                    value={settings.companyEmail}
                    onChange={(value) =>
                        updateSetting("companyEmail", value)
                    }
                />

                <InputField
                    label="Téléphone"
                    value={settings.companyPhone}
                    onChange={(value) =>
                        updateSetting("companyPhone", value)
                    }
                />

                <InputField
                    label="Site web"
                    value={settings.companyWebsite}
                    onChange={(value) =>
                        updateSetting("companyWebsite", value)
                    }
                />

                <InputField
                    label="Adresse"
                    value={settings.companyAddress}
                    onChange={(value) =>
                        updateSetting("companyAddress", value)
                    }
                />

                <InputField
                    label="Numéro fiscal"
                    value={settings.taxNumber}
                    onChange={(value) =>
                        updateSetting("taxNumber", value)
                    }
                    placeholder="Ex: NIF / STAT"
                />
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-6 text-center">
                <Building2
                    size={35}
                    className="mx-auto mb-3 text-gray-300"
                />

                <p className="font-medium text-gray-800">
                    Logo de l'entreprise
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    Le logo pourra être utilisé sur les factures.
                </p>

                <button className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Upload size={17} />
                    Importer un logo
                </button>
            </div>
        </SettingsSection>
    );
}

/* =========================================================
   STOCK
========================================================= */

function StockSettings({ settings, updateSetting }) {
    return (
        <SettingsSection
            title="Paramètres du stock"
            description="Configurez le comportement automatique de la gestion du stock."
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <NumberField
                    label="Seuil de stock faible"
                    value={settings.lowStockThreshold}
                    onChange={(value) =>
                        updateSetting(
                            "lowStockThreshold",
                            Number(value)
                        )
                    }
                />

                <NumberField
                    label="Seuil de stock critique"
                    value={settings.criticalStockThreshold}
                    onChange={(value) =>
                        updateSetting(
                            "criticalStockThreshold",
                            Number(value)
                        )
                    }
                />
            </div>

            <div className="mt-6 space-y-3">
                <ToggleField
                    title="Mise à jour automatique du stock"
                    description="Mettre automatiquement à jour le stock après une vente, un achat ou un mouvement."
                    checked={settings.autoStockUpdate}
                    onChange={(value) =>
                        updateSetting(
                            "autoStockUpdate",
                            value
                        )
                    }
                />

                <ToggleField
                    title="Autoriser le stock négatif"
                    description="Autoriser la vente lorsque la quantité disponible est insuffisante."
                    checked={settings.allowNegativeStock}
                    onChange={(value) =>
                        updateSetting(
                            "allowNegativeStock",
                            value
                        )
                    }
                    warning
                />
            </div>
        </SettingsSection>
    );
}

/* =========================================================
   VENTES
========================================================= */

function SalesSettings({ settings, updateSetting }) {
    return (
        <SettingsSection
            title="Paramètres des ventes"
            description="Configurez le comportement du module des ventes."
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <SelectField
                    label="Mode de paiement par défaut"
                    value={settings.defaultPaymentMethod}
                    onChange={(value) =>
                        updateSetting(
                            "defaultPaymentMethod",
                            value
                        )
                    }
                    options={[
                        "Espèces",
                        "Carte bancaire",
                        "Mobile Money",
                        "Chèque",
                        "Crédit",
                    ]}
                />
            </div>

            <div className="mt-6 space-y-3">
                <ToggleField
                    title="Autoriser les ventes à crédit"
                    description="Permettre aux utilisateurs d'enregistrer des ventes avec paiement différé."
                    checked={settings.allowCredit}
                    onChange={(value) =>
                        updateSetting(
                            "allowCredit",
                            value
                        )
                    }
                />

                <ToggleField
                    title="Client obligatoire"
                    description="Exiger la sélection d'un client avant de valider une vente."
                    checked={settings.requireCustomer}
                    onChange={(value) =>
                        updateSetting(
                            "requireCustomer",
                            value
                        )
                    }
                />

                <ToggleField
                    title="Créer automatiquement une facture"
                    description="Générer automatiquement une facture après validation d'une vente."
                    checked={settings.autoInvoice}
                    onChange={(value) =>
                        updateSetting(
                            "autoInvoice",
                            value
                        )
                    }
                />
            </div>
        </SettingsSection>
    );
}

/* =========================================================
   ACHATS
========================================================= */

function PurchaseSettings({ settings, updateSetting }) {
    return (
        <SettingsSection
            title="Paramètres des achats"
            description="Configurez le fonctionnement des commandes fournisseurs."
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <NumberField
                    label="Taxe par défaut (%)"
                    value={settings.defaultTax}
                    onChange={(value) =>
                        updateSetting(
                            "defaultTax",
                            Number(value)
                        )
                    }
                />

                <NumberField
                    label="Remise par défaut (%)"
                    value={settings.defaultDiscount}
                    onChange={(value) =>
                        updateSetting(
                            "defaultDiscount",
                            Number(value)
                        )
                    }
                />
            </div>

            <div className="mt-6 space-y-3">
                <ToggleField
                    title="Réception automatique du stock"
                    description="Augmenter automatiquement le stock lorsqu'un achat passe au statut reçu."
                    checked={settings.autoReceiveStock}
                    onChange={(value) =>
                        updateSetting(
                            "autoReceiveStock",
                            value
                        )
                    }
                />
            </div>
        </SettingsSection>
    );
}

/* =========================================================
   FACTURATION
========================================================= */

function InvoiceSettings({ settings, updateSetting }) {
    return (
        <SettingsSection
            title="Paramètres de facturation"
            description="Configurez la numérotation et l'apparence des factures."
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <InputField
                    label="Préfixe des factures"
                    value={settings.invoicePrefix}
                    onChange={(value) =>
                        updateSetting(
                            "invoicePrefix",
                            value
                        )
                    }
                />

                <NumberField
                    label="Prochain numéro"
                    value={settings.invoiceStartingNumber}
                    onChange={(value) =>
                        updateSetting(
                            "invoiceStartingNumber",
                            Number(value)
                        )
                    }
                />
            </div>

            <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Pied de facture
                </label>

                <textarea
                    value={settings.invoiceFooter}
                    onChange={(e) =>
                        updateSetting(
                            "invoiceFooter",
                            e.target.value
                        )
                    }
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Texte affiché en bas de la facture..."
                />
            </div>

            <div className="mt-6">
                <ToggleField
                    title="Afficher le logo"
                    description="Afficher le logo de l'entreprise sur les factures."
                    checked={settings.showCompanyLogo}
                    onChange={(value) =>
                        updateSetting(
                            "showCompanyLogo",
                            value
                        )
                    }
                />
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                    Exemple de prochaine facture
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                    {settings.invoicePrefix}
                    {settings.invoiceStartingNumber}
                </p>
            </div>
        </SettingsSection>
    );
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

function NotificationSettings({ settings, updateSetting }) {
    return (
        <SettingsSection
            title="Paramètres des notifications"
            description="Choisissez les événements pour lesquels vous souhaitez recevoir des alertes."
        >
            <div className="space-y-3">
                <ToggleField
                    title="Activer les notifications"
                    description="Activer ou désactiver le système de notifications."
                    checked={settings.enableNotifications}
                    onChange={(value) =>
                        updateSetting(
                            "enableNotifications",
                            value
                        )
                    }
                />

                <ToggleField
                    title="Stock faible"
                    description="Recevoir une notification lorsqu'un produit atteint le seuil de stock faible."
                    checked={
                        settings.lowStockNotifications
                    }
                    onChange={(value) =>
                        updateSetting(
                            "lowStockNotifications",
                            value
                        )
                    }
                />

                <ToggleField
                    title="Rupture de stock"
                    description="Recevoir une notification lorsqu'un produit arrive à zéro."
                    checked={
                        settings.outOfStockNotifications
                    }
                    onChange={(value) =>
                        updateSetting(
                            "outOfStockNotifications",
                            value
                        )
                    }
                />

                <ToggleField
                    title="Nouvelle vente"
                    description="Recevoir une notification lorsqu'une nouvelle vente est enregistrée."
                    checked={settings.saleNotifications}
                    onChange={(value) =>
                        updateSetting(
                            "saleNotifications",
                            value
                        )
                    }
                />

                <ToggleField
                    title="Nouvel achat"
                    description="Recevoir une notification lorsqu'un nouvel achat est enregistré."
                    checked={
                        settings.purchaseNotifications
                    }
                    onChange={(value) =>
                        updateSetting(
                            "purchaseNotifications",
                            value
                        )
                    }
                />
            </div>
        </SettingsSection>
    );
}

/* =========================================================
   SECURITE
========================================================= */

function SecuritySettings({ settings, updateSetting }) {
    return (
        <SettingsSection
            title="Sécurité"
            description="Configurez les options de sécurité de votre application."
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <NumberField
                    label="Expiration de session (minutes)"
                    value={settings.sessionTimeout}
                    onChange={(value) =>
                        updateSetting(
                            "sessionTimeout",
                            Number(value)
                        )
                    }
                />
            </div>

            <div className="mt-6 space-y-3">
                <ToggleField
                    title="Forcer le changement de mot de passe"
                    description="Demander aux utilisateurs de changer régulièrement leur mot de passe."
                    checked={
                        settings.requirePasswordChange
                    }
                    onChange={(value) =>
                        updateSetting(
                            "requirePasswordChange",
                            value
                        )
                    }
                />

                <ToggleField
                    title="Authentification à deux facteurs"
                    description="Ajouter une deuxième étape de vérification lors de la connexion."
                    checked={settings.twoFactor}
                    onChange={(value) =>
                        updateSetting(
                            "twoFactor",
                            value
                        )
                    }
                />
            </div>

            <div className="mt-6 flex gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
                <AlertTriangle
                    size={20}
                    className="shrink-0 text-orange-600"
                />

                <div>
                    <p className="text-sm font-semibold text-orange-800">
                        Attention
                    </p>

                    <p className="mt-1 text-xs text-orange-700">
                        Ces paramètres sont actuellement simulés côté
                        frontend. La sécurité réelle sera gérée par le
                        backend lors de l'intégration de l'authentification.
                    </p>
                </div>
            </div>
        </SettingsSection>
    );
}

/* =========================================================
   SAUVEGARDE
========================================================= */

function BackupSettings({
    exportSettings,
    importSettings,
}) {
    return (
        <SettingsSection
            title="Sauvegarde et restauration"
            description="Exportez vos paramètres ou restaurez une configuration précédente."
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div className="rounded-2xl border border-gray-200 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <Download size={21} />
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-900">
                        Exporter les paramètres
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Téléchargez votre configuration au format JSON.
                    </p>

                    <button
                        onClick={exportSettings}
                        className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        <Download size={17} />
                        Exporter
                    </button>
                </div>

                <div className="rounded-2xl border border-gray-200 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                        <Upload size={21} />
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-900">
                        Restaurer les paramètres
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Importez un fichier JSON précédemment sauvegardé.
                    </p>

                    <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                        <Upload size={17} />
                        Importer

                        <input
                            type="file"
                            accept=".json,application/json"
                            onChange={importSettings}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-800">
                    Stockage local activé
                </p>

                <p className="mt-1 text-xs text-blue-700">
                    Les paramètres sont conservés dans le navigateur avec
                    localStorage. Ils resteront disponibles après
                    actualisation de la page.
                </p>
            </div>
        </SettingsSection>
    );
}

/* =========================================================
   COMPOSANTS UI
========================================================= */

function SettingsSection({
    title,
    description,
    children,
}) {
    return (
        <section>
            <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
                <h2 className="text-lg font-bold text-gray-900">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            </div>

            <div className="p-5 sm:p-7">
                {children}
            </div>
        </section>
    );
}

function InputField({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
        </div>
    );
}

function NumberField({
    label,
    value,
    onChange,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type="number"
                min="0"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
        </div>
    );
}

function SelectField({
    label,
    value,
    onChange,
    options,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

function ToggleField({
    title,
    description,
    checked,
    onChange,
    warning = false,
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                        {title}
                    </p>

                    {warning && (
                        <AlertTriangle
                            size={15}
                            className="text-orange-500"
                        />
                    )}
                </div>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                    {description}
                </p>
            </div>

            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    checked
                        ? "bg-blue-600"
                        : "bg-gray-300"
                }`}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                        checked
                            ? "left-6"
                            : "left-1"
                    }`}
                />
            </button>
        </div>
    );
}