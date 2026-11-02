import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Zone principale */}
            <div className="lg:ml-64">

                {/* Header */}
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* Contenu */}
                <main className="bg-white min-h-[calc(100vh-64px)]">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}