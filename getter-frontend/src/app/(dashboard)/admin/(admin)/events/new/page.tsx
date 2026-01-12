"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../../../../components/admin/ui/button/Button";
import Input from "../../../../../../components/admin/form/input/InputField";
import Label from "../../../../../../components/admin/form/Label";
import ImageUpload from "../../../../../../components/admin/form/ImageUpload";
import { adminEventService } from "../../../../../../services/admin/adminEventApiService";

export default function AddEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        price: "",
        images: [] as string[]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Combine date and time
            const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00`);
            const endDateTime = new Date(`${formData.endDate}T${formData.endTime}:00`);

            const payload = {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                startDate: startDateTime,
                endDate: endDateTime,
                price: Number(formData.price),
                images: formData.images
            };

            const response = await adminEventService.createEvent(payload);
            if (response.success) {
                router.push("/admin/events");
            } else {
                alert("Failed: " + response.error);
            }
        } catch (error: any) {
            console.error("Error creating event:", error);
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

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Event</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g., Summer Music Festival"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-gray-200"
                            placeholder="Describe the event..."
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="Event Venue"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="price">Ticket Price ($)</Label>
                            <Input
                                type="number"
                                id="price"
                                name="price"
                                placeholder="0.00"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                type="date"
                                id="startDate"
                                name="startDate"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                                type="time"
                                id="startTime"
                                name="startTime"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                type="date"
                                id="endDate"
                                name="endDate"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="endTime">End Time</Label>
                            <Input
                                type="time"
                                id="endTime"
                                name="endTime"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="images">Event Images</Label>
                        <ImageUpload
                            onChange={handleImagesChange}
                            value={formData.images as any}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Event"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
