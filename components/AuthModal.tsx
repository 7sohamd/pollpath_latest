import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../lib/firebase';
import SocialSignInButtons from './AuthModal/SocialSignInButtons';
import EmailPasswordForm from './AuthModal/EmailPasswordForm';
import PhoneSignInForm from './AuthModal/PhoneSignInForm';
import PhoneVerificationForm from './AuthModal/PhoneVerificationForm';

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
                                    <div className="mb-6">
                                        <SocialSignInButtons
                                            onGoogleSignIn={handleGoogleSignIn}
                                            onGitHubSignIn={handleGitHubSignIn}
                                            onPhoneClick={() => setMode('phone')}
                                            loading={loading}
                                        />
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
                                    <EmailPasswordForm
                                        mode={mode}
                                        email={email}
                                        password={password}
                                        onEmailChange={setEmail}
                                        onPasswordChange={setPassword}
                                        onSubmit={handleEmailSubmit}
                                        loading={loading}
                                    />

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
                                        <PhoneSignInForm
                                            phoneNumber={phoneNumber}
                                            onPhoneChange={setPhoneNumber}
                                            onSubmit={handlePhoneSignIn}
                                            onBack={() => setMode('login')}
                                            loading={loading}
                                            recaptchaRef={recaptchaRef}
                                        />
                                    ) : (
                                        <PhoneVerificationForm
                                            verificationCode={verificationCode}
                                            onCodeChange={setVerificationCode}
                                            onSubmit={handleVerifyCode}
                                            loading={loading}
                                        />
                                    )}
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
