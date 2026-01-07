"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { adminCustomerService } from "../../../../../../services/admin/adminCustomerApiService";
import Badge from "../../../../../../components/admin/ui/badge/Badge";

interface IUser {
    _id: string;
    username: string;
    email: string;
    name: string;
    profilePicture?: string;
    bio?: string;
    phoneNumber?: string;
    isActive: boolean;
    isBanned: boolean;
    tokenVersion: number;
    createdAt: string;
    updatedAt: string;
}

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUser = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await adminCustomerService.getUserById(id);
            if (data.success) {
                // data.data.user
                setUser(data.data.user);
            }
        } catch (error) {
            console.error("Failed to fetch user details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    const handleBan = async () => {
        if (!confirm("Are you sure you want to ban this user? They will be logged out immediately.")) return;
        try {
            setActionLoading(true);
            await adminCustomerService.banUser(id);
            await fetchUser(); // Refresh data
        } catch (error) {
            console.error("Failed to ban user", error);
            alert("Failed to ban user");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnban = async () => {
        if (!confirm("Are you sure you want to unban this user?")) return;
        try {
            setActionLoading(true);
            await adminCustomerService.unbanUser(id);
            await fetchUser(); // Refresh data
        } catch (error) {
            console.error("Failed to unban user", error);
            alert("Failed to unban user");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!user) return <div className="p-6">User not found</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-2">
                    &larr; Back to Customers
                </button>
                <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Details</h1>
                    <div className="flex gap-3">
                        {user.isBanned ? (
                            <button
                                onClick={handleUnban}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {actionLoading ? "Unbanning..." : "Unban User"}
                            </button>
                        ) : (
                            <button
                                onClick={handleBan}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {actionLoading ? "Banning..." : "Ban User"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white dark:border-gray-700 shadow relative">
                            {user.profilePicture ? (
                                <Image src={user.profilePicture} alt={user.name} fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-2xl text-gray-500 font-bold">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                            <div className="mt-2 text-sm">
                                {user.isBanned ? (
                                    <Badge size="sm" color="error">Banned</Badge>
                                ) : (
                                    <Badge size="sm" color="success">Active</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                            <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                            <p className="mt-1 text-gray-900 dark:text-white">{user.phoneNumber || "Not provided"}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Bio</label>
                            <p className="mt-1 text-gray-900 dark:text-white">{user.bio || "No bio"}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</label>
                            <p className="mt-1 text-gray-900 dark:text-white">{new Date(user.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">User ID</label>
                            <p className="mt-1 text-xs text-gray-500 font-mono">{user._id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                            <p className="mt-1 text-gray-900 dark:text-white">{new Date(user.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
