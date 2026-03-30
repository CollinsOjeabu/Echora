
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Zap, Cpu, Search, Activity } from 'lucide-react';

const AgentDossiers: React.FC = () => {
  return (
    <section id="agent-intelligence" className="py-32 relative">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[4rem] overflow-hidden">
          
          {/* LinkedIn Dossier */}
          <div className="p-16 lg:p-24 bg-[#050505] relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] -z-10 group-hover:bg-blue-600/10 transition-all duration-700" />
             
             <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-700">
                   <Linkedin className="w-10 h-10 text-white fill-white" />
                </div>
                <div>
                   <h3 className="text-4xl font-display font-black uppercase tracking-tighter">The <span className="text-blue-500">Authority</span>.</h3>
                   <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Agent ID: E-LI-772</span>
                </div>
             </div>

             <p className="text-xl text-neutral-400 font-medium leading-relaxed mb-12">
                Specialized in the B2B high-stakes environment. 
                Trained on millions of decision-maker engagement signals.
             </p>

             <div className="space-y-6 mb-16">
                {[
                  { label: 'Strategic Deep-Scan', icon: <Search /> },
                  { label: 'Thought-Leadership Engine', icon: <Cpu /> },
                  { label: 'Corporate Voice Synth', icon: <Zap /> },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-4 text-neutral-500">
                    <div className="w-8 h-8 rounded-lg glass-brutal flex items-center justify-center text-blue-500">
                      {spec.icon}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{spec.label}</span>
                  </div>
                ))}
             </div>

             <div className="flex items-end justify-between border-t border-white/5 pt-12">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Authority Index</p>
                   <p className="text-3xl font-display font-black text-white">99.4%</p>
                </div>
                <button className="text-xs font-black uppercase tracking-widest border-b-2 border-blue-500 text-blue-500 pb-1 hover:text-white hover:border-white transition-all">
                  Initialize Agent
                </button>
             </div>
          </div>

          {/* Twitter Dossier */}
          <div className="p-16 lg:p-24 bg-[#050505] relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-lime/5 blur-[120px] -z-10 group-hover:bg-lime/10 transition-all duration-700" />
             
             <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 rounded-3xl bg-lime flex items-center justify-center shadow-2xl shadow-lime/20 group-hover:scale-110 transition-transform duration-700">
                   <Twitter className="w-10 h-10 text-black fill-black" />
                </div>
                <div>
                   <h3 className="text-4xl font-display font-black uppercase tracking-tighter">The <span className="text-lime">Catalyst</span>.</h3>
                   <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Agent ID: E-TW-119</span>
                </div>
             </div>

             <p className="text-xl text-neutral-400 font-medium leading-relaxed mb-12">
                Optimized for high-velocity viral mechanics. 
                Real-time pivoting based on cultural pulse shifts.
             </p>

             <div className="space-y-6 mb-16">
                {[
                  { label: 'Viral Thread Forge', icon: <Activity /> },
                  { label: 'Cultural Sentiment Scan', icon: <Search /> },
                  { label: 'Rapid Pivot Logic', icon: <Zap /> },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-4 text-neutral-500">
                    <div className="w-8 h-8 rounded-lg glass-brutal flex items-center justify-center text-lime">
                      {spec.icon}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{spec.label}</span>
                  </div>
                ))}
             </div>

             <div className="flex items-end justify-between border-t border-white/5 pt-12">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Virality Score</p>
                   <p className="text-3xl font-display font-black text-white">98.2%</p>
                </div>
                <button className="text-xs font-black uppercase tracking-widest border-b-2 border-lime text-lime pb-1 hover:text-white hover:border-white transition-all">
                  Initialize Agent
                </button>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AgentDossiers;
