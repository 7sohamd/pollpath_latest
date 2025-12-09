import React from 'react';

const LiveLogsGraphic = () => {
    const logs = [
        "Vote from London 🇬🇧", "New comment on #poll-23", "Goal reached: 1000 votes", "Vote from Tokyo 🇯🇵", "Vote from New York 🇺🇸", "Poll shared on Twitter"
    ];

    return (
        <div className="w-full h-full px-6 py-4 overflow-hidden relative flex flex-col justify-center [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <div className="animate-marquee-vertical space-y-3 relative z-10">
                {[...logs, ...logs].map((log, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm text-xs text-gray-600 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveLogsGraphic;
