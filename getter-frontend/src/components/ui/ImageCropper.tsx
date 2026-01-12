'use client';

import { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Check, Loader2 } from 'lucide-react';
import getCroppedImg from '@/utils/cropImage';

interface ImageCropperProps {
    isOpen: boolean;
    imageSrc: string | null;
    onClose: () => void;
    onCropComplete: (croppedBlob: Blob) => Promise<void> | void;
    aspectRatio?: number;
    cropShape?: 'round' | 'rect';
}

export default function ImageCropper({
    isOpen,
    imageSrc,
    onClose,
    onCropComplete,
    aspectRatio = 1,
    cropShape = 'round',
}: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setIsProcessing(true);
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImageBlob) {
                await onCropComplete(croppedImageBlob);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && imageSrc && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center shrink-0">
                            <h3 className="font-semibold text-lg text-white">Adjust Image</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="relative flex-1 min-h-[300px] bg-black">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio}
                                onCropChange={setCrop}
                                onCropComplete={handleCropComplete}
                                onZoomChange={setZoom}
                                cropShape={cropShape}
                                showGrid={false}
                            />
                        </div>

                        <div className="p-6 space-y-6 shrink-0">
                            <div className="flex items-center gap-4">
                                <ZoomOut className="w-4 h-4 text-gray-400" />
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full accent-purple-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <ZoomIn className="w-4 h-4 text-gray-400" />
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isProcessing}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-medium text-white transition-colors flex items-center gap-2"
                                >
                                    {isProcessing ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
