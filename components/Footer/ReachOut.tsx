import React from 'react';

const ReachOut: React.FC = () => {
    return (
        <section id="contact" className="py-24 bg-brand-50 border-t border-gray-100">
            <div className="max-w-3xl mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-px bg-gray-200 w-12" />
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Reach out anytime</span>
                    <div className="h-px bg-gray-200 w-12" />
                </div>

                <h2 className="text-5xl md:text-6xl font-serif font-medium text-brand-900 mb-6 tracking-tight">
                    Stuck? Ping <span className="relative group cursor-help inline-block">
                        <span className="line-through text-gray-400 decoration-4 decoration-brand-200 mr-2">us</span>
                        <span className="text-brand-600">me</span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-max max-w-[200px] px-4 py-2 bg-brand-900 text-white text-sm font-sans font-medium tracking-normal rounded-xl shadow-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out pointer-events-none origin-bottom">
                            yes i built this sh*t brick by brick!
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-brand-900"></div>
                        </div>
                    </span>..
                </h2>

                <p className="text-xl text-gray-500 font-light mb-10">
                    We'll help you poll your first vote fast.
                </p>

                <div className="flex flex-col items-center justify-center gap-8">
                    <a href="https://x.com/7Sohamd" className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-brand-900 hover:scale-110 hover:shadow-md transition-all duration-300 group">
                        {/* X Logo SVG */}
                        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current group-hover:text-black" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>

                    <a href="mailto:soham4707@gmail.com" className="text-lg font-medium text-brand-900 hover:text-gray-600 transition-colors border-b border-brand-900/10 hover:border-brand-900 pb-0.5">
                        @7Sohamd
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ReachOut;
