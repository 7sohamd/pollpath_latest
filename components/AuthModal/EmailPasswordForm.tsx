import React from 'react';
import { Mail, Lock } from 'lucide-react';
import Button from '../ui/Button';

interface EmailPasswordFormProps {
    mode: 'login' | 'signup';
    email: string;
    password: string;
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

const EmailPasswordForm: React.FC<EmailPasswordFormProps> = ({
    mode,
    email,
    password,
    onEmailChange,
    onPasswordChange,
    onSubmit,
    loading
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
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
                        onChange={(e) => onPasswordChange(e.target.value)}
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
    );
};

export default EmailPasswordForm;
