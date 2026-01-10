'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginStart, loginSuccess, loginFailure } from '@/redux/features/authSlice';
import { toast } from 'sonner';
import { userAuthService } from '@/services/user/userAuthApiService';
import { loginSchema, LoginFormData } from '@/validations/userAuth.validation';
import type { RootState } from '@/redux/store';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useGoogleLogin } from '@/hooks/useGoogleLogin';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const { initiateGoogleLogin } = useGoogleLogin();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormData) => {
        dispatch(loginStart());
        try {
            const response = await userAuthService.login(data);
            if (response.success) {
                dispatch(loginSuccess({ user: response.user }));
                toast.success('Login successful! Welcome back.');
                router.push('/');
            } else {
                const message = response.error || 'Login failed';
                dispatch(loginFailure(message));
                toast.error(message);
            }
        } catch (err: any) {
            const message = err.response?.data?.error || 'Something went wrong';
            dispatch(loginFailure(message));
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-purple-900/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-blue-900/30 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10 p-8"
            >
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400 mb-2">Welcome Back</h1>
                        <p className="text-gray-400 text-sm">Sign in to continue to Sking Cosmetics</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
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

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
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
                            <AnimatePresence>
                                {errors.password && (
                                    <motion.p
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#121212] px-2 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={initiateGoogleLogin}
                            className="w-full bg-white text-black font-semibold py-3.5 rounded-xl transition-all hover:bg-gray-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21h-.19z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Google
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Create account
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}