import React from 'react';
import Button from '../ui/Button';

interface PhoneVerificationFormProps {
    verificationCode: string;
    onCodeChange: (code: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

const PhoneVerificationForm: React.FC<PhoneVerificationFormProps> = ({
    verificationCode,
    onCodeChange,
    onSubmit,
    loading
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                </label>
                <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => onCodeChange(e.target.value)}
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
    );
};

export default PhoneVerificationForm;
