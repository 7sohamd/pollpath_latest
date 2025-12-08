import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { HowItWorks, FeatureGrid, UseCases } from './components/Features';
import { FooterSection } from './components/Footer';
import ScrollBlur from './components/ScrollBlur';
import CreatePoll from './components/CreatePoll';
import ExplorePolls from './components/ExplorePolls';
import { AuthProvider } from './contexts/AuthContext';
import { Poll } from './types';
import { Toaster } from 'react-hot-toast';

// Define available views
type View = 'home' | 'create' | 'explore';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [sharedPollId, setSharedPollId] = useState<string | null>(null);

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
      </div>
    </AuthProvider>
  );
}

export default App;