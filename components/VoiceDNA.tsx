
import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Dna, Activity } from 'lucide-react';

const VoiceDNA: React.FC = () => {
  return (
    <section id="learning-loop" className="py-32 bg-[#080808] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-lime/5 blur-[150px] -z-10" />
      
      <div className="max-w-[1600px] mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
        <div className="relative order-2 lg:order-1">
           {/* The "DNA Fingerprint" Visual */}
           <div className="relative aspect-square glass-brutal rounded-[4rem] border-lime/20 flex items-center justify-center p-20">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-20 border-[2px] border-dashed border-lime/10 rounded-full" 
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-40 border-[1px] border-dashed border-white/10 rounded-full" 
              />
              
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-32 h-32 bg-lime rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(212,255,63,0.3)]">
                    <Fingerprint className="w-16 h-16 text-black" />
                 </div>
                 <div className="mt-8 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-lime">Analysis Active</span>
                    <div className="flex gap-1 h-4 items-end">
                       {[...Array(12)].map((_, i) => (
                         <motion.div 
                          key={i}
                          animate={{ height: [4, 16, 4] }}
                          transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
                          className="w-1 bg-lime/40 rounded-full" 
                         />
                       ))}
                    </div>
                 </div>
              </div>

              {/* Data points */}
              {[
                { label: 'Sarcasm Index', value: '72%', top: '20%', left: '15%' },
                { label: 'Technical Depth', value: '94%', bottom: '25%', right: '10%' },
                { label: 'Industry Jargon', value: '88%', top: '30%', right: '15%' },
              ].map((point, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  style={{ top: point.top, bottom: point.bottom, left: point.left, right: point.right }}
                  className="absolute p-4 glass-brutal border-white/10 rounded-xl"
                >
                  <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">{point.label}</p>
                  <p className="text-xl font-display font-black text-white">{point.value}</p>
                </motion.div>
              ))}
           </div>
        </div>

        <div className="order-1 lg:order-2">
           <span className="text-lime font-black uppercase tracking-widest text-xs mb-4 block">02 / Identity Engine</span>
           <h2 className="text-7xl font-display font-black leading-[0.9] tracking-tighter uppercase mb-8">
             Your <br /> Neural <br /> <span className="text-lime">DNA.</span>
           </h2>
           <p className="text-xl text-neutral-400 font-medium leading-relaxed mb-12">
             Most AI sounds generic. Echora protocol maps your unique linguistic fingerprint, 
             preserving every nuance of your authentic voice across every platform.
           </p>

           <div className="grid grid-cols-2 gap-8">
              <div className="p-8 glass-brutal rounded-3xl border-white/5">
                 <Dna className="text-lime mb-4 w-6 h-6" />
                 <h4 className="font-black uppercase text-xs tracking-widest mb-2">Tonal Mapping</h4>
                 <p className="text-neutral-500 text-xs font-bold leading-relaxed">Deep analysis of historical semantics and rhetorical patterns.</p>
              </div>
              <div className="p-8 glass-brutal rounded-3xl border-white/5">
                 <Activity className="text-lime mb-4 w-6 h-6" />
                 <h4 className="font-black uppercase text-xs tracking-widest mb-2">Adaptive Flux</h4>
                 <p className="text-neutral-500 text-xs font-bold leading-relaxed">System evolves as your voice shifts over time, staying perfectly human.</p>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceDNA;
