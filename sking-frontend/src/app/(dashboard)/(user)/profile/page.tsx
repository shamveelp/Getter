'use client';

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/redux/features/authSlice';
import { userProfileService } from '@/services/user/userProfileApiService';
import { toast } from 'sonner';
import { Loader2, Camera, User, Mail, Phone, FileText, Save, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProfileFormData {
    name: string;
    bio: string;
    phoneNumber: string;
}

export default function ProfilePage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, setValue } = useForm<ProfileFormData>();

    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            // @ts-ignore
            setValue('bio', user.bio || '');
            // @ts-ignore
            setValue('phoneNumber', user.phoneNumber || '');
        }
    }, [user, setValue]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const response = await userProfileService.uploadProfilePicture(file);
            if (response.success && user) {
                const updatedUser = { ...user, profilePicture: response.imageUrl };
                dispatch(updateUser(updatedUser)); // We might need to fetch fresh profile to be safe
                toast.success('Profile picture updated successfully');
            }
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsSaving(true);
        try {
            const response = await userProfileService.updateProfile(data);
            if (response.success) {
                dispatch(updateUser(response.user));
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    // @ts-ignore
    const profilePic = user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-1"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                            <div className="relative inline-block mb-4 group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/20 relative">
                                    <img
                                        src={profilePic}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-white" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-500 text-white p-2.5 rounded-full shadow-lg transition-all transform group-hover:scale-110"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                            <p className="text-sm text-gray-400 mb-4">@{user.username}</p>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                                Active Account
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Edit Intent Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-purple-500" />
                                Profile Settings
                            </h3>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                {...register('name')}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                {...register('phoneNumber')}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                                placeholder="+1 (234) 567-8900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Email Address</label>
                                    <div className="relative opacity-50 cursor-not-allowed">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            value={user.email}
                                            disabled
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Email address cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Bio</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                        <textarea
                                            {...register('bio')}
                                            rows={4}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                                            placeholder="Tell us a little about yourself..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
