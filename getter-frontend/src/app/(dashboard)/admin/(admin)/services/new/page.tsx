"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../../../../components/admin/ui/button/Button";
import Input from "../../../../../../components/admin/form/input/InputField";
import Label from "../../../../../../components/admin/form/Label";
import Select from "../../../../../../components/admin/form/Select";
import ImageUpload from "../../../../../../components/admin/form/ImageUpload";
import Checkbox from "../../../../../../components/admin/form/input/Checkbox";
import { adminServiceService } from "../../../../../../services/admin/adminServiceApiService";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { toast } from "sonner";

export default function AddServicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        pricePerDay: "",
        description: "",
        location: "",
        contactEmail: "",
        contactPhone: "",
        totalUnits: "1",
        images: [] as string[] // Changed to array
    });

    const [availability, setAvailability] = useState({
        days: [] as string[],
        startTime: "09:00",
        endTime: "18:00",
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic frontend validation
        if (!formData.title || !formData.category || !formData.pricePerDay || !formData.location || !formData.description) {
            toast.error("Required Fields Missing", { description: "Please fill in all the main service details." });
            return;
        }

        if (availability.days.length === 0) {
            toast.error("Availability Missing", { description: "Please select at least one day for service availability." });
            return;
        }

        if (!formData.contactEmail || !formData.contactPhone) {
            toast.error("Contact Info Missing", { description: "Please provide both contact email and phone." });
            return;
        }

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
                contact: {
                    email: formData.contactEmail,
                    phone: formData.contactPhone
                },
                images: formData.images
            };

            const response = await adminServiceService.createService(payload);
            if (response.success) {
                toast.success("Service Created!", { description: "The new service has been added successfully." });
                router.push("/admin/services");
            } else {
                toast.error("Creation Failed", { description: response.error });
            }
        } catch (error: any) {
            console.error("Error creating service:", error);
            const errorMsg = error.response?.data?.error || error.message || "Something went wrong.";
            toast.error("Error", { description: errorMsg });
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

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Service</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="title">Service Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g., Grand Wedding Hall"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                                options={categoryOptions}
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
                                placeholder="0.00"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
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
                                placeholder="email@example.com"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <Input
                                id="contactPhone"
                                name="contactPhone"
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
                            {loading ? "Creating..." : "Create Service"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
