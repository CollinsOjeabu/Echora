
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Brain, PenTool, Share2, LineChart, Target } from 'lucide-react';

const steps = [
  { icon: <Search />, title: "Monitor", desc: "Constant scan of global trends and niche competitors." },
  { icon: <Target />, title: "Decide", desc: "Autonomous strategy selection based on opportunity." },
  { icon: <Brain />, title: "Research", desc: "Deep-dive data gathering with validated citations." },
  { icon: <PenTool />, title: "Compose", desc: "Platform-optimized content generation in your DNA." },
  { icon: <Share2 />, title: "Publish", desc: "Algorithmically optimal delivery for max impact." },
  { icon: <LineChart />, title: "Learn", desc: "Neural weights updated based on performance." }
];

const NeuralWorkflow: React.FC = () => {
  return (
    <section id="infrastructure" className="py-32 relative">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3">
             <span className="text-lime font-black uppercase tracking-widest text-xs mb-4 block">01 / Process Infrastructure</span>
             <h2 className="text-6xl font-display font-black leading-tight tracking-tighter uppercase mb-8">
               The <br /> <span className="text-neutral-500">Autonomous</span> <br /> Loop.
             </h2>
             <p className="text-neutral-500 leading-relaxed max-w-sm">
               Traditional AI waits for prompts. Echora protocol initiates action. 
               A continuous, closed-loop neural system that creates value while you sleep.
             </p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 px-1 bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                whileHover={{ backgroundColor: 'rgba(212, 255, 63, 0.05)' }}
                className="p-10 bg-[#050505] transition-colors group relative"
              >
                <div className="absolute top-4 right-4 text-[10px] font-black text-neutral-800 tracking-widest group-hover:text-lime/40">
                  STEP 0{idx + 1}
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-8 text-neutral-400 group-hover:text-lime group-hover:border-lime/30 transition-all">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-display font-black uppercase tracking-tighter mb-4">{step.title}</h3>
                <p className="text-neutral-500 text-sm font-medium leading-relaxed group-hover:text-neutral-300">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeuralWorkflow;
