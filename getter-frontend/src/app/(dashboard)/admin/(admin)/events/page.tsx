"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "../../../../../components/admin/ui/badge/Badge";
import { adminEventService } from "../../../../../services/admin/adminEventApiService";
import { Edit, Trash2, Calendar, MapPin } from "lucide-react";

interface IEvent {
    _id: string;
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    price: number;
    status: string;
    images?: string[];
}

export default function EventsPage() {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [searchTerm, setSearchTerm] = useState("");

    const fetchEvents = async (page: number, search: string) => {
        try {
            setLoading(true);
            const data = await adminEventService.getAllEvents(page, limit, search);
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchEvents(currentPage, searchTerm);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, currentPage]);

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Event Management</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <Link href="/admin/events/new" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                        Add Event
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                                {event.images && event.images.length > 0 ? (
                                    <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Badge size="sm" color={event.status === 'upcoming' ? 'success' : event.status === 'ended' ? 'dark' : 'warning'}>{event.status}</Badge>
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                                    ${event.price}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 truncate">{event.title}</h3>

                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    <Calendar size={14} />
                                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    <MapPin size={14} />
                                    <span className="truncate">{event.location}</span>
                                </div>

                                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between gap-2">
                                    <Link href={`/admin/events/${event._id}`} className="flex-1 text-center py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                                        Edit
                                    </Link>
                                    <button onClick={() => { }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/10">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No events found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
