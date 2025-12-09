import React from 'react';
import { Twitter, Instagram, Linkedin } from 'lucide-react';

const FooterMain: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center text-white font-bold font-serif text-lg">P</div>
                            <span className="font-serif font-bold text-xl text-brand-900">PollPath</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                            The decision engine for indecisive humans. Built for community clarity.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-900 hover:text-white transition-colors">
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-sans font-semibold text-gray-900 mb-4">Product</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-brand-900">Features</a></li>
                            <li><a href="#" className="hover:text-brand-900">Integrations</a></li>
                            <li><a href="#" className="hover:text-brand-900">Pricing</a></li>
                            <li><a href="#" className="hover:text-brand-900">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-sans font-semibold text-gray-900 mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-brand-900">About</a></li>
                            <li><a href="#" className="hover:text-brand-900">Careers</a></li>
                            <li><a href="#" className="hover:text-brand-900">Blog</a></li>
                            <li><a href="#" className="hover:text-brand-900">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-sans font-semibold text-gray-900 mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-brand-900">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-brand-900">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-brand-900">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 text-xs text-gray-400">
                    <p>&copy; {new Date().getFullYear()} PollPath Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span>Made with 🖤 by Soham</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterMain;
