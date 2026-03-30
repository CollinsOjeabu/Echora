
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, BrainCircuit, Target, Share2, Search } from 'lucide-react';

const AgentShowcase: React.FC = () => {
  return (
    <section id="agents" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
           <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
             Two Specialized Minds. <br />
             <span className="text-neutral-500">One Unified Goal.</span>
           </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* LinkedIn Agent */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative p-8 md:p-12 rounded-[2.5rem] glass overflow-hidden border border-blue-500/10"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Linkedin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">The Strategist</h3>
                <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider">LinkedIn Specialist</p>
              </div>
            </div>

            <p className="text-neutral-400 mb-8 leading-relaxed">
              Trained on millions of high-performing B2B engagement patterns. 
              The Strategist understands the nuance of thought leadership, 
              building authority through professional storytelling and data-backed insights.
            </p>

            <div className="space-y-4">
              {[
                { icon: <BrainCircuit />, text: 'Authority-driven narrative generation' },
                { icon: <Target />, text: 'B2B algorithm trend monitoring' },
                { icon: <Search />, text: 'Credible source research & citation' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-neutral-300">
                  <div className="text-blue-400">{feature.icon}</div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 glass-dark rounded-2xl border border-white/5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Core Competency</p>
              <div className="flex justify-between items-end">
                <span className="text-xl font-display font-bold text-white">Thought Leadership</span>
                <span className="text-blue-400 font-mono text-sm">99.4% Acc.</span>
              </div>
            </div>
          </motion.div>

          {/* Twitter Agent */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative p-8 md:p-12 rounded-[2.5rem] glass overflow-hidden border border-white/5"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] -z-10" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-white/5 group-hover:scale-110 transition-transform">
                <Twitter className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">The Catalyst</h3>
                <p className="text-neutral-300 text-sm font-semibold uppercase tracking-wider">Twitter/X Specialist</p>
              </div>
            </div>

            <p className="text-neutral-400 mb-8 leading-relaxed">
              Master of viral mechanics and thread structures. The Catalyst
              scans the cultural pulse in real-time, deciding when to strike
              with punchy, algorithm-optimized content that demands attention.
            </p>

            <div className="space-y-4">
              {[
                { icon: <Share2 />, text: 'Viral thread hook optimization' },
                { icon: <Activity />, text: 'Real-time trending topic pivoting' },
                { icon: <Zap />, text: 'High-speed engagement drafting' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-neutral-300">
                  <div className="text-neutral-100">{feature.icon}</div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 glass-dark rounded-2xl border border-white/5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Core Competency</p>
              <div className="flex justify-between items-end">
                <span className="text-xl font-display font-bold text-white">Viral Mechanics</span>
                <span className="text-white font-mono text-sm">98.2% Reach</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Simple icon placeholders for the map loop above if imports aren't available
const Activity = (props: any) => <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const Zap = (props: any) => <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

export default AgentShowcase;
