import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { HowItWorks, FeatureGrid, UseCases } from './components/Features';
import { FooterSection } from './components/Footer';
import ScrollBlur from './components/ScrollBlur';
import CreatePoll from './components/CreatePoll';
import ExplorePolls from './components/ExplorePolls'; // Import new component
import { Poll } from './types';

// Define available views
type View = 'home' | 'create' | 'explore';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  const navigateTo = (view: View) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
  };

  const handlePublishPoll = (poll: Poll) => {
    console.log("Publishing Poll:", poll);
    // In a real app, this would write to Firestore
    alert("Poll Published! Check console for data structure.");
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-brand-50 text-text-main selection:bg-brand-100 selection:text-brand-900 font-sans relative">
      <Navbar onNavigate={navigateTo} />
      
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
          <ExplorePolls onCreate={() => navigateTo('create')} />
        )}
      </main>
      
      <ScrollBlur />
    </div>
  );
}

export default App;