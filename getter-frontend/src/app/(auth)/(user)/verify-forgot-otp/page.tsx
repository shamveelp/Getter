'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { userAuthService } from '@/services/user/userAuthApiService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Loader2, RefreshCw, Shield } from 'lucide-react';

// Main component with logic
function VerifyForgotOtpContent() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const email = searchParams.get('email');

    useEffect(() => {
        if (!email) {
            toast.error('Email is missing. Please try again.');
            router.push('/forgot-password');
        }
    }, [email, router]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError(null);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all fields are filled
        if (newOtp.every(digit => digit !== '') && value) {
            handleSubmit(newOtp.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        const digits = paste.replace(/\D/g, '').slice(0, 6).split('');

        if (digits.length === 6) {
            setOtp(digits);
            handleSubmit(digits.join(''));
        }
    };

    const handleSubmit = async (otpCode?: string) => {
        const finalOtp = otpCode || otp.join('');

        if (finalOtp.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await userAuthService.verifyForgotPasswordOtp({
                email: email!,
                otp: finalOtp
            });

            toast.success('OTP verified successfully!');
            router.push(`/reset-password?email=${encodeURIComponent(email!)}&verified=true`);
        } catch (err: any) {
            const message = err.response?.data?.error || 'Verification failed';
            setError(message);
            toast.error(message);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        setResendLoading(true);
        try {
            await userAuthService.forgotPassword(email!);
            toast.success('New OTP sent to your email');
            setResendTimer(60);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-orange-500/20 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10 p-8"
            >
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-16 h-16 bg-linear-to-tr from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30"
                        >
                            <Shield className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white mb-2">Verify Reset Code</h1>
                        <p className="text-gray-400 text-sm">
                            We've sent a 6-digit code to<br />
                            <span className="text-orange-300 font-medium">{email}</span>
                        </p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-6">
                        {/* OTP Input Grid */}
                        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <motion.input
                                    key={index}
                                    ref={(el: any) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 bg-black/20 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                />
                            ))}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            onClick={() => handleSubmit()}
                            disabled={loading || otp.some(digit => digit === '')}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                        </motion.button>

                        {/* Resend OTP */}
                        <div className="text-center">
                            <button
                                onClick={handleResendOtp}
                                disabled={resendLoading || resendTimer > 0}
                                className="text-sm text-gray-400 hover:text-white transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                            >
                                {resendLoading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : resendTimer > 0 ? (
                                    `Resend in ${resendTimer}s`
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4" />
                                        Resend Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Export wrapped with Suspense
export default function VerifyForgotOtpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">Loading...</div>}>
            <VerifyForgotOtpContent />
        </Suspense>
    );
}