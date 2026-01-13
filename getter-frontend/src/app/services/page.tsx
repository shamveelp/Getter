"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/user/Navbar';
import Link from 'next/link';
import { exploreApiService } from '@/services/user/exploreApiService';
import { Search, MapPin, Filter } from 'lucide-react';

interface IService {
    _id: string;
    title: string;
    category: string;
    pricePerDay: number;
    location: string;
    images?: string[];
    description: string;
}

export default function ServicesPage() {
    const [services, setServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        minPrice: "",
        maxPrice: "",
        location: "",
        sort: ""
    });

    const categoryOptions = [
        "Venue", "Caterer", "DJ", "Photographer", "Decoration", "Other"
    ];

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await exploreApiService.searchServices({
                keyword: searchTerm,
                ...filters
            });
            if (data.success) {
                setServices(data.data.data); // data.data.data because pagination return { data: [], total: N }
            }
        } catch (error) {
            console.error("Failed to fetch services", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchServices();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-outfit">
            <Navbar />
            <div className="pt-32 px-4 md:px-8 max-w-7xl mx-auto space-y-12 pb-20">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Explore Services
                    </h1>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Find and book the best services for your next event, from venues to photographers.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 md:p-6 space-y-4 md:space-y-0 md:flex md:gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, category..."
                            className="w-full bg-neutral-800 border-none rounded-xl pl-10 pr-4 py-3 focus:ring-1 focus:ring-brand-500 text-white placeholder:text-neutral-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 text-sm overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="bg-neutral-800 border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-brand-500 text-white cursor-pointer min-w-[120px]"
                        >
                            <option value="">Category</option>
                            {categoryOptions.map(cat => <option key={cat} value={cat.toLowerCase()}>{cat}</option>)}
                        </select>

                        <div className="relative min-w-[120px]">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                className="w-full bg-neutral-800 border-none rounded-xl pl-9 pr-4 py-3 focus:ring-1 focus:ring-brand-500 text-white placeholder:text-neutral-500"
                                value={filters.location}
                                onChange={handleFilterChange}
                            />
                        </div>

                        <select
                            name="sort"
                            value={filters.sort}
                            onChange={handleFilterChange}
                            className="bg-neutral-800 border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-brand-500 text-white cursor-pointer min-w-[140px]"
                        >
                            <option value="">Sort By</option>
                            <option value="createdAt:desc">Newest</option>
                            <option value="pricePerDay:asc">Price: Low to High</option>
                            <option value="pricePerDay:desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="text-center py-20 text-neutral-500">Loading services...</div>
                ) : services.length === 0 ? (
                    <div className="text-center py-20 text-neutral-500">No services found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <Link href={`/services/${service._id}`} key={service._id} className="group relative bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 block">
                                {/* Image Placeholder */}
                                <div className="aspect-[4/3] bg-neutral-800 relative overflow-hidden">
                                    {service.images && service.images.length > 0 ? (
                                        <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-600">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />

                                    <span className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10 capitalize">
                                        {service.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-brand-400 font-medium flex items-center gap-1">
                                            <MapPin size={14} /> {service.location}
                                        </p>
                                        <h3 className="text-xl font-semibold group-hover:text-brand-400 transition-colors truncate">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-neutral-400 line-clamp-2">{service.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <span className="text-lg font-bold">₹{service.pricePerDay}<span className="text-xs text-neutral-500 font-normal">/day</span></span>
                                        <button className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
