
import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Eye } from 'lucide-react';

const data = [
  { name: 'Week 1', organic: 4000, autonomous: 4400 },
  { name: 'Week 2', organic: 3000, autonomous: 5200 },
  { name: 'Week 3', organic: 2000, autonomous: 7800 },
  { name: 'Week 4', organic: 2780, autonomous: 11000 },
  { name: 'Week 5', organic: 1890, autonomous: 15000 },
  { name: 'Week 6', organic: 2390, autonomous: 22000 },
  { name: 'Week 7', organic: 3490, autonomous: 31000 },
];

const AnalyticsPreview: React.FC = () => {
  return (
    <section className="py-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
             <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">Growth, on Autopilot.</h2>
             <p className="text-neutral-400 mb-8">
               Watch your authority compound while you focus on high-level strategy. 
               Our agents don't just post—they optimize for the compound effect.
             </p>

             <div className="space-y-4">
               {[
                 { label: "Reach Multiplier", value: "8.4x", icon: <Eye className="text-blue-400" /> },
                 { label: "Inbound Leads", value: "+142%", icon: <Users className="text-emerald-400" /> },
                 { label: "Efficiency Boost", value: "24/7", icon: <TrendingUp className="text-purple-400" /> },
               ].map((stat, i) => (
                 <div key={i} className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5">
                   <div className="flex items-center gap-3">
                     {stat.icon}
                     <span className="text-sm text-neutral-400 font-medium">{stat.label}</span>
                   </div>
                   <span className="text-xl font-bold">{stat.value}</span>
                 </div>
               ))}
             </div>
          </div>

          <div className="lg:col-span-2">
             <div className="p-8 rounded-[2.5rem] glass border border-white/5 h-[450px] relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                   <div>
                      <h4 className="text-lg font-bold">Impression Forecast</h4>
                      <p className="text-xs text-neutral-500">Autonomous Growth vs. Manual Effort</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-blue-500" />
                         <span className="text-xs font-medium text-neutral-400">Agents</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-white/20" />
                         <span className="text-xs font-medium text-neutral-400">Manual</span>
                      </div>
                   </div>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4a4a4a', fontSize: 10}} dy={10} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px'}} 
                        itemStyle={{color: '#fff'}}
                      />
                      <Area type="monotone" dataKey="autonomous" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorAuto)" />
                      <Area type="monotone" dataKey="organic" stroke="#333" strokeWidth={2} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Micro-interaction: glowing line at peak */}
                <div className="absolute top-1/2 right-10 w-32 h-32 bg-blue-500/20 blur-3xl pointer-events-none" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPreview;
