"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { User, Package, MapPin, Wallet } from "lucide-react";
import { adminCustomerService } from "../../../../../../services/admin/adminCustomerApiService";
import Badge from "../../../../../../components/admin/ui/badge/Badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
    const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);

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
            toast.error("Failed to fetch user details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    const handleBan = async () => {
        try {
            setActionLoading(true);
            await adminCustomerService.banUser(id);
            await fetchUser(); // Refresh data
            toast.success("User has been banned successfully");
            setIsBanDialogOpen(false);
        } catch (error) {
            console.error("Failed to ban user", error);
            toast.error("Failed to ban user");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnban = async () => {
        try {
            setActionLoading(true);
            await adminCustomerService.unbanUser(id);
            await fetchUser(); // Refresh data
            toast.success("User has been unbanned successfully");
            setIsUnbanDialogOpen(false);
        } catch (error) {
            console.error("Failed to unban user", error);
            toast.error("Failed to unban user");
        } finally {
            setActionLoading(false);
        }
    };

    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { id: "overview", label: "Overview", icon: User },
        { id: "orders", label: "Orders", icon: Package },
        { id: "addresses", label: "Addresses", icon: MapPin },
        { id: "wallet", label: "Wallet", icon: Wallet },
    ];

    if (loading) return <div className="p-6">Loading...</div>;
    if (!user) return <div className="p-6">User not found</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-2">
                    &larr; Back to Customers
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 relative">
                            {user.profilePicture ? (
                                <Image src={user.profilePicture} alt={user.name} fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-xl text-gray-500 font-bold">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h1>
                            <p className="text-gray-500 dark:text-gray-400">@{user.username} • {user.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {user.isBanned ? (
                            <button
                                onClick={() => setIsUnbanDialogOpen(true)}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                                {actionLoading ? "Unbanning..." : "Unban User"}
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsBanDialogOpen(true)}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {actionLoading ? "Banning..." : "Ban User"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Pill Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors relative
                                ${activeTab === tab.id
                                    ? "text-brand-600 dark:text-brand-400 bg-white dark:bg-gray-800 border-b-2 border-brand-500"
                                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                }
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[400px]">
                {activeTab === "overview" && (
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Profile Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                                    <p className="mt-1 text-gray-900 dark:text-white">{user.name}</p>
                                </div>
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
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</label>
                                    <div className="mt-1">
                                        {user.isBanned ? (
                                            <Badge size="sm" color="error">Banned</Badge>
                                        ) : (
                                            <Badge size="sm" color="success">Active</Badge>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Joined Date</label>
                                    <p className="mt-1 text-gray-900 dark:text-white">{new Date(user.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                                    <p className="mt-1 text-gray-900 dark:text-white">{new Date(user.updatedAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">User ID</label>
                                    <p className="mt-1 text-xs text-gray-500 font-mono">{user._id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="p-6 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center py-12">
                            <Package className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium text-gray-900 dark:text-white">No orders found</p>
                            <p className="text-sm">This user hasn't placed any orders yet.</p>
                        </div>
                    </div>
                )}

                {activeTab === "addresses" && (
                    <div className="p-6 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center py-12">
                            <MapPin className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium text-gray-900 dark:text-white">No addresses saved</p>
                            <p className="text-sm">This user hasn't saved any addresses yet.</p>
                        </div>
                    </div>
                )}

                {activeTab === "wallet" && (
                    <div className="p-6 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center py-12">
                            <Wallet className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium text-gray-900 dark:text-white">Wallet functionality coming soon</p>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ban User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to ban this user? They will be logged out immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBanDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleBan} disabled={actionLoading}>
                            {actionLoading ? "Banning..." : "Ban User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isUnbanDialogOpen} onOpenChange={setIsUnbanDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Unban User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to unban this user? They will regain access to their account.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUnbanDialogOpen(false)}>Cancel</Button>
                        <Button variant="default" onClick={handleUnban} disabled={actionLoading}>
                            {actionLoading ? "Unbanning..." : "Unban User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
