'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAuthService } from '@/services/user/userAuthApiService';
import { registerSchema, RegisterFormData } from '@/validations/userAuth.validation';
import { useUsernameValidation, useEmailValidation } from '@/hooks/useValidation';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Lock,
    User,
    Loader2,
    ArrowRight,
    Eye,
    EyeOff,
    Check,
    X,
    AlertCircle,
    Sparkles
} from 'lucide-react';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange'
    });

    const watchedUsername = watch('username', '');
    const watchedEmail = watch('email', '');
    const watchedPassword = watch('password', '');
    const watchedConfirmPassword = watch('confirmPassword', '');

    const usernameValidation = useUsernameValidation(watchedUsername);
    const emailValidation = useEmailValidation(watchedEmail);

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

    const generateUsername = async () => {
        try {
            const response = await userAuthService.generateUsername(watchedEmail);
            setValue('username', response.username);
            toast.success('Username generated from your email!');
        } catch (error) {
            toast.error('Failed to generate username');
        }
    };

    const onSubmit = async (data: RegisterFormData) => {
        if (!acceptTerms) {
            toast.error('Please accept the terms and conditions');
            return;
        }

        if (!usernameValidation.isValid) {
            toast.error('Please choose an available username');
            return;
        }

        if (!emailValidation.isValid) {
            toast.error('Please use an available email address');
            return;
        }

        setLoading(true);
        try {
            await userAuthService.register({
                username: data.username,
                email: data.email,
                password: data.password,
                name: data.username
            });

            toast.success('Registration initiated! Please check your email for OTP.');
            router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&username=${encodeURIComponent(data.username)}&password=${encodeURIComponent(data.password)}`);
        } catch (err: any) {
            const message = err.response?.data?.error || 'Registration failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const ValidationIcon = ({ isValid, isChecking }: { isValid: boolean; isChecking: boolean }) => {
        if (isChecking) return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
        if (isValid) return <Check className="w-4 h-4 text-green-500" />;
        return <X className="w-4 h-4 text-red-500" />;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-125 h-125 bg-purple-900/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-125 h-125 bg-blue-900/30 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10 p-8"
            >
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 bg-linear-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30"
                        >
                            <Sparkles className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400 mb-2">Join Sking</h1>
                        <p className="text-gray-400 text-sm">Create your beauty journey account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1 flex items-center justify-between">
                                Username
                                {watchedEmail && (
                                    <button
                                        type="button"
                                        onClick={generateUsername}
                                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        Generate from email
                                    </button>
                                )}
                            </label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    {...register('username')}
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                    placeholder="johndoe"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <ValidationIcon
                                        isValid={usernameValidation.isValid}
                                        isChecking={usernameValidation.isChecking}
                                    />
                                </div>
                            </div>
                            <AnimatePresence>
                                {watchedUsername && watchedUsername.length >= 3 && (
                                    <motion.p
                                        key="username-validation"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`text-xs ml-1 ${usernameValidation.isValid ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        {usernameValidation.message}
                                    </motion.p>
                                )}
                                {errors.username && (
                                    <motion.p
                                        key="username-error"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-red-500 text-xs ml-1 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.username.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                    placeholder="name@example.com"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <ValidationIcon
                                        isValid={emailValidation.isValid}
                                        isChecking={emailValidation.isChecking}
                                    />
                                </div>
                            </div>
                            <AnimatePresence>
                                {watchedEmail && watchedEmail.includes('@') && (
                                    <motion.p
                                        key="email-validation"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`text-xs ml-1 ${emailValidation.isValid ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        {emailValidation.message}
                                    </motion.p>
                                )}
                                {errors.email && (
                                    <motion.p
                                        key="email-error"
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

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
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
                            <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    {...register('confirmPassword')}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
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

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-black/20 border border-white/10">
                            <input
                                {...register('acceptTerms')}
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-2 mt-0.5"
                            />
                            <div className="text-sm">
                                <p className="text-gray-300">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>
                        </div>
                        {errors.acceptTerms && (
                            <p className="text-red-500 text-xs ml-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.acceptTerms.message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !acceptTerms}
                            className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}