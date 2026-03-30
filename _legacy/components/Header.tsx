
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Command } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-lime text-black rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
            <Zap className="w-6 h-6 fill-black" />
          </div>
          <span className="text-2xl font-display font-black tracking-tighter text-white">
            ECHORA<span className="text-lime">.</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1 glass-brutal rounded-full px-2 py-1 border border-white/5">
          {['Infrastructure', 'Agent Intelligence', 'Learning Loop', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="px-6 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-lime transition-all"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">
            <Command className="w-3 h-3" />
            <span>Control Center</span>
          </button>
          <button className="bg-white text-black text-xs font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-lime transition-all active:scale-95">
            Hire Agents
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
