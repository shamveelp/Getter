"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../../../../components/admin/ui/button/Button";
import Input from "../../../../../../components/admin/form/input/InputField";
import Label from "../../../../../../components/admin/form/Label";
import Select from "../../../../../../components/admin/form/Select";
import ImageUpload from "../../../../../../components/admin/form/ImageUpload";
import { adminServiceService } from "../../../../../../services/admin/adminServiceApiService";
import { DatePicker } from "@/components/ui/date-picker";

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
        images: [] as string[] // Changed to array
    });

    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const categoryOptions = [
        { value: "venue", label: "Venue" },
        { value: "caterer", label: "Caterer" },
        { value: "dj", label: "DJ" },
        { value: "photographer", label: "Photographer" },
        { value: "decoration", label: "Decoration" },
        { value: "other", label: "Other" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formatDate = (date: Date | undefined) => {
                return date ? date.toISOString().split('T')[0] : "";
            };

            const payload = {
                title: formData.title,
                category: formData.category,
                pricePerDay: Number(formData.pricePerDay),
                description: formData.description,
                location: formData.location,
                contact: {
                    email: formData.contactEmail,
                    phone: formData.contactPhone
                },
                availability: [
                    {
                        startDate: formatDate(startDate),
                        endDate: formatDate(endDate)
                    }
                ],
                images: formData.images
            };

            const response = await adminServiceService.createService(payload);
            if (response.success) {
                router.push("/admin/services");
            } else {
                alert("Failed: " + response.error);
            }
        } catch (error: any) {
            console.error("Error creating service:", error);
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="startDate">Availability Start</Label>
                            <div className="mt-1">
                                <DatePicker
                                    date={startDate}
                                    setDate={setStartDate}
                                    placeholder="Select start date"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="endDate">Availability End</Label>
                            <div className="mt-1">
                                <DatePicker
                                    date={endDate}
                                    setDate={setEndDate}
                                    placeholder="Select end date"
                                />
                            </div>
                        </div>
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
