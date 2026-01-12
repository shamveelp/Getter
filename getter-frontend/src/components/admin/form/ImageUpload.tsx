import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import getCroppedImg from "../../../utils/cropImage";
import { uploadService } from "../../../services/admin/uploadApiService";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal"; // Named import based on error
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
    onChange: (urls: string[]) => void;
    value?: string[]; // Array of image URLs
    multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value = [], multiple = true }) => {
    const [images, setImages] = useState<string[]>(value);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setIsModalOpen(true);
            };
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setUploading(true);
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (!croppedImageBlob) throw new Error("Cropping failed");

            // File from Blob
            const file = new File([croppedImageBlob], "upload.jpg", { type: "image/jpeg" });
            const response = await uploadService.uploadImage(file);

            if (response.success) {
                const newImages = [...images, response.url];
                setImages(newImages);
                onChange(newImages);
                setIsModalOpen(false);
                setImageSrc(null);
            } else {
                alert("Upload failed: " + response.error);
            }
        } catch (e: any) {
            console.error(e);
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {images.map((url, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>

            {(multiple || images.length === 0) && (
                <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 transition-colors"
                >
                    <input {...getInputProps()} />
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <p className="text-sm text-gray-500">Click or drag image to upload</p>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg p-4 w-full max-w-lg h-[500px] flex flex-col">
                        <div className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden mb-4">
                            <Cropper
                                image={imageSrc!}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 3} // Adjust as needed
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="button" onClick={handleUpload} disabled={uploading}>
                                {uploading ? "Uploading..." : "Crop & Upload"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
