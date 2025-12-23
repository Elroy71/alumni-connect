import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import StatisticsSection from './StatisticsSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatisticsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;