"use client";
import React from "react";

export default function SettingsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h1>

            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">General Settings</h2>
                    <p className="text-gray-500 text-sm">Configure platform-wide settings.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Booking Defaults</h2>
                    <p className="text-gray-500 text-sm">Set default values for events and services.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Payment Gateways</h2>
                    <p className="text-gray-500 text-sm">Manage payment providers and keys.</p>
                </div>
            </div>
        </div>
    );
}
