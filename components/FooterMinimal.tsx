
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const FooterMinimal: React.FC = () => {
  return (
    <footer className="py-20 border-t border-white/5 bg-[#050505]">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-20">
           <div>
              <h2 className="text-7xl lg:text-9xl font-display font-black tracking-tighter uppercase leading-none mb-8">
                Ready to <br /> <span className="text-lime">Scale?</span>
              </h2>
              <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Infrastructure deployed. Agents on standby.</p>
           </div>
           
           <button className="group relative w-full lg:w-auto px-20 py-10 bg-lime text-black rounded-full overflow-hidden flex items-center justify-center gap-4">
              <span className="text-4xl font-display font-black uppercase tracking-tighter">Get Early Access</span>
              <ArrowUpRight className="w-10 h-10 group-hover:rotate-45 transition-transform" />
           </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-20">
           {['X / Twitter', 'LinkedIn', 'YouTube', 'Discord'].map(social => (
             <a key={social} href="#" className="flex flex-col gap-2 group">
                <span className="text-[10px] font-black text-neutral-700 uppercase tracking-widest group-hover:text-lime transition-colors">{social}</span>
                <span className="h-[1px] w-full bg-white/5 group-hover:bg-lime/30 transition-all" />
             </a>
           ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600">
           <span>© 2025 ECHORA SYSTEMS PROTOCOL</span>
           <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Status: Nominal</a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterMinimal;
