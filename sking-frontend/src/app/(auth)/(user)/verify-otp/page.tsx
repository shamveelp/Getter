'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { userAuthService } from '@/services/user/userAuthApiService';
import { loginSuccess } from '@/redux/features/authSlice';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Loader2, RefreshCw } from 'lucide-react';

export default function VerifyOtpPage() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const email = searchParams.get('email');
    const username = searchParams.get('username');
    const password = searchParams.get('password');

    useEffect(() => {
        if (!email || !username || !password) {
            toast.error('Missing registration data. Please try again.');
            router.push('/register');
        }
    }, [email, username, password, router]);

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
            const response = await userAuthService.verifyOtp({
                email: email!,
                username: username!,
                password: password!,
                otp: finalOtp,
                name: username
            });

            if (response.success) {
                dispatch(loginSuccess({ user: response.user, accessToken: response.accessToken }));
                toast.success('Email verified successfully! Welcome to Sking Cosmetics!');
                router.push('/');
            }
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
            await userAuthService.resendOtp(email!);
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]" />

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
                            className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30"
                        >
                            <KeyRound className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
                        <p className="text-gray-400 text-sm">
                            We've sent a 6-digit code to<br />
                            <span className="text-purple-300 font-medium">{email}</span>
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
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 bg-black/20 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
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
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
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

                        <div className="text-center text-xs text-gray-500">
                            <p>Didn't receive the code? Check your spam folder</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}