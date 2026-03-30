
import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, Twitter, Linkedin, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Parallax effects for scroll
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

  // Mouse tracking for reactive background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Reactive motion for background elements
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-30px", "30px"]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], ["-30px", "30px"]);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Reactive Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Floating Glows */}
        <motion.div 
          style={{ x: translateX, y: translateY, opacity }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full"
        />
        <motion.div 
          style={{ x: useTransform(translateX, (v) => parseInt(v) * -1.5 + "px"), y: useTransform(translateY, (v) => parseInt(v) * -1.5 + "px"), opacity }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[140px] rounded-full"
        />
        
        {/* Grid/Mesh Pattern */}
        <motion.div 
          style={{ rotateX, rotateY, y: y1 }}
          className="absolute inset-0 opacity-[0.15]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </motion.div>

        {/* Floating Neural Nodes (Abstract representation of agents) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i }}
            style={{
              top: `${20 + (i * 15)}%`,
              left: `${10 + (i * 18)}%`,
              y: i % 2 === 0 ? y1 : y2,
              x: useTransform(mouseXSpring, [-0.5, 0.5], [i * 10 + "px", i * -10 + "px"])
            }}
            className="absolute w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          style={{ scale }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-blue-500/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
              First Autonomous Agent Workforce
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-extrabold tracking-tighter leading-[0.9] mb-8 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent"
          >
            THE WORKFORCE <br /> THAT NEVER SLEEPS.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mb-12 leading-relaxed"
          >
            Echora deploys two specialized AI agents—one for LinkedIn, one for X—that research, 
            compose, and engage in your voice. Fully autonomous. 24/7. 
            Stop prompting. Start growing.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <button className="group relative px-8 py-4 bg-blue-600 rounded-full font-bold text-lg overflow-hidden transition-all hover:pr-12">
              <span className="relative z-10">Deploy Your Agents</span>
              <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all w-5 h-5" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="flex items-center gap-4 text-neutral-400 font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://picsum.photos/seed/${i + 20}/40/40`}
                    className="w-10 h-10 rounded-full border-2 border-black"
                    alt="User"
                  />
                ))}
              </div>
              <span>Trusted by 500+ creators</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual Mockup/Abstract representation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 relative"
        >
          <div className="relative aspect-[21/9] w-full max-w-6xl mx-auto rounded-3xl overflow-hidden glass border-t border-white/10 shadow-2xl group">
             {/* Simulated Interface */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000')] bg-cover opacity-10 group-hover:opacity-20 transition-opacity duration-700 blur-[2px]" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
             
             {/* Dynamic Data Overlays */}
             <motion.div 
               style={{ y: useTransform(scrollY, [0, 1000], [0, -50]) }}
               className="absolute top-10 left-10 p-6 glass-dark rounded-2xl w-64 border border-blue-500/30 shadow-2xl"
             >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Linkedin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold">LinkedIn Agent</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }} 
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-full w-1/3 bg-blue-400"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Scanning B2B Trends...</p>
                </div>
             </motion.div>

             <motion.div 
               style={{ y: useTransform(scrollY, [0, 1000], [0, 50]) }}
               className="absolute bottom-10 right-10 p-6 glass-dark rounded-2xl w-64 border border-indigo-500/30 shadow-2xl"
             >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <Twitter className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm font-bold">X (Twitter) Agent</span>
                </div>
                <div className="space-y-2">
                   <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                      <p className="text-[11px] italic text-neutral-300">"Deciding: Strategy for viral thread on AI ethics..."</p>
                   </div>
                   <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Decision Matrix: 98% Match</p>
                </div>
             </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
