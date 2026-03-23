
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, RefreshCw, BarChart3, Globe, Layers } from 'lucide-react';

const featureData = [
  {
    title: "True Autonomy",
    description: "Agents proactively monitor, decide, create, and publish without waiting for prompts. Set your strategy and walk away.",
    icon: <Cpu className="w-6 h-6" />,
    color: "bg-orange-500/10 text-orange-400"
  },
  {
    title: "Continuous Learning",
    description: "Every post is a lesson. Agents analyze performance data in real-time to adapt your strategy automatically.",
    icon: <RefreshCw className="w-6 h-6" />,
    color: "bg-emerald-500/10 text-emerald-400"
  },
  {
    title: "Platform-Specific Intel",
    description: "Built-in understanding of LinkedIn's professional networking vs Twitter's viral rapid-fire mechanics.",
    icon: <Globe className="w-6 h-6" />,
    color: "bg-blue-500/10 text-blue-400"
  },
  {
    title: "Multi-Agent Coordination",
    description: "Agents share intelligence and cross-adapt content. LinkedIn insights inform Twitter hooks and vice versa.",
    icon: <Layers className="w-6 h-6" />,
    color: "bg-purple-500/10 text-purple-400"
  },
  {
    title: "Approval Workflows",
    description: "Total control when you want it. Switch between full autonomy and 'Request Approval' mode instantly.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "bg-sky-500/10 text-sky-400"
  },
  {
    title: "Advanced Analytics",
    description: "A unified control center for a clear oversight of your workforce's ROI and growth trajectory.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "bg-rose-500/10 text-rose-400"
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">Revolutionary approach to content.</h2>
          <p className="text-lg text-neutral-400">
            Unlike traditional tools that wait for you to do the work, 
            Echora works for you. It's not an assistant; it's an employee.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureData.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-3xl glass border border-white/5 hover:border-white/10 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
