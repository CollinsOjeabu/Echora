
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';

const activities = [
  { platform: 'LinkedIn', task: 'Researching Deep-dive on SaaS Retention Strategies', color: 'text-blue-400' },
  { platform: 'Twitter', task: 'Monitoring: Viral Thread in #TechCommunity detected', color: 'text-sky-400' },
  { platform: 'LinkedIn', task: 'Composing: Insightful post on Remote Leadership', color: 'text-blue-400' },
  { platform: 'Twitter', task: 'Publishing: Optimizing hook for algorithm peak at 3:15 PM', color: 'text-sky-400' },
  { platform: 'General', task: 'Analyzing: Learning from yesterday\'s 4.2% engagement boost', color: 'text-purple-400' },
];

const LivePulse: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full glass border-y border-white/5 py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Global Workforce Live</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <span className={`text-xs font-bold ${activities[index].color}`}>{activities[index].platform}:</span>
              <span className="text-xs text-neutral-300">{activities[index].task}</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="hidden md:flex items-center gap-6 text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
           <div className="flex items-center gap-2">
             <Activity className="w-3 h-3" />
             <span>892 Active Sessions</span>
           </div>
           <div className="flex items-center gap-2">
             <Clock className="w-3 h-3" />
             <span>24/7 Uptime</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LivePulse;
