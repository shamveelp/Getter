'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAuthService } from '@/services/user/userAuthApiService';
import { resetPasswordSchema, ResetPasswordFormData } from '@/validations/userAuth.validation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Loader2, Eye, EyeOff, AlertCircle, Check, X, CheckCircle } from 'lucide-react';

function ResetPasswordPageContent() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get('email');
    const verified = searchParams.get('verified');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange'
    });

    const watchedPassword = watch('password', '');
    const watchedConfirmPassword = watch('confirmPassword', '');

    // Password strength validation
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        let checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };

        strength = Object.values(checks).filter(Boolean).length;

        return { strength, checks };
    };

    const passwordStrength = getPasswordStrength(watchedPassword || '');

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!email || !verified) {
            toast.error('Invalid reset session. Please try again.');
            router.push('/forgot-password');
            return;
        }

        setLoading(true);
        try {
            await userAuthService.resetPassword({
                email,
                newPassword: data.password
            });

            toast.success('Password reset successfully! Please login with your new password.');
            router.push('/login?reset=success');
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Reset failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!email || !verified) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Invalid Reset Session</h1>
                    <p className="text-gray-400 mb-6">Please start the password reset process again.</p>
                    <button
                        onClick={() => router.push('/forgot-password')}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-green-500/20 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-md relative z-10 p-8"
            >
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 bg-linear-to-tr from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
                        >
                            <CheckCircle className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                        <p className="text-gray-400 text-sm">Create a new strong password for your account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            <AnimatePresence>
                                {watchedPassword && (
                                    <motion.div
                                        key="password-strength"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength.strength >= level
                                                        ? passwordStrength.strength <= 2
                                                            ? 'bg-red-500'
                                                            : passwordStrength.strength <= 3
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                        : 'bg-gray-600'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-400 space-y-1">
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(passwordStrength.checks).map(([key, valid]) => (
                                                    <span
                                                        key={key}
                                                        className={`flex items-center gap-1 ${valid ? 'text-green-500' : 'text-gray-500'}`}
                                                    >
                                                        {valid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                        {key === 'length' && '8+ chars'}
                                                        {key === 'uppercase' && 'A-Z'}
                                                        {key === 'lowercase' && 'a-z'}
                                                        {key === 'numbers' && '0-9'}
                                                        {key === 'special' && '!@#$'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {errors.password && (
                                    <motion.p
                                        key="password-error"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-red-500 text-xs ml-1 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.password.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Confirm New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                                <input
                                    {...register('confirmPassword')}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <AnimatePresence>
                                {watchedConfirmPassword && watchedPassword && (
                                    <motion.div
                                        key="confirm-password-match"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-1 text-xs ml-1"
                                    >
                                        {watchedPassword === watchedConfirmPassword ? (
                                            <>
                                                <Check className="w-3 h-3 text-green-500" />
                                                <span className="text-green-500">Passwords match</span>
                                            </>
                                        ) : (
                                            <>
                                                <X className="w-3 h-3 text-red-500" />
                                                <span className="text-red-500">Passwords don't match</span>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                                {errors.confirmPassword && (
                                    <motion.p
                                        key="confirm-password-error"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-red-500 text-xs ml-1 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.confirmPassword.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || passwordStrength.strength < 4}
                            className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            </div>
        }>
            <ResetPasswordPageContent />
        </Suspense>
    );
}
