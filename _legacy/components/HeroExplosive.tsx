
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Globe, Play, Linkedin, Twitter } from 'lucide-react';

const HeroExplosive: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const textX = useTransform(scrollY, [0, 500], [0, -100]);
  
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background Technical Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
          
          {/* Left: Huge Headline */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="px-3 py-1 bg-lime/10 border border-lime/20 text-lime text-[10px] font-black uppercase tracking-widest">
                Protocol v3.1 Enabled
              </div>
              <div className="h-[1px] w-24 bg-white/20" />
            </motion.div>

            <motion.h1 
              style={{ x: textX }}
              className="text-[12vw] lg:text-[10vw] font-display font-black leading-[0.8] tracking-tighter uppercase mb-12"
            >
              The <span className="text-lime">Neural</span> <br /> Workforce<span className="text-lime">.</span>
            </motion.h1>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-xs"
              >
                <p className="text-neutral-500 text-sm font-medium leading-relaxed uppercase tracking-tight">
                  Autonomous agents for LinkedIn and X. 
                  Masters of algorithm dynamics. 
                  Operating 24/7 in your voice.
                </p>
              </motion.div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-4 bg-lime text-black font-black uppercase tracking-tighter px-10 py-5 rounded-full text-xl"
              >
                <span>Deploy Protocol</span>
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </motion.button>
            </div>
          </div>

          {/* Right: Abstract Agent Visual */}
          <div className="relative w-full lg:w-1/3 aspect-square max-w-md">
             <motion.div 
               style={{ y }}
               className="relative w-full h-full"
             >
                {/* 3D Orb Mockup using CSS */}
                <div className="absolute inset-0 bg-lime blur-[120px] opacity-20 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-tr from-lime/40 to-blue-500/40 rounded-full border border-white/20 glass-brutal shadow-2xl overflow-hidden group">
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=1000')] bg-cover" 
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex gap-4">
                         <div className="w-12 h-12 glass flex items-center justify-center rounded-xl border border-white/20">
                            <Linkedin className="w-6 h-6" />
                         </div>
                         <div className="w-12 h-12 glass flex items-center justify-center rounded-xl border border-white/20">
                            <Twitter className="w-6 h-6" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Satellite data cards */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-10 -right-10 p-6 glass-brutal rounded-2xl border border-lime/30 w-48 shadow-2xl"
                >
                  <p className="text-[10px] font-black text-lime uppercase mb-2">Real-time Decision</p>
                  <p className="text-xs font-bold text-white leading-tight">"Executing thread strategy for peak X engagement at 18:00 UTC."</p>
                </motion.div>
             </motion.div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-wrap gap-12 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Partners:</span>
           {['FORBES', 'TECHCRUNCH', 'WIRED', 'BLOOMBERG', 'REUTERS'].map(logo => (
             <span key={logo} className="text-xl font-display font-black tracking-tighter">{logo}</span>
           ))}
        </div>
      </div>
    </section>
  );
};

export default HeroExplosive;
