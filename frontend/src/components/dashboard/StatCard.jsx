import React from "react";

export default function StatCard({
    title,
    value,
    icon: Icon,
    description,
    iconClass = "bg-blue-100 text-blue-600",
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </h3>

                    {description && (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                </div>

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
}