import React, { useState, useEffect } from 'react';
import { useSendVerificationEmailMutation, useVerifyEmailMutation } from '../redux/features/users/usersApiSlice';

const EmailVerification = ({ user }) => {
    const [code, setCode] = useState('');
    const [step, setStep] = useState('idle'); // idle | sent | verifying | success
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);

    const [sendVerification, { isLoading: isSending }] = useSendVerificationEmailMutation();
    const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSendCode = async () => {
        setError('');
        setStep('sent');
        try {
            await sendVerification().unwrap();
            setCountdown(120); // 2 minutes cooldown
        } catch (err) {
            setError(err?.data?.message || 'Failed to send code');
            setStep('idle');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (code.length !== 6) {
            setError('Please enter 6-digit code');
            return;
        }

        setStep('verifying');
        setError('');
        try {
            await verifyEmail(code).unwrap();
            setStep('success');
        } catch (err) {
            setError(err?.data?.message || 'Verification failed');
            setStep('sent');
        }
    };

    const handleResend = () => {
        if (countdown > 0) return;
        handleSendCode();
    };

    // Already verified
    if (user?.isEmailVerified) {
        return (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl px-4 py-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Email Verified</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Step 1: Send Code */}
            {step === 'idle' && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <p className="text-amber-800 dark:text-amber-200 font-medium">Email Not Verified</p>
                            <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">Verify your email to unlock all features</p>
                            <button
                                onClick={handleSendCode}
                                disabled={isSending}
                                className="mt-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                            >
                                {isSending ? 'Sending...' : 'Send Verification Code'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Enter Code */}
            {(step === 'sent' || step === 'verifying') && (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Code sent to <strong className="text-gray-900 dark:text-white">{user?.email}</strong>
                    </p>

                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Enter 6-digit code
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                                className="w-full text-center text-2xl tracking-[0.5em] border rounded-xl py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                disabled={isVerifying}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={isVerifying || code.length !== 6}
                                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2.5 rounded-xl font-medium transition"
                            >
                                {isVerifying ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={countdown > 0}
                                className="text-red-500 hover:text-red-600 disabled:text-gray-400 font-medium transition"
                            >
                                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setStep('idle'); setCode(''); setError(''); }}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl px-4 py-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Email Verified Successfully!</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default EmailVerification;