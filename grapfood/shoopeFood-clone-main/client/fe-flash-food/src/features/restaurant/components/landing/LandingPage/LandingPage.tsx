import React from 'react';
import { LandingHeader } from '../LandingHeader';
import { HeroSection } from '../HeroSection';
import { AboutSection } from '../AboutSection';
import { PopularFoodsSection } from '../PopularFoodsSection';
import { HowItWorksSection } from '../HowItWorksSection';
import { AppDownloadSection } from '../AppDownloadSection';
import { LandingFooter } from '../LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <LandingHeader />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <PopularFoodsSection />
        <HowItWorksSection />
        <AppDownloadSection />
      </main>
      <LandingFooter />
    </div>
  );
};
