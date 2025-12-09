import React from 'react';
import { Phone } from 'lucide-react';
import Button from '../ui/Button';

interface PhoneSignInFormProps {
    phoneNumber: string;
    onPhoneChange: (phone: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    loading: boolean;
    recaptchaRef: React.RefObject<HTMLDivElement>;
}

const PhoneSignInForm: React.FC<PhoneSignInFormProps> = ({
    phoneNumber,
    onPhoneChange,
    onSubmit,
    onBack,
    loading,
    recaptchaRef
}) => {
    return (
        <>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => onPhoneChange(e.target.value)}
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
                    onClick={onBack}
                    className="w-full text-sm text-gray-600 hover:text-brand-900 mt-4"
                >
                    Back to other sign-in options
                </button>
            </form>

            {/* reCAPTCHA container */}
            <div ref={recaptchaRef}></div>
        </>
    );
};

export default PhoneSignInForm;
