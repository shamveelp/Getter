"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "../../../../../components/admin/ui/badge/Badge";
import { adminServiceService } from "../../../../../services/admin/adminServiceApiService";
import Button from "../../../../../components/admin/ui/button/Button";
import { Edit, Trash2 } from "lucide-react";

interface IService {
    _id: string;
    title: string;
    category: string;
    pricePerDay: number;
    location: string;
    status: string;
    createdAt: string;
    images?: string[];
}

export default function ServicesPage() {
    const [services, setServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [searchTerm, setSearchTerm] = useState("");

    const fetchServices = async (page: number, search: string) => {
        try {
            setLoading(true);
            const data = await adminServiceService.getAllServices(page, limit, search);
            if (data.success) {
                setServices(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch services", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchServices(currentPage, searchTerm);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, currentPage]);

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Service Management</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <Link href="/admin/services/new" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                        Add Service
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service) => (
                        <div key={service._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                                {service.images && service.images.length > 0 ? (
                                    <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Badge size="sm" color={service.status === 'active' ? 'success' : 'warning'}>{service.status}</Badge>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 truncate">{service.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 capitalize">{service.category}</p>
                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="font-medium text-brand-600 dark:text-brand-400">${service.pricePerDay}/day</span>
                                    <span className="text-gray-500 truncate max-w-[50%]">{service.location}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between gap-2">
                                    <Link href={`/admin/services/${service._id}`} className="flex-1 text-center py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                                        Edit
                                    </Link>
                                    <button onClick={() => { }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/10">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {services.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No services found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
