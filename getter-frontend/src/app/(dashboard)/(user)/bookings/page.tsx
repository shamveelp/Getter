"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/user/Navbar';
import { bookingApiService } from '@/services/user/bookingApiService';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

interface IBooking {
    _id: string;
    service: {
        _id: string;
        title: string;
        location: string;
        images: string[];
        pricePerDay: number;
    };
    startDate: string;
    endDate: string;
    selectedDates?: string[];
    totalPrice: number;
    status: string;
    createdAt: string;
}

export default function UserBookingsPage() {
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await bookingApiService.getMyBookings();
                if (response.success) {
                    setBookings(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-outfit">
            <Navbar />
            <div className="pt-32 px-4 md:px-8 max-w-6xl mx-auto pb-20">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">My Bookings</h1>
                    <p className="text-neutral-400">Manage and view details of your upcoming and past events.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-white/5">
                        <Calendar className="w-16 h-16 mx-auto text-neutral-600 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
                        <p className="text-neutral-500 mb-6">You haven't booked any services yet.</p>
                        <Link href="/services" className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors">
                            Explore Services
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="group bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300">
                                <div className="flex flex-col md:flex-row">
                                    {/* Image Section */}
                                    <div className="w-full md:w-64 h-48 md:h-auto bg-neutral-800 relative">
                                        {booking.service?.images && booking.service.images.length > 0 ? (
                                            <img
                                                src={booking.service.images[0]}
                                                alt={booking.service.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-600">No Image</div>
                                        )}
                                        <div className="absolute top-4 left-4 md:hidden">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-1 group-hover:text-brand-400 transition-colors">
                                                        {booking.service?.title}
                                                    </h3>
                                                    <p className="text-neutral-400 flex items-center text-sm">
                                                        <MapPin size={14} className="mr-1" /> {booking.service?.location}
                                                    </p>
                                                </div>
                                                <div className="hidden md:block">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                                {booking.selectedDates && booking.selectedDates.length > 0 ? (
                                                    <div className="md:col-span-2 bg-white/5 rounded-xl p-3 border border-white/5">
                                                        <span className="text-xs text-neutral-500 block mb-1">Selected Dates</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {booking.selectedDates.map((d, i) => (
                                                                <span key={i} className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-medium">
                                                                    {format(new Date(d), 'MMM dd')}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                                            <span className="text-xs text-neutral-500 block mb-1">Check-in</span>
                                                            <span className="text-sm font-semibold">{format(new Date(booking.startDate), 'MMM dd, yyyy')}</span>
                                                        </div>
                                                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                                            <span className="text-xs text-neutral-500 block mb-1">Check-out</span>
                                                            <span className="text-sm font-semibold">{format(new Date(booking.endDate), 'MMM dd, yyyy')}</span>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                                    <span className="text-xs text-neutral-500 block mb-1">Total Amount</span>
                                                    <span className="text-sm font-semibold">₹{booking.totalPrice}</span>
                                                </div>
                                                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-center">
                                                    {booking.status === 'PENDING' ? (
                                                        <span className="text-xs text-yellow-500 font-medium flex items-center gap-1">
                                                            <Clock size={12} /> Awaiting Confirmation
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                                                            <CheckCircle2 size={12} /> Confirmed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4 border-t border-white/5">
                                            <Link href={`/services/${booking.service?._id}`} className="text-sm text-neutral-300 hover:text-white transition-colors">
                                                View Service Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
