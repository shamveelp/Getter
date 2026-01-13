"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminServiceService } from "../../../../../../services/admin/adminServiceApiService";
import { adminBookingService } from "../../../../../../services/admin/adminBookingApiService";
import Badge from "../../../../../../components/admin/ui/badge/Badge";
import Button from "../../../../../../components/admin/ui/button/Button";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function ServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [service, setService] = useState<any>(null);
    const [stats, setStats] = useState({ totalBookings: 0 });
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'unlist' | 'list'>('unlist');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [serviceData, bookingsData] = await Promise.all([
                    adminServiceService.getServiceById(id),
                    adminBookingService.getAllBookings()
                ]);

                if (serviceData.success) {
                    setService(serviceData.data);
                }

                if (bookingsData.success) {
                    // Filter bookings for this service
                    const serviceBookings = bookingsData.data.filter((b: any) =>
                        b.serviceId === id || b.service?._id === id
                    );
                    setStats({ totalBookings: serviceBookings.length });
                }

            } catch (error) {
                console.error("Error fetching service details", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleAction = async () => {
        try {
            let res;
            if (actionType === 'unlist') {
                res = await adminServiceService.unlistService(id);
            } else {
                res = await adminServiceService.listService(id);
            }

            if (res.success) {
                // Refresh data
                const updated = await adminServiceService.getServiceById(id);
                setService(updated.data);
                setIsDialogOpen(false);
            }
        } catch (error) {
            console.error(`Error ${actionType}ing service`, error);
            alert(`Failed to ${actionType} service`);
        }
    };

    const openDialog = (type: 'unlist' | 'list') => {
        setActionType(type);
        setIsDialogOpen(true);
    };

    if (loading) return <div className="p-8 text-center">Loading details...</div>;
    if (!service) return <div className="p-8 text-center">Service not found</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{service.title}</h1>
                    <div className="flex items-center gap-3">
                        <Badge color={service.status === 'active' ? 'success' : 'warning'}>{service.status}</Badge>
                        <span className="text-gray-500 dark:text-gray-400 capitalize">{service.category}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    {service.status === 'active' ? (
                        <Button variant="outline" onClick={() => openDialog('unlist')} className="text-red-600 border-red-200 hover:bg-red-50">
                            Unlist Service
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={() => openDialog('list')} className="text-green-600 border-green-200 hover:bg-green-50">
                            List Service
                        </Button>
                    )}
                    <Link href={`/admin/services/${id}/edit`}>
                        <Button>Edit Service</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Description</h2>
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{service.description}</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Images</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {service.images?.map((img: string, idx: number) => (
                                <img key={idx} src={img} alt={`Service ${idx}`} className="w-full h-32 object-cover rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Performance</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Total Bookings</span>
                            <span className="text-2xl font-bold text-brand-600">{stats.totalBookings}</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Details</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Price</label>
                                <p className="text-gray-800 dark:text-white font-medium">₹{service.pricePerDay} / day</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Location</label>
                                <p className="text-gray-800 dark:text-white">{service.location}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Contact</label>
                                <p className="text-gray-800 dark:text-white">{service.contact?.email}</p>
                                <p className="text-gray-800 dark:text-white">{service.contact?.phone}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Availability</label>
                                {service.availability?.type === 'recurring' ? (
                                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                        <div className="flex flex-wrap gap-1 mb-1">
                                            {service.availability.recurring?.days?.map((d: string) => (
                                                <span key={d} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs capitalize">{d.slice(0, 3)}</span>
                                            ))}
                                        </div>
                                        <p>{service.availability.recurring?.startTime} - {service.availability.recurring?.endTime}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-800 dark:text-white text-sm">Specific Dates</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{actionType === 'unlist' ? 'Unlist Service' : 'List Service'}</DialogTitle>
                        <DialogDescription>
                            {actionType === 'unlist'
                                ? 'Are you sure you want to unlist this service? It will no longer be visible to users.'
                                : 'Are you sure you want to list this service? It will become visible to users again.'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAction} className={actionType === 'unlist' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}>
                            {actionType === 'unlist' ? 'Unlist' : 'List'}Service
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
