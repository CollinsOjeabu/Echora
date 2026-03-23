
import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Quote, UserCheck } from 'lucide-react';

const VoicePreservation: React.FC = () => {
  return (
    <section id="learning" className="py-24 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
             <Fingerprint className="w-6 h-6 text-blue-400" />
           </div>
           <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
             Your Authentic Voice, <br />
             <span className="text-blue-400">Preserved.</span>
           </h2>
           <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
             AI often sounds like AI. Echora's agents use Deep Voice Learning to 
             analyze your historical content, linguistic patterns, and personality quirks.
             The result? Content that sounds like you, just at scale.
           </p>

           <div className="space-y-6">
              <div className="flex gap-4">
                 <div className="flex-shrink-0 w-10 h-10 rounded-full glass flex items-center justify-center text-blue-400">
                    <UserCheck className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="font-bold text-white mb-1">Deep Pattern Analysis</h4>
                    <p className="text-sm text-neutral-500">Scans 2+ years of your history to map your tonal DNA.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="flex-shrink-0 w-10 h-10 rounded-full glass flex items-center justify-center text-blue-400">
                    <Quote className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="font-bold text-white mb-1">Contextual Nuance</h4>
                    <p className="text-sm text-neutral-500">Learns when to be professional, witty, or provocative.</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="relative">
           {/* Visual Representation of Voice Mapping */}
           <div className="relative aspect-square glass rounded-[3rem] p-12 overflow-hidden border border-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
              
              {/* Animated wave lines or neural network logic */}
              <div className="flex flex-col gap-8 h-full justify-center">
                {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold text-neutral-500 tracking-widest">
                         <span>Linguistic Feature {i}</span>
                         <span>98.9% Match</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${80 + i * 4}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        />
                      </div>
                   </div>
                ))}
                
                <div className="mt-8 flex items-center gap-4">
                   <div className="p-4 glass rounded-2xl flex-1 border border-blue-500/20">
                      <p className="text-xs italic text-neutral-300">"The draft perfectly captured my skepticism about traditional VCs."</p>
                      <p className="text-[10px] text-blue-400 mt-2 font-bold">— Early User Feedback</p>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default VoicePreservation;
