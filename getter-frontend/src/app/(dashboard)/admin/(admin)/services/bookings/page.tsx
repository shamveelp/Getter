"use client";

import React, { useEffect, useState } from "react";
import Badge from "../../../../../../components/admin/ui/badge/Badge";
import { adminBookingApiService } from "@/services/admin/adminBookingApiService";
import Button from "../../../../../../components/admin/ui/button/Button";

interface IBooking {
    _id: string;
    service: {
        title: string;
    };
    user: {
        email: string;
        name: string;
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    createdAt: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await adminBookingApiService.getAllBookings();
            if (response.success) {
                setBookings(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Booking Management</h1>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">Loading...</div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase font-medium text-gray-500 dark:text-gray-300">
                                <tr>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Dates</th>
                                    <th className="px-6 py-4">Total Price</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {booking.service?.title || 'Unknown Service'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {booking.user?.name}
                                                </span>
                                                <span className="text-xs text-gray-500">{booking.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            ₹{booking.totalPrice}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                size="sm"
                                                color={
                                                    booking.status === 'confirmed' ? 'success' :
                                                        booking.status === 'cancelled' ? 'error' :
                                                            'warning'
                                                }
                                            >
                                                {booking.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {new Date(booking.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No bookings found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
