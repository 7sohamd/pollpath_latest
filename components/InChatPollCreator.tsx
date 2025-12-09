import React, { useState } from 'react';
import { SuggestedPoll, Poll } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { pollService } from '../services/pollService';
import toast from 'react-hot-toast';
import CompactPreview from './InChatPollCreator/CompactPreview';
import ExpandedForm from './InChatPollCreator/ExpandedForm';

interface InChatPollCreatorProps {
    suggestedPoll: SuggestedPoll;
    onPollCreated: (pollId: string) => void;
    onCancel: () => void;
}

const InChatPollCreator: React.FC<InChatPollCreatorProps> = ({
    suggestedPoll,
    onPollCreated,
    onCancel
}) => {
    const { user } = useAuth();
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Initialize form data from suggested poll
    const [formData, setFormData] = useState<Partial<Poll>>({
        question: suggestedPoll.question,
        type: 'single',
        options: suggestedPoll.options.map(opt => ({ label: opt, votesCount: 0 })),
        visibility: 'public',
        identity: 'named',
        voters: {},
        allowComments: true,
        resultsVisibility: 'always',
        tags: suggestedPoll.suggestedTags,
        totalVotes: 0,
        status: 'published'
    });

    const handleSubmit = async () => {
        if (!user) {
            setAuthModalOpen(true);
            return;
        }

        if (!formData.question || (formData.options?.length || 0) < 2) {
            toast.error("Please fill in a question and at least 2 options.");
            return;
        }

        // Check if all options have labels
        const hasEmptyOptions = formData.options?.some(opt => !opt.label.trim());
        if (hasEmptyOptions) {
            toast.error("All options must have a label.");
            return;
        }

        setIsSubmitting(true);
        try {
            const finalPoll: Omit<Poll, 'id' | 'createdAt'> = {
                ...formData as Omit<Poll, 'id' | 'createdAt'>,
                status: 'published',
                updatedAt: new Date(),
                closesAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                creatorId: user.uid,
                creatorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
                creatorEmail: user.email || '',
                voters: {},
                imageUrl: null,
            };

            const pollId = await pollService.createPoll(finalPoll, user.uid);
            toast.success('Poll created successfully!');
            onPollCreated(pollId);
        } catch (error) {
            console.error('Error creating poll:', error);
            toast.error('Failed to create poll. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isExpanded) {
        return (
            <CompactPreview
                question={formData.question || ''}
                options={formData.options || []}
                onExpand={() => setIsExpanded(true)}
                onCancel={onCancel}
            />
        );
    }

    return (
        <ExpandedForm
            formData={formData}
            onUpdate={(updates) => setFormData({ ...formData, ...updates })}
            onSubmit={handleSubmit}
            onCollapse={() => setIsExpanded(false)}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            authModalOpen={authModalOpen}
            onAuthModalClose={() => setAuthModalOpen(false)}
        />
    );
};

export default InChatPollCreator;
