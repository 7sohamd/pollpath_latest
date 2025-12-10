import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from './ui/Button';
import { Poll, PollTemplate, PollOption } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { pollService } from '../services/pollService';
import AuthModal from './AuthModal';
import ProPaywallModal from './ProPaywallModal';
import ProSuccessModal from './ProSuccessModal';
import toast from 'react-hot-toast';
import { POLL_TEMPLATES } from '../constants/pollTemplates';
import { DEFAULT_POLL_FORM, INPUT_BASE_CLASSES } from '../constants/pollDefaults';
import PollTemplateCard from './CreatePoll/PollTemplateCard';

import PollFormFields from './CreatePoll/PollFormFields';
import PollSettingsGrid from './CreatePoll/PollSettingsGrid';
import PollPreview from './CreatePoll/PollPreview';
import TemplateCarousel from './CreatePoll/TemplateCarousel';

interface CreatePollProps {
  onPublish: (poll: Poll) => void;
  onCancel: () => void;
}

const CreatePoll: React.FC<CreatePollProps> = ({ onPublish, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'scratch'>('templates');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proPaywallOpen, setProPaywallOpen] = useState(false);
  const [proSuccessOpen, setProSuccessOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<'unlisted' | 'extended-duration'>('unlisted');
  const { user, isPro } = useAuth();
  const [durationHours, setDurationHours] = useState(24);

  // Form State
  const [formData, setFormData] = useState<Partial<Poll>>(DEFAULT_POLL_FORM);

  const updateFormData = (updates: Partial<Poll>) => {
    setFormData({ ...formData, ...updates });
  };

  const handleTemplateSelect = (template: PollTemplate) => {
    setFormData({
      ...formData,
      ...template.data,
      options: template.data.options as PollOption[]
    });
    setActiveTab('scratch');
  };

  const handlePaywallTrigger = (feature: 'unlisted' | 'extended-duration') => {
    setPaywallFeature(feature);
    setProPaywallOpen(true);
  };

  const handleSubmit = async (status: 'published' | 'draft') => {
    // Check authentication
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (!formData.question || (formData.options?.length || 0) < 2) {
      toast.error("Please fill in a question and at least 2 options.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate poll close time based on duration
      const closesAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

      const finalPoll: Omit<Poll, 'id' | 'createdAt'> = {
        ...formData as Omit<Poll, 'id' | 'createdAt'>,
        status,
        updatedAt: new Date(),
        closesAt,
        creatorId: user.uid,
        creatorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        creatorEmail: user.email || '',
        voters: {},
        ownerIsPro: isPro,
      };

      // Save to Firestore
      const pollId = await pollService.createPoll(finalPoll, user.uid);
      toast.success('Poll created successfully!');

      // Call parent callback
      onPublish({ ...finalPoll, id: pollId, createdAt: new Date() });
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for better readability */}
      {/* Bottom fade overlay */}
      <div
        className="absolute inset-x-0 bottom-0 h-[32rem] pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl font-serif font-medium text-brand-900 mb-4">Create a new poll</h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Turn your questions into decisions. Set up a poll in seconds and share it with the world.
          </p>
        </motion.div>

        {/* Content Area */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >

          {/* Main Form Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'templates' ? (
                <motion.div
                  key="templates"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <TemplateCarousel
                    templates={POLL_TEMPLATES}
                    onSelect={handleTemplateSelect}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Back to Templates Link */}
                  <button
                    onClick={() => setActiveTab('templates')}
                    className="flex items-center gap-2 text-brand-700 hover:text-brand-900 font-medium transition-colors group"
                  >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
                    <span>Back to Templates</span>
                  </button>

                  <div className="bg-white rounded-[24px] shadow-sm border border-gray-200 p-8">
                    <div className="space-y-8">
                      {/* Form Fields */}
                      <PollFormFields
                        formData={formData}
                        onUpdate={updateFormData}
                        inputStyles={INPUT_BASE_CLASSES}
                      />

                      {/* Settings Grid */}
                      <PollSettingsGrid
                        formData={formData}
                        onUpdate={updateFormData}
                        isPro={isPro}
                        durationHours={durationHours}
                        onDurationChange={setDurationHours}
                        onPaywallTrigger={handlePaywallTrigger}
                        inputStyles={INPUT_BASE_CLASSES}
                      />

                      {/* Action Buttons */}
                      <div className="pt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 border-t border-gray-100">
                        <Button variant="ghost" onClick={onCancel} className="w-full sm:w-auto">Cancel</Button>
                        <div className="flex gap-3 w-full sm:w-auto">
                          <Button
                            variant="secondary"
                            className="flex-1 sm:flex-none"
                            onClick={() => handleSubmit('draft')}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Saving...' : 'Save as Draft'}
                          </Button>
                          <Button
                            className="flex-1 sm:flex-none shadow-xl shadow-brand-900/20"
                            onClick={() => handleSubmit('published')}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Publishing...' : 'Publish Poll'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live Preview Panel */}
          <PollPreview
            formData={formData}
            showBuildButton={activeTab === 'templates'}
            onBuildClick={() => setActiveTab('scratch')}
          />

        </motion.div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ProPaywallModal
        isOpen={proPaywallOpen}
        onClose={() => setProPaywallOpen(false)}
        onSuccess={() => {
          setProPaywallOpen(false);
          setProSuccessOpen(true);
        }}
        feature={paywallFeature}
      />
      <ProSuccessModal
        isOpen={proSuccessOpen}
        onClose={() => setProSuccessOpen(false)}
      />
    </div >
  );
};

export default CreatePoll;
