"use client";

import React, { useEffect, useState } from 'react';
import { adminBookingApiService } from '@/services/admin/adminBookingApiService';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Calendar, User, DollarSign } from 'lucide-react';

interface IBooking {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    service: {
        _id: string;
        title: string;
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    createdAt: string;
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
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
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(b =>
        b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.service?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-[1600px] w-full mx-auto">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Bookings</h1>
                    <p className="text-zinc-400">View and manage all service bookings.</p>
                </div>
            </div>

            <Card className="bg-zinc-950 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">All Bookings</CardTitle>
                    <CardDescription className="text-zinc-400">
                        A list of all bookings made by users.
                    </CardDescription>
                    <div className="pt-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search by user or service..."
                                className="w-full bg-zinc-900 border-zinc-800 text-white rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-10 text-zinc-500">Loading bookings...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableHead className="text-zinc-400">Service</TableHead>
                                    <TableHead className="text-zinc-400">User</TableHead>
                                    <TableHead className="text-zinc-400">Dates</TableHead>
                                    <TableHead className="text-zinc-400">Amount</TableHead>
                                    <TableHead className="text-zinc-400">Status</TableHead>
                                    <TableHead className="text-zinc-400 text-right">Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBookings.length === 0 ? (
                                    <TableRow className="border-zinc-800">
                                        <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                            No bookings found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <TableRow key={booking._id} className="border-zinc-800 hover:bg-zinc-900/50">
                                            <TableCell className="font-medium text-white">
                                                {booking.service?.title || <span className="text-red-500">Deleted Service</span>}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{booking.user?.name}</span>
                                                    <span className="text-xs text-zinc-500">{booking.user?.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-zinc-300">
                                                <div className="flex flex-col text-sm">
                                                    <span>{format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}</span>
                                                    <span className="text-xs text-zinc-500">
                                                        {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-white font-medium">
                                                ₹{booking.totalPrice}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                                                    className={
                                                        booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' :
                                                            booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' :
                                                                'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                    }
                                                >
                                                    {booking.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-zinc-500">
                                                {format(new Date(booking.createdAt), 'MMM dd, HH:mm')}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
