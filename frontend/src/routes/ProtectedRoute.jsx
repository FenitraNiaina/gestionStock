import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const auth = localStorage.getItem("gestionstock_auth");

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(auth);

        if (!user.isAuthenticated) {
            return <Navigate to="/login" replace />;
        }

        return <Outlet />;
    } catch {
        localStorage.removeItem("gestionstock_auth");
        return <Navigate to="/login" replace />;
    }
}