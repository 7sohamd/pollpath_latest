import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { ChatMessage as ChatMessageType, ActionSuggestion } from '../types';
import ChatMessage from './ChatMessage';
import { aiService } from '../services/aiService';
import { v4 as uuidv4 } from 'uuid';

interface ChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onViewPoll: (pollId: string) => void;
    onNavigate: (view: 'create' | 'explore') => void;
    pageContext?: { route?: string };
}

const ChatPanel: React.FC<ChatPanelProps> = ({
    isOpen,
    onClose,
    onViewPoll,
    onNavigate,
    pageContext = {}
}) => {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatMessageType = {
            id: uuidv4(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await aiService.sendChatMessage(
                userMessage.content,
                messages,
                pageContext
            );

            const aiMessage: ChatMessageType = {
                id: uuidv4(),
                role: 'ai',
                content: response.text,
                timestamp: new Date(),
                pollCards: response.pollCards,
                actionSuggestions: response.actionSuggestions,
                suggestedPoll: response.suggestedPoll,
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);

            const errorMessage: ChatMessageType = {
                id: uuidv4(),
                role: 'ai',
                content: 'Sorry, I encountered an error. Please make sure the backend server is running and try again.',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleActionClick = (action: ActionSuggestion) => {
        if (action.type === 'createPoll') {
            onNavigate('create');
        } else if (action.type === 'openPoll' && action.payload.pollId) {
            onViewPoll(action.payload.pollId);
        }
        // createPollInChat is handled automatically by InChatPollCreator rendering
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
                        className="fixed inset-0 bg-brand-900/20 backdrop-blur-sm z-[80] md:hidden"
                    />

                    {/* Chat Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 400, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 400, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-4 right-4 w-[calc(100vw-2rem)] md:w-[420px] h-[600px] max-h-[calc(100vh-2rem)] bg-white rounded-3xl shadow-2xl z-[90] flex flex-col overflow-hidden border border-gray-200"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-brand-900 to-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">AI</span>
                                </div>
                                <div>
                                    <h2 className="text-white font-semibold text-base">PollPath Copilot</h2>
                                    <p className="text-white/70 text-xs">Your decision assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50/50">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                    <div className="w-16 h-16 rounded-full bg-brand-900/10 flex items-center justify-center mb-4">
                                        <span className="text-2xl">💭</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-brand-900 mb-2">
                                        Hi! I'm your PollPath Copilot
                                    </h3>
                                    <p className="text-sm text-gray-600 max-w-sm">
                                        Ask me about decisions, and I'll help you find similar polls from the community or give you insights to help you choose.
                                    </p>
                                    <div className="mt-6 space-y-2 w-full max-w-xs">
                                        <button
                                            onClick={() => setInputValue('Which programming language should I learn?')}
                                            className="w-full text-left px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 hover:border-brand-900 hover:bg-gray-50 transition-all"
                                        >
                                            Which programming language should I learn?
                                        </button>
                                        <button
                                            onClick={() => setInputValue('Should I start a blog or a YouTube channel?')}
                                            className="w-full text-left px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 hover:border-brand-900 hover:bg-gray-50 transition-all"
                                        >
                                            Should I start a blog or YouTube?
                                        </button>
                                    </div>
                                </div>
                            )}

                            {messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                    onViewPoll={onViewPoll}
                                    onActionClick={handleActionClick}
                                />
                            ))}

                            {isLoading && (
                                <ChatMessage
                                    message={{
                                        id: 'typing',
                                        role: 'ai',
                                        content: '',
                                        timestamp: new Date(),
                                    }}
                                    isTyping
                                />
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="px-4 py-4 border-t border-gray-100 bg-white">
                            <div className="flex items-end gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything..."
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-900 focus:ring-2 focus:ring-brand-900/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="p-3 rounded-xl bg-brand-900 text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/5 hover:shadow-black/10"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChatPanel;
