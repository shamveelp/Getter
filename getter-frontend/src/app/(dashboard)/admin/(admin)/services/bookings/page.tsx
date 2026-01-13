"use client";

import React, { useEffect, useState } from "react";
import Badge from "../../../../../../components/admin/ui/badge/Badge";
import { adminBookingService } from "../../../../../../services/admin/adminBookingApiService";

interface IBooking {
    _id: string;
    user: {
        _id: string;
        fullName: string;
        email: string;
    };
    service: {
        _id: string;
        title: string;
    } | null;
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
            const response = await adminBookingService.getAllBookings(); // Assuming response.data is the array or response.data.data
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

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">All Bookings</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Booking ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Service</th>
                                <th className="px-6 py-4 font-medium">Dates</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Created At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">Loading bookings...</td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">No bookings found.</td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-sm">
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-mono text-xs">
                                            #{booking._id.slice(-6)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800 dark:text-white">{booking.user?.fullName || "N/A"}</span>
                                                <span className="text-xs text-gray-500">{booking.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                            {booking.service?.title || "Deleted Service"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-xs">
                                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">
                                            ₹{booking.totalPrice}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                size="sm"
                                                color={ // Fix lint
                                                    booking.status === 'confirmed' ? 'success' :
                                                        booking.status === 'pending' ? 'warning' :
                                                            'error'
                                                }
                                            >
                                                {booking.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(booking.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
