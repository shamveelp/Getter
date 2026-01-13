"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../../../../components/admin/ui/button/Button";
import Input from "../../../../../../components/admin/form/input/InputField";
import Label from "../../../../../../components/admin/form/Label";
import Select from "../../../../../../components/admin/form/Select";
import ImageUpload from "../../../../../../components/admin/form/ImageUpload";
import { adminServiceService } from "../../../../../../services/admin/adminServiceApiService";
import { DatePicker } from "@/components/ui/date-picker";

// Define params type as a Promise
export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use()
    const { id } = React.use(params);

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
        images: [] as string[]
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

    useEffect(() => {
        if (!id) return;
        const fetchService = async () => {
            try {
                const response = await adminServiceService.getServiceById(id);
                if (response.success) {
                    const service = response.data;
                    const availability = service.availability && service.availability.length > 0 ? service.availability[0] : {};

                    setFormData({
                        title: service.title,
                        category: service.category,
                        pricePerDay: service.pricePerDay.toString(),
                        description: service.description,
                        location: service.location,
                        contactEmail: service.contact?.email || "",
                        contactPhone: service.contact?.phone || "",
                        images: service.images || []
                    });

                    if (availability.startDate) setStartDate(new Date(availability.startDate));
                    if (availability.endDate) setEndDate(new Date(availability.endDate));
                }
            } catch (error) {
                console.error("Error fetching service:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchService();
    }, [id]);

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

            const response = await adminServiceService.updateService(id, payload);
            if (response.success) {
                router.push("/admin/services");
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

    if (fetching) return <div className="p-6 text-center">Loading service details...</div>;

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
                                placeholder="e.g., Grand Wedding Hall"
                                value={formData.title}
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
                                placeholder="0.00"
                                value={formData.pricePerDay}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="City, Address"
                                value={formData.location}
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
                            value={formData.description}
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
                                value={formData.contactEmail}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <Input
                                id="contactPhone"
                                name="contactPhone"
                                placeholder="+1 234 567 890"
                                value={formData.contactPhone}
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
                            {loading ? "Updating..." : "Update Service"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
