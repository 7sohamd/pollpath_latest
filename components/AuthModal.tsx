import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, AlertCircle, Phone } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode: initialMode = 'login' }) => {
    const [mode, setMode] = useState<'login' | 'signup' | 'phone'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const recaptchaRef = useRef<HTMLDivElement>(null);
    const confirmationResultRef = useRef<any>(null);

    const { signIn, signUp, signInWithGoogle, signInWithGitHub, signInWithPhone } = useAuth();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (initialMode === 'signup') {
                await signUp(email, password);
            } else {
                await signIn(email, password);
            }
            onClose();
            setEmail('');
            setPassword('');
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithGoogle();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGitHubSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithGitHub();
            onClose();
        } catch (err: any) {
            setError(err.message || 'GitHub sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Initialize reCAPTCHA
            if (!recaptchaRef.current) return;

            const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
                size: 'invisible',
            });

            const confirmationResult = await signInWithPhone(phoneNumber, recaptchaVerifier);
            confirmationResultRef.current = confirmationResult;
            setShowVerification(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await confirmationResultRef.current.confirm(verificationCode);
            onClose();
            setPhoneNumber('');
            setVerificationCode('');
            setShowVerification(false);
        } catch (err: any) {
            setError('Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setError('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>

                            {/* Header */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-serif font-semibold text-brand-900 mb-2">
                                    {mode === 'phone' ? 'Sign in with Phone' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    {mode === 'phone'
                                        ? 'Enter your phone number to receive a verification code'
                                        : mode === 'login'
                                            ? 'Sign in to continue creating and voting on polls'
                                            : 'Join PollPath to create and vote on polls'}
                                </p>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                    <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            {mode !== 'phone' ? (
                                <>
                                    {/* Social Sign-In Buttons */}
                                    <div className="space-y-3 mb-6">
                                        <button
                                            onClick={handleGoogleSignIn}
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-700">Continue with Google</span>
                                        </button>

                                        <button
                                            onClick={handleGitHubSignIn}
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-700">Continue with GitHub</span>
                                        </button>

                                        <button
                                            onClick={() => setMode('phone')}
                                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            <Phone size={20} className="text-gray-700" />
                                            <span className="text-sm font-medium text-gray-700">Continue with Phone</span>
                                        </button>
                                    </div>

                                    {/* Divider */}
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                                        </div>
                                    </div>

                                    {/* Email/Password Form */}
                                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    minLength={6}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            {mode === 'signup' && (
                                                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full py-3 mt-6"
                                            disabled={loading}
                                        >
                                            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                                        </Button>
                                    </form>

                                    {/* Toggle mode */}
                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-gray-600">
                                            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                                            {' '}
                                            <button
                                                onClick={toggleMode}
                                                className="text-brand-900 font-medium hover:underline"
                                            >
                                                {mode === 'login' ? 'Sign Up' : 'Sign In'}
                                            </button>
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Phone Sign-In Form */}
                                    {!showVerification ? (
                                        <form onSubmit={handlePhoneSignIn} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <div className="relative">
                                                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="tel"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        required
                                                        placeholder="+1234567890"
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1)</p>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full py-3"
                                                disabled={loading}
                                            >
                                                {loading ? 'Sending code...' : 'Send Verification Code'}
                                            </Button>

                                            <button
                                                type="button"
                                                onClick={() => setMode('login')}
                                                className="w-full text-sm text-gray-600 hover:text-brand-900 mt-4"
                                            >
                                                Back to other sign-in options
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleVerifyCode} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Verification Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={verificationCode}
                                                    onChange={(e) => setVerificationCode(e.target.value)}
                                                    required
                                                    placeholder="123456"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-900 focus:border-transparent text-center text-2xl tracking-widest"
                                                    maxLength={6}
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full py-3"
                                                disabled={loading}
                                            >
                                                {loading ? 'Verifying...' : 'Verify Code'}
                                            </Button>
                                        </form>
                                    )}

                                    {/* reCAPTCHA container */}
                                    <div ref={recaptchaRef}></div>
                                </>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
