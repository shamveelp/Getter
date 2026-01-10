'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAuthService } from '@/services/user/userAuthApiService';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/validations/userAuth.validation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [email, setEmailState] = useState('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const watchedEmail = watch('email', '');

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setLoading(true);
        try {
            await userAuthService.forgotPassword(data.email);
            setSuccess(true);
            setEmailState(data.email);
            toast.success('Password reset OTP sent to your email.');
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Request failed';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const continueToVerification = () => {
        router.push(`/verify-forgot-otp?email=${encodeURIComponent(email)}`);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden">
                <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.15),transparent_50%)]" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md relative z-10 p-8"
                >
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="w-16 h-16 bg-linear-to-tr from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
                        >
                            <CheckCircle className="w-8 h-8 text-white" />
                        </motion.div>

                        <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
                        <p className="text-gray-400 text-sm mb-6">
                            We've sent a password reset code to<br />
                            <span className="text-green-300 font-medium">{email}</span>
                        </p>

                        <button
                            onClick={continueToVerification}
                            className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 mb-4"
                        >
                            Continue to Verification
                        </button>

                        <Link
                            href="/login"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Back to Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden">
            <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_50%)]" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10 p-8"
            >
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <Link href="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                    </Link>

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-cyan-300 mb-2">Forgot Password?</h1>
                        <p className="text-gray-400 text-sm">Enter your email address and we'll send you a verification code to reset your password.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-red-500 text-xs ml-1 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.email.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !watchedEmail}
                            className="w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Code'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}