import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { HowItWorks, FeatureGrid, UseCases } from './components/Features';
import { FooterSection } from './components/Footer';
import ScrollBlur from './components/ScrollBlur';
import CreatePoll from './components/CreatePoll';
import ExplorePolls from './components/ExplorePolls';
import FloatingChatButton from './components/FloatingChatButton';
import ChatPanel from './components/ChatPanel';
import PollModal from './components/PollModal';
import { AuthProvider } from './contexts/AuthContext';
import { Poll } from './types';
import { Toaster } from 'react-hot-toast';
import { pollService } from './services/pollService';

// Define available views
type View = 'home' | 'create' | 'explore';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [sharedPollId, setSharedPollId] = useState<string | null>(null);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Poll modal state (for chat integration)
  const [chatSelectedPoll, setChatSelectedPoll] = useState<Poll | null>(null);
  const [isChatPollModalOpen, setIsChatPollModalOpen] = useState(false);

  // Handle URL query parameters for shared poll links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pollId = urlParams.get('poll');

    if (pollId) {
      setSharedPollId(pollId);
      setCurrentView('explore');
    }
  }, []);

  const navigateTo = (view: View) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    setSharedPollId(null); // Clear shared poll when navigating
  };

  const handlePublishPoll = (poll: Poll) => {
    console.log("Publishing Poll:", poll);
    navigateTo('explore'); // Navigate to explore page after creation
  };

  // Handler for when AI chat wants to show a poll
  const handleChatViewPoll = async (pollId: string) => {
    try {
      // Fetch the poll from Firestore
      const polls = await pollService.getPolls();
      const poll = polls.find(p => p.id === pollId);

      if (poll) {
        setChatSelectedPoll(poll);
        setIsChatPollModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching poll for chat:', error);
    }
  };

  // Handler for voting from chat-opened poll modal
  const handleChatPollVote = async (pollId: string, optionIndex: number) => {
    try {
      const user = null; // Get from auth context if needed
      // The actual voting logic is handled by PollModal internally
      // Just refresh the poll data after vote
      const polls = await pollService.getPolls();
      const updatedPoll = polls.find(p => p.id === pollId);
      if (updatedPoll) {
        setChatSelectedPoll(updatedPoll);
      }
    } catch (error) {
      console.error('Error voting in chat poll:', error);
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-brand-50 text-text-main selection:bg-brand-100 selection:text-brand-900 font-sans relative">
        <Navbar onNavigate={navigateTo} isSticky={currentView !== 'explore'} />

        <main>
          {currentView === 'home' && (
            <>
              <Hero onGetStarted={() => navigateTo('create')} />
              <HowItWorks />
              <FeatureGrid />
              <UseCases />
              <FooterSection />
            </>
          )}

          {currentView === 'create' && (
            <CreatePoll
              onPublish={handlePublishPoll}
              onCancel={() => navigateTo('home')}
            />
          )}

          {currentView === 'explore' && (
            <ExplorePolls onCreate={() => navigateTo('create')} sharedPollId={sharedPollId} />
          )}
        </main>

        <ScrollBlur />
        <Toaster position="top-right" />

        {/* AI Copilot Chat */}
        <FloatingChatButton
          onClick={() => setIsChatOpen(true)}
          isOpen={isChatOpen}
        />
        <ChatPanel
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onViewPoll={handleChatViewPoll}
          onNavigate={navigateTo}
          pageContext={{ route: currentView }}
        />

        {/* Poll modal for chat-opened polls */}
        <PollModal
          poll={chatSelectedPoll}
          isOpen={isChatPollModalOpen}
          onClose={() => setIsChatPollModalOpen(false)}
          onVote={handleChatPollVote}
        />
      </div>
    </AuthProvider>
  );
}

export default App;