"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/user/Navbar';
import { exploreApiService } from '@/services/user/exploreApiService';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Mail, Phone, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ServiceDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        if (!id) return;
        const fetchDetail = async () => {
            try {
                const response = await exploreApiService.getServiceDetail(id);
                if (response.success) {
                    setService(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch service detail", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    if (!service) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Service not found</div>;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-outfit">
            <Navbar />
            <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <button onClick={() => router.back()} className="flex items-center text-neutral-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Services
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[4/3] bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 relative group">
                            {service.images && service.images.length > 0 ? (
                                <img src={service.images[activeImage]} alt={service.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-600">No Image</div>
                            )}
                        </div>
                        {service.images && service.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                                {service.images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <div>
                            <span className="inline-block px-3 py-1 bg-brand-500/10 text-brand-400 text-sm font-medium rounded-full mb-3 capitalize border border-brand-500/20">
                                {service.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">{service.title}</h1>
                            <p className="flex items-center text-neutral-400">
                                <MapPin size={18} className="mr-2" /> {service.location}
                            </p>
                        </div>

                        <div className="bg-neutral-900/50 p-6 rounded-2xl border border-white/10 space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm text-neutral-400 mb-1">Price per day</p>
                                    <p className="text-3xl font-bold">₹{service.pricePerDay}</p>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="fill-current w-5 h-5" />
                                    <span className="font-medium text-white">New</span>
                                </div>
                            </div>

                            <Button className="w-full h-12 text-lg bg-white text-black hover:bg-neutral-200">
                                Book Now
                            </Button>

                            {service.availability?.type === 'recurring' && (
                                <div className="pt-4 border-t border-white/10 text-sm">
                                    <p className="text-neutral-400 mb-2 flex items-center gap-2"><Calendar size={14} /> Weekly Availability</p>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {service.availability.recurring?.days?.map((d: string) => (
                                            <span key={d} className="px-2 py-1 bg-neutral-800 rounded text-xs capitalize text-neutral-300">{d}</span>
                                        ))}
                                    </div>
                                    <p className="text-neutral-300">{service.availability.recurring?.startTime} - {service.availability.recurring?.endTime}</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">About this service</h3>
                            <p className="text-neutral-400 leading-relaxed whitespace-pre-line">
                                {service.description}
                            </p>
                        </div>

                        <div className="space-y-4 py-6 border-t border-white/10">
                            <h3 className="text-xl font-semibold">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {service.contact?.email && (
                                    <div className="flex items-center gap-3 text-neutral-300">
                                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                                            <Mail size={18} />
                                        </div>
                                        <span>{service.contact.email}</span>
                                    </div>
                                )}
                                {service.contact?.phone && (
                                    <div className="flex items-center gap-3 text-neutral-300">
                                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                                            <Phone size={18} />
                                        </div>
                                        <span>{service.contact.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
