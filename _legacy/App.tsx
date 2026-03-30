
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Header from './components/Header';
import HeroExplosive from './components/HeroExplosive';
import AgentDossiers from './components/AgentDossiers';
import NeuralWorkflow from './components/NeuralWorkflow';
import VoiceDNA from './components/VoiceDNA';
import TerminalAnalytics from './components/TerminalAnalytics';
import FooterMinimal from './components/FooterMinimal';

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="bg-[#050505] min-h-screen selection:bg-lime selection:text-black">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-lime z-[100] origin-left" 
        style={{ scaleX }}
      />

      <Header />
      
      <main>
        <HeroExplosive />
        <NeuralWorkflow />
        <AgentDossiers />
        <VoiceDNA />
        <TerminalAnalytics />
      </main>

      <FooterMinimal />
    </div>
  );
};

export default App;
