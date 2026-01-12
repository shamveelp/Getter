import React, { useState, useCallback } from "react";
// import Cropper from "react-easy-crop"; // Remove
import { useDropzone } from "react-dropzone";
// import getCroppedImg from "../../../utils/cropImage"; // Remove
import { uploadService } from "../../../services/admin/uploadApiService";
import Button from "../ui/button/Button";
// import { Modal } from "../ui/modal"; // Remove
import { X, Upload, Image as ImageIcon } from "lucide-react";
import ImageCropper from "@/components/ui/ImageCropper";

interface ImageUploadProps {
    onChange: (urls: string[]) => void;
    value?: string[]; // Array of image URLs
    multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value = [], multiple = true }) => {
    const [images, setImages] = useState<string[]>(value);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Removed duplicate state managed by ImageCropper

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

    const handleUpload = async (blob: Blob) => {
        try {
            // File from Blob
            const file = new File([blob], "upload.jpg", { type: "image/jpeg" });
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

            <ImageCropper
                isOpen={isModalOpen}
                imageSrc={imageSrc}
                onClose={() => setIsModalOpen(false)}
                onCropComplete={handleUpload}
                aspectRatio={4 / 3}
                cropShape="rect"
            />
        </div>
    );
};

export default ImageUpload;
