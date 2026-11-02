
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// Layout
import DashboardLayout from "../components/layout/DashboardLayout";

// Auth
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";

// Dashboard
import Dashboard from "../pages/dashboard/Dashboard";

// Modules
import Categories from "../pages/categories/Categories";
import Suppliers from "../pages/suppliers/Suppliers";
import Customers from "../pages/customers/Customers";
import Purchases from "../pages/purchases/Purchases";
import Sales from "../pages/sales/Sales";
import Products from "../pages/products/Products";
import Invoices from "../pages/invoices/Invoices";
import History from "../pages/history/History";
import Rapports from "../pages/rapports/Rapports";
import Notifications from "../pages/notifications/Notifications";
import Users from "../pages/users/Users";
import Settings from "../pages/settings/Settings";
import StockMovements from "../pages/stock/StockMovements";

export default function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                {/* =========================
                    PAGE DE CONNEXION
                ========================== */}
                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =========================
                    ROUTES PROTÉGÉES
                ========================== */}
                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<DashboardLayout />}
                    >

                        {/* Tableau de bord */}
                        <Route
                            index
                            element={<Dashboard />}
                        />

                        {/* Catégories */}
                        <Route
                            path="categories"
                            element={<Categories />}
                        />

                        {/* Fournisseurs */}
                        <Route
                            path="fournisseurs"
                            element={<Suppliers />}
                        />

                        {/* Produits */}
                        <Route
                            path="produits"
                            element={<Products />}
                        />

                        {/* Clients */}
                        <Route
                            path="clients"
                            element={<Customers />}
                        />

                        {/* Achats */}
                        <Route
                            path="achats"
                            element={<Purchases />}
                        />

                        {/* Ventes */}
                        <Route
                            path="ventes"
                            element={<Sales />}
                        />

                        {/* Mouvements de stock */}
                        <Route
                            path="mouvements-stock"
                            element={<StockMovements />}
                        />

                        {/* Factures */}
                        <Route
                            path="factures"
                            element={<Invoices />}
                        />

                        {/* Historique */}
                        <Route
                            path="historique"
                            element={<History />}
                        />

                        {/* Rapports */}
                        <Route
                            path="rapports"
                            element={<Rapports />}
                        />

                        {/* Notifications */}
                        <Route
                            path="notifications"
                            element={<Notifications />}
                        />

                        {/* Utilisateurs */}
                        <Route
                            path="utilisateurs"
                            element={<Users />}
                        />

                        {/* Paramètres */}
                        <Route
                            path="parametres"
                            element={<Settings />}
                        />

                    </Route>

                </Route>


                {/* =========================
                    ROUTE PAR DÉFAUT
                ========================== */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* =========================
                    ROUTE INEXISTANTE
                ========================== */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}
