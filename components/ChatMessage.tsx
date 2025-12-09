import React from 'react';
import { motion } from 'framer-motion';
import { ChatMessage as ChatMessageType, ActionSuggestion } from '../types';
import MiniPollCard from './MiniPollCard';
import InChatPollCreator from './InChatPollCreator';
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatMessageProps {
    message: ChatMessageType;
    isTyping?: boolean;
    onViewPoll?: (pollId: string) => void;
    onActionClick?: (action: ActionSuggestion) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    isTyping = false,
    onViewPoll,
    onActionClick
}) => {
    const isUser = message.role === 'user';

    if (isTyping) {
        return (
            <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-brand-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    AI
                </div>
                <div className="flex-1">
                    <div className="inline-block bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-gray-500" />
                            <span className="text-sm text-gray-500">Thinking...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isUser
                ? 'bg-gray-200 text-gray-700'
                : 'bg-brand-900 text-white'
                }`}>
                {isUser ? 'U' : 'AI'}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[80%] ${isUser ? 'flex flex-col items-end' : ''}`}>
                {/* Text bubble */}
                <div className={`rounded-2xl px-4 py-3 ${isUser
                    ? 'bg-brand-900 text-white'
                    : 'bg-gray-100 text-gray-900'
                    }`}>
                    <div className="text-sm prose prose-sm max-w-none">
                        {isUser ? (
                            <p className="m-0">{message.content}</p>
                        ) : (
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => <p className="m-0 mb-2 last:mb-0">{children}</p>,
                                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                    em: ({ children }) => <em className="italic">{children}</em>,
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        )}
                    </div>
                </div>

                {/* Poll cards (AI only) */}
                {!isUser && message.pollCards && message.pollCards.length > 0 && (
                    <div className="mt-2 space-y-2 w-full">
                        {message.pollCards.map((poll) => (
                            <MiniPollCard
                                key={poll.id}
                                poll={poll}
                                onViewPoll={onViewPoll || (() => { })}
                            />
                        ))}
                    </div>
                )}

                {/* Action suggestions (AI only) */}
                {!isUser && message.actionSuggestions && message.actionSuggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {message.actionSuggestions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => onActionClick?.(action)}
                                className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-brand-900 hover:bg-gray-50 hover:border-brand-900 transition-all font-medium"
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Suggested Poll Creator (AI only) */}
                {!isUser && message.suggestedPoll && (
                    <InChatPollCreator
                        suggestedPoll={message.suggestedPoll}
                        onPollCreated={(pollId) => {
                            toast.success('Poll created successfully! View it in Explore.');
                        }}
                        onCancel={() => {
                            toast('Poll creation cancelled', { icon: '✖️' });
                        }}
                    />
                )}

                {/* Timestamp */}
                <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : ''}`}>
                    {message.timestamp.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatMessage;
