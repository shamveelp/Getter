"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/admin/ui/button/Button";
import Input from "@/components/admin/form/input/InputField";
import Label from "@/components/admin/form/Label";
import Select from "@/components/admin/form/Select";
import ImageUpload from "@/components/admin/form/ImageUpload";
import Checkbox from "@/components/admin/form/input/Checkbox";
import { adminServiceService } from "@/services/admin/adminServiceApiService";
import { TimePicker } from "@/components/ui/time-picker";

export default function EditServicePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        pricePerDay: "",
        description: "",
        location: "",
        contactEmail: "",
        contactPhone: "",
        totalUnits: "1",
        images: [] as string[]
    });

    const [availability, setAvailability] = useState({
        days: [] as string[],
        startTime: "",
        endTime: "",
        is24Hours: false
    });

    const categoryOptions = [
        { value: "venue", label: "Venue" },
        { value: "caterer", label: "Caterer" },
        { value: "dj", label: "DJ" },
        { value: "photographer", label: "Photographer" },
        { value: "decoration", label: "Decoration" },
        { value: "other", label: "Other" },
    ];

    const weekDays = [
        { label: 'Mon', value: 'monday' },
        { label: 'Tue', value: 'tuesday' },
        { label: 'Wed', value: 'wednesday' },
        { label: 'Thu', value: 'thursday' },
        { label: 'Fri', value: 'friday' },
        { label: 'Sat', value: 'saturday' },
        { label: 'Sun', value: 'sunday' },
    ];

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await adminServiceService.getServiceById(id);
                if (response.success && response.data) {
                    const s = response.data;
                    setFormData({
                        title: s.title,
                        category: s.category,
                        pricePerDay: s.pricePerDay,
                        description: s.description,
                        location: s.location,
                        contactEmail: s.contact?.email || "",
                        contactPhone: s.contact?.phone || "",
                        totalUnits: s.totalUnits?.toString() || "1",
                        images: s.images || []
                    });

                    if (s.availability?.type === 'recurring' && s.availability.recurring) {
                        setAvailability({
                            days: s.availability.recurring.days || [],
                            startTime: s.availability.recurring.startTime || "",
                            endTime: s.availability.recurring.endTime || "",
                            is24Hours: s.availability.recurring.is24Hours || false
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to load service", error);
                alert("Could not load service details");
                router.push("/admin/services");
            } finally {
                setFetching(false);
            }
        };

        if (id) fetchService();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                title: formData.title,
                category: formData.category,
                pricePerDay: Number(formData.pricePerDay),
                description: formData.description,
                location: formData.location,
                totalUnits: Number(formData.totalUnits),
                availability: {
                    type: 'recurring',
                    recurring: {
                        days: availability.days,
                        startTime: availability.is24Hours ? "00:00" : availability.startTime,
                        endTime: availability.is24Hours ? "23:59" : availability.endTime,
                        is24Hours: availability.is24Hours
                    }
                },
                images: formData.images
            };

            const response = await adminServiceService.updateService(id, payload);
            if (response.success) {
                router.push(`/admin/services/${id}`); // Go back to detail page
            } else {
                alert("Failed: " + response.error);
            }
        } catch (error: any) {
            console.error("Error updating service:", error);
            alert("Error: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImagesChange = (urls: string[]) => {
        setFormData({ ...formData, images: urls });
    };

    const toggleDay = (day: string) => {
        if (availability.days.includes(day)) {
            setAvailability({ ...availability, days: availability.days.filter(d => d !== day) });
        } else {
            setAvailability({ ...availability, days: [...availability.days, day] });
        }
    };

    if (fetching) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Service</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="title">Service Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                placeholder="e.g., Grand Wedding Hall"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                                options={categoryOptions}
                                value={formData.category}
                                onChange={(val) => setFormData({ ...formData, category: val })}
                                placeholder="Select Category"
                            />
                        </div>
                        <div>
                            <Label htmlFor="pricePerDay">Price Per Day (₹)</Label>
                            <Input
                                type="number"
                                id="pricePerDay"
                                name="pricePerDay"
                                value={formData.pricePerDay}
                                placeholder="0.00"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                placeholder="City, Address"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="totalUnits">Total Available Units (Slots)</Label>
                            <Input
                                type="number"
                                id="totalUnits"
                                name="totalUnits"
                                value={formData.totalUnits}
                                placeholder="1"
                                min="1"
                                onChange={handleChange}
                                hint="Number of simultaneous bookings allowed (e.g., 1 for a hall, 5 for staff)"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-gray-200"
                            placeholder="Describe the service..."
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input
                                type="email"
                                id="contactEmail"
                                name="contactEmail"
                                value={formData.contactEmail}
                                placeholder="email@example.com"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <Input
                                id="contactPhone"
                                name="contactPhone"
                                value={formData.contactPhone}
                                placeholder="+1 234 567 890"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Availability Schedule</Label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {weekDays.map((day) => (
                                <button
                                    key={day.value}
                                    type="button"
                                    onClick={() => toggleDay(day.value)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${availability.days.includes(day.value)
                                        ? 'bg-brand-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-6 mb-4">
                            <Checkbox
                                label="Open 24 Hours / Always Available"
                                checked={availability.is24Hours}
                                onChange={(val) => setAvailability({ ...availability, is24Hours: val })}
                            />
                        </div>

                        {!availability.is24Hours && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="startTime">Start Time</Label>
                                    <TimePicker
                                        value={availability.startTime}
                                        onChange={(val) => setAvailability({ ...availability, startTime: val })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="endTime">End Time</Label>
                                    <TimePicker
                                        value={availability.endTime}
                                        onChange={(val) => setAvailability({ ...availability, endTime: val })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="images">Service Images</Label>
                        <ImageUpload
                            onChange={handleImagesChange}
                            value={formData.images as any}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Service"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
