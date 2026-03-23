
import React from 'react';
import { Zap, Twitter, Linkedin, Github, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-white tracking-tighter">ECHORA</span>
            </div>
            <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
              Deploying the world's first autonomous AI workforce for LinkedIn and X.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
             <h4 className="font-bold text-white mb-6 uppercase text-[10px] tracking-[0.2em]">Product</h4>
             <ul className="space-y-4">
                {['LinkedIn Agent', 'Twitter Agent', 'Voice Engine', 'Analytics'].map(item => (
                  <li key={item}><a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">{item}</a></li>
                ))}
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-white mb-6 uppercase text-[10px] tracking-[0.2em]">Company</h4>
             <ul className="space-y-4">
                {['About Us', 'Case Studies', 'Brand Story', 'Privacy'].map(item => (
                  <li key={item}><a href="#" className="text-sm text-neutral-500 hover:text-white transition-colors">{item}</a></li>
                ))}
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-white mb-6 uppercase text-[10px] tracking-[0.2em]">Join the Workforce</h4>
             <p className="text-xs text-neutral-500 mb-6">Receive weekly insights on AI content autonomy.</p>
             <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="email@example.com" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="bg-white text-black p-2 rounded-lg hover:bg-blue-50 transition-colors">
                   <ArrowUpRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
           <span>© 2025 Echora Systems Inc.</span>
           <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
              <a href="#" className="hover:text-white transition-colors">Status</a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
