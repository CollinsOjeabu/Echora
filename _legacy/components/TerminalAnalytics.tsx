
import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Terminal, Database, Shield } from 'lucide-react';

const data = [
  { name: '01', val: 4000 },
  { name: '02', val: 5200 },
  { name: '03', val: 7800 },
  { name: '04', val: 11000 },
  { name: '05', val: 15000 },
  { name: '06', val: 22000 },
  { name: '07', val: 34000 },
];

const TerminalAnalytics: React.FC = () => {
  return (
    <section className="py-32 bg-[#050505]">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-20">
           <span className="text-lime font-black uppercase tracking-widest text-xs mb-4 block">03 / Analytics Terminal</span>
           <h2 className="text-6xl font-display font-black leading-tight tracking-tighter uppercase">
             Compound <br /> <span className="text-neutral-500">Intelligence.</span>
           </h2>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
           <div className="lg:col-span-3">
              <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-12 overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-full h-1 bg-lime/10" />
                 <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center">
                          <Terminal className="w-5 h-5 text-lime" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Protocol Performance</p>
                          <p className="text-xl font-display font-black">Global Impression Index</p>
                       </div>
                    </div>
                    <div className="px-4 py-2 glass-brutal rounded-full border border-lime/30 flex items-center gap-3">
                       <div className="w-2 h-2 bg-lime rounded-full animate-pulse" />
                       <span className="text-[10px] font-black text-lime uppercase tracking-widest">Live Monitoring</span>
                    </div>
                 </div>

                 <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={data}>
                          <defs>
                             <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D4FF3F" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#D4FF3F" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#111" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 10, fontWeight: 900}} />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{backgroundColor: '#000', border: '1px solid #D4FF3F', borderRadius: '12px', color: '#fff'}}
                            itemStyle={{color: '#D4FF3F'}}
                          />
                          <Area type="stepAfter" dataKey="val" stroke="#D4FF3F" strokeWidth={3} fillOpacity={1} fill="url(#glow)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           <div className="flex flex-col gap-8">
              {[
                { label: 'Reach multiplier', val: '12.4x', icon: <Database /> },
                { label: 'Security Score', val: '99.9%', icon: <Shield /> },
              ].map((stat, i) => (
                <div key={i} className="flex-1 p-10 glass-brutal rounded-[2.5rem] border border-white/5 group hover:border-lime/20 transition-all">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-neutral-500 group-hover:text-lime transition-colors">
                      {stat.icon}
                   </div>
                   <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">{stat.label}</p>
                   <p className="text-5xl font-display font-black">{stat.val}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};

export default TerminalAnalytics;
