"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Shield,
  Brain,
  GitFork,
  Fingerprint,
  Dna,
  Activity,
  Terminal,
  Database,
  MessageSquare,
  Hash,
  Search,
  Target,
  PenTool,
  Share2,
  LineChart,
  Zap,
  Cpu,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";

/* ─── Data ─── */
const workflowSteps = [
  { icon: <Search className="w-5 h-5" />, title: "Monitor", desc: "Constant scan of global trends and niche competitors." },
  { icon: <Target className="w-5 h-5" />, title: "Decide", desc: "Autonomous strategy selection based on opportunity." },
  { icon: <Brain className="w-5 h-5" />, title: "Research", desc: "Deep-dive data gathering with validated citations." },
  { icon: <PenTool className="w-5 h-5" />, title: "Compose", desc: "Platform-optimized content generation in your DNA." },
  { icon: <Share2 className="w-5 h-5" />, title: "Publish", desc: "Algorithmically optimal delivery for max impact." },
  { icon: <LineChart className="w-5 h-5" />, title: "Learn", desc: "Neural weights updated based on performance." },
];

const chartData = [
  { name: "01", val: 4000 },
  { name: "02", val: 5200 },
  { name: "03", val: 7800 },
  { name: "04", val: 11000 },
  { name: "05", val: 15000 },
  { name: "06", val: 22000 },
  { name: "07", val: 34000 },
];

/* ─── Page ─── */
export default function LandingPage() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroTextX = useTransform(scrollY, [0, 500], [0, -80]);
  const orbY = useTransform(scrollY, [0, 500], [0, 160]);

  return (
    <div className="bg-[#050505] min-h-screen selection:bg-echora-lime selection:text-text-inverse">
      {/* ═══════ 1. Progress Bar ═══════ */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-echora-lime z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* ═══════ 2. Nav ═══════ */}
      <nav className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-auto">
        <div className="flex items-center gap-8 px-8 py-3 rounded-full glass-brutal border border-white/10 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-echora-lime rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-text-inverse" />
            </div>
            <span className="font-display text-lg font-black tracking-tighter uppercase text-white">
              ECHORA<span className="text-echora-lime">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {["Protocol", "Agents", "Research"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors"
              >
                {l}
              </a>
            ))}
          </div>

          <Link href="/signup">
            <button className="bg-echora-lime text-text-inverse text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full hover:shadow-[0_0_30px_rgba(200,255,0,0.3)] transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      <main>
        {/* ═══════ 3. Hero — Explosive ═══════ */}
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>

          <div className="max-w-[1600px] mx-auto px-6 w-full relative z-10">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
              {/* Left: massive headline */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="px-3 py-1 bg-echora-lime/10 border border-echora-lime/20 text-echora-lime text-[10px] font-black uppercase tracking-widest">
                    Knowledge Protocol Active
                  </div>
                  <div className="h-[1px] w-24 bg-white/20" />
                </motion.div>

                <motion.h1
                  style={{ x: heroTextX }}
                  className="font-display text-[12vw] lg:text-[10vw] font-black leading-[0.8] tracking-tighter uppercase mb-12"
                >
                  Learn <span className="text-echora-lime">Loud</span> <br />
                  Post Smart<span className="text-echora-lime">.</span>
                </motion.h1>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-xs"
                  >
                    <p className="text-neutral-500 text-sm font-medium leading-relaxed uppercase tracking-tight">
                      Transform scattered research into a living knowledge graph.
                      AI agents craft authentic posts citing your real sources. 24/7.
                    </p>
                  </motion.div>

                  <Link href="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex items-center gap-4 bg-echora-lime text-text-inverse font-black uppercase tracking-tighter px-10 py-5 rounded-full text-xl"
                    >
                      <span>Start Building</span>
                      <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Right: orb */}
              <div className="relative w-full lg:w-1/3 aspect-square max-w-md">
                <motion.div style={{ y: orbY }} className="relative w-full h-full">
                  <div className="absolute inset-0 bg-echora-lime blur-[120px] opacity-20 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-echora-lime/40 to-blue-500/40 rounded-full border border-white/20 glass-brutal shadow-2xl overflow-hidden">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 opacity-30 bg-gradient-to-br from-echora-lime/60 via-transparent to-blue-600/60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 glass-brutal flex items-center justify-center rounded-xl border border-white/20">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div className="w-12 h-12 glass-brutal flex items-center justify-center rounded-xl border border-white/20">
                          <GitFork className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating data card */}
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-10 -right-10 p-6 glass-brutal rounded-2xl border border-echora-lime/30 w-48 shadow-2xl"
                  >
                    <p className="text-[10px] font-black text-echora-lime uppercase mb-2">Real-time Insight</p>
                    <p className="text-xs font-bold text-white leading-tight">
                      &quot;Linking 3 new sources to your Knowledge Graph node on AI Ethics.&quot;
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Social proof bar */}
            <div className="mt-24 pt-12 border-t border-white/5 flex flex-wrap gap-12 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Trusted by Knowledge Workers:
              </span>
              {["RESEARCHERS", "FOUNDERS", "ANALYSTS", "STRATEGISTS", "CREATORS"].map((label) => (
                <span key={label} className="font-display text-xl font-black tracking-tighter">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ 4. Workflow Grid ═══════ */}
        <section id="protocol" className="py-32 relative">
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-20">
              {/* Left column — text */}
              <div className="lg:w-1/3">
                <span className="text-echora-lime font-black uppercase tracking-widest text-xs mb-4 block">
                  01 / Process Infrastructure
                </span>
                <h2 className="font-display text-6xl lg:text-7xl font-black leading-[0.85] tracking-tighter uppercase mb-8">
                  The <br />
                  <span className="text-neutral-500">Autonomous</span> <br />
                  Loop.
                </h2>
                <p className="text-neutral-500 leading-relaxed max-w-sm">
                  Traditional AI waits for prompts. Echora protocol initiates action.
                  A continuous, closed-loop neural system that creates value while you sleep.
                </p>
              </div>

              {/* Right column — 3×2 grid in bordered container */}
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden">
                {workflowSteps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ backgroundColor: 'rgba(212, 255, 63, 0.05)' }}
                    className="p-10 bg-[#050505] transition-colors group relative"
                  >
                    <div className="absolute top-4 right-4 text-[10px] font-black text-neutral-800 tracking-widest group-hover:text-echora-lime/40 transition-colors">
                      STEP 0{idx + 1}
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-8 text-neutral-400 group-hover:text-echora-lime group-hover:border-echora-lime/30 transition-all">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-display font-black uppercase tracking-tighter mb-4">
                      {step.title}
                    </h3>
                    <p className="text-neutral-500 text-sm font-medium leading-relaxed group-hover:text-neutral-300 transition-colors">
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ 5. Agent Dossiers ═══════ */}
        <section id="agents" className="py-32 bg-[#050505]">
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="mb-20">
              <span className="text-echora-lime font-black uppercase tracking-widest text-xs mb-4 block">
                02 / Intelligence Agents
              </span>
              <h2 className="font-display text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
                Meet Your <br />
                <span className="text-echora-lime">Agents.</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[4rem] overflow-hidden">
              {/* Agent 1 — LinkedIn */}
              <div className="p-16 lg:p-24 bg-[#050505] relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] -z-10 group-hover:bg-blue-600/10 transition-all duration-700" />

                <div className="flex items-center gap-6 mb-12">
                  <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-700">
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-display font-black uppercase tracking-tighter">
                      The <span className="text-blue-500">Authority</span>.
                    </h3>
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">
                      Agent ID: E-LI-772
                    </span>
                  </div>
                </div>

                <p className="text-xl text-neutral-400 font-medium leading-relaxed mb-12">
                  Specialized in the B2B high-stakes environment.
                  Trained on millions of decision-maker engagement signals.
                </p>

                <div className="space-y-6 mb-16">
                  {[
                    { label: "Strategic Deep-Scan", icon: <Search className="w-4 h-4" /> },
                    { label: "Thought-Leadership Engine", icon: <Cpu className="w-4 h-4" /> },
                    { label: "Corporate Voice Synth", icon: <Zap className="w-4 h-4" /> },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-4 text-neutral-500">
                      <div className="w-8 h-8 rounded-lg glass-brutal flex items-center justify-center text-blue-500">
                        {spec.icon}
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">{spec.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-end justify-between border-t border-white/5 pt-12">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Authority Index</p>
                    <p className="text-3xl font-display font-black text-white">99.4%</p>
                  </div>
                  <Link
                    href="/signup"
                    className="text-xs font-black uppercase tracking-widest border-b-2 border-blue-500 text-blue-500 pb-1 hover:text-white hover:border-white transition-all"
                  >
                    Initialize Agent
                  </Link>
                </div>
              </div>

              {/* Agent 2 — X / Twitter */}
              <div className="p-16 lg:p-24 bg-[#050505] relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-echora-lime/5 blur-[120px] -z-10 group-hover:bg-echora-lime/10 transition-all duration-700" />

                <div className="flex items-center gap-6 mb-12">
                  <div className="w-20 h-20 rounded-3xl bg-echora-lime flex items-center justify-center shadow-2xl shadow-echora-lime/20 group-hover:scale-110 transition-transform duration-700">
                    <Hash className="w-10 h-10 text-black" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-display font-black uppercase tracking-tighter">
                      The <span className="text-echora-lime">Catalyst</span>.
                    </h3>
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">
                      Agent ID: E-TW-119
                    </span>
                  </div>
                </div>

                <p className="text-xl text-neutral-400 font-medium leading-relaxed mb-12">
                  Optimized for high-velocity viral mechanics.
                  Real-time pivoting based on cultural pulse shifts.
                </p>

                <div className="space-y-6 mb-16">
                  {[
                    { label: "Viral Thread Forge", icon: <Activity className="w-4 h-4" /> },
                    { label: "Cultural Sentiment Scan", icon: <Search className="w-4 h-4" /> },
                    { label: "Rapid Pivot Logic", icon: <Zap className="w-4 h-4" /> },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-4 text-neutral-500">
                      <div className="w-8 h-8 rounded-lg glass-brutal flex items-center justify-center text-echora-lime">
                        {spec.icon}
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">{spec.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-end justify-between border-t border-white/5 pt-12">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Virality Score</p>
                    <p className="text-3xl font-display font-black text-white">98.2%</p>
                  </div>
                  <Link
                    href="/signup"
                    className="text-xs font-black uppercase tracking-widest border-b-2 border-echora-lime text-echora-lime pb-1 hover:text-white hover:border-white transition-all"
                  >
                    Initialize Agent
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ 6. Voice DNA ═══════ */}
        <section id="research" className="py-32 bg-[#080808] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-echora-lime/5 blur-[150px] -z-10" />

          <div className="max-w-[1600px] mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
            {/* Left: orbital visual */}
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-square glass-brutal rounded-[4rem] border-echora-lime/20 flex items-center justify-center p-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-20 border-[2px] border-dashed border-echora-lime/10 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-40 border-[1px] border-dashed border-white/10 rounded-full"
                />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-32 h-32 bg-echora-lime rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(200,255,0,0.3)]">
                    <Fingerprint className="w-16 h-16 text-text-inverse" />
                  </div>
                  <div className="mt-8 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-echora-lime">
                      Analysis Active
                    </span>
                    <div className="flex gap-1 h-4 items-end">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, 16, 4] }}
                          transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
                          className="w-1 bg-echora-lime/40 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating data points */}
                {[
                  { label: "Citation Depth", value: "94%", top: "20%", left: "15%" },
                  { label: "Source Accuracy", value: "99.1%", bottom: "25%", right: "10%" },
                  { label: "Voice Match", value: "97%", top: "30%", right: "15%" },
                ].map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    style={{
                      top: point.top,
                      bottom: point.bottom,
                      left: point.left,
                      right: point.right,
                    }}
                    className="absolute p-4 glass-brutal border-white/10 rounded-xl"
                  >
                    <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">
                      {point.label}
                    </p>
                    <p className="font-display text-xl font-black text-white">{point.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: text */}
            <div className="order-1 lg:order-2">
              <span className="text-echora-lime font-black uppercase tracking-widest text-xs mb-4 block">
                03 / Identity Engine
              </span>
              <h2 className="font-display text-7xl font-black leading-[0.9] tracking-tighter uppercase mb-8">
                Your <br />
                Neural <br />
                <span className="text-echora-lime">DNA.</span>
              </h2>
              <p className="text-xl text-neutral-400 font-medium leading-relaxed mb-12">
                Most AI sounds generic. Echora maps your unique linguistic fingerprint,
                preserving every nuance of your authentic voice across every platform.
              </p>

              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 glass-brutal rounded-3xl border-white/5">
                  <Dna className="text-echora-lime mb-4 w-6 h-6" />
                  <h4 className="font-black uppercase text-xs tracking-widest mb-2">
                    Tonal Mapping
                  </h4>
                  <p className="text-neutral-500 text-xs font-bold leading-relaxed">
                    Deep analysis of your writing patterns and rhetorical style.
                  </p>
                </div>
                <div className="p-8 glass-brutal rounded-3xl border-white/5">
                  <Activity className="text-echora-lime mb-4 w-6 h-6" />
                  <h4 className="font-black uppercase text-xs tracking-widest mb-2">
                    Adaptive Flux
                  </h4>
                  <p className="text-neutral-500 text-xs font-bold leading-relaxed">
                    System evolves as your voice shifts over time, staying perfectly human.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ 7. Analytics Terminal ═══════ */}
        <section className="py-32 bg-[#050505]">
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="mb-20">
              <span className="text-echora-lime font-black uppercase tracking-widest text-xs mb-4 block">
                04 / Analytics Terminal
              </span>
              <h2 className="font-display text-6xl font-black leading-tight tracking-tighter uppercase">
                Compound <br />
                <span className="text-neutral-500">Intelligence.</span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Chart */}
              <div className="lg:col-span-3">
                <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-12 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-echora-lime/10" />
                  <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-echora-lime/10 flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-echora-lime" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                          Knowledge Growth
                        </p>
                        <p className="font-display text-xl font-black">
                          Global Impression Index
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 glass-brutal rounded-full border border-echora-lime/30 flex items-center gap-3">
                      <div className="w-2 h-2 bg-echora-lime rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-echora-lime uppercase tracking-widest">
                        Live Monitoring
                      </span>
                    </div>
                  </div>

                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#c8ff00" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#c8ff00" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="5 5"
                          vertical={false}
                          stroke="#111"
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#444", fontSize: 10, fontWeight: 900 }}
                        />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "1px solid #c8ff00",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                          itemStyle={{ color: "#c8ff00" }}
                        />
                        <Area
                          type="stepAfter"
                          dataKey="val"
                          stroke="#c8ff00"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#glow)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div className="flex flex-col gap-8">
                {[
                  { label: "Reach multiplier", val: "12.4x", icon: <Database /> },
                  { label: "Source Integrity", val: "99.9%", icon: <Shield /> },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex-1 p-10 glass-brutal rounded-[2.5rem] border border-white/5 group hover:border-echora-lime/20 transition-all"
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-neutral-500 group-hover:text-echora-lime transition-colors">
                      {stat.icon}
                    </div>
                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">
                      {stat.label}
                    </p>
                    <p className="font-display text-5xl font-black">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════ 8. CTA Footer ═══════ */}
      <footer className="py-20 border-t border-white/5 bg-[#050505]">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-20">
            <div>
              <h2 className="font-display text-7xl lg:text-9xl font-black tracking-tighter uppercase leading-none mb-8">
                Ready to <br />
                <span className="text-echora-lime">Scale?</span>
              </h2>
              <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">
                Your knowledge graph is waiting. Agents on standby.
              </p>
            </div>

            <Link href="/signup">
              <button className="group relative w-full lg:w-auto px-20 py-10 bg-echora-lime text-text-inverse rounded-full overflow-hidden flex items-center justify-center gap-4">
                <span className="font-display text-4xl font-black uppercase tracking-tighter">
                  Get Early Access
                </span>
                <ArrowUpRight className="w-10 h-10 group-hover:rotate-45 transition-transform" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-20">
            {["X / Twitter", "LinkedIn", "YouTube", "Discord"].map((social) => (
              <a key={social} href="#" className="flex flex-col gap-2 group">
                <span className="text-[10px] font-black text-neutral-700 uppercase tracking-widest group-hover:text-echora-lime transition-colors">
                  {social}
                </span>
                <span className="h-[1px] w-full bg-white/5 group-hover:bg-echora-lime/30 transition-all" />
              </a>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600">
            <span>© 2025 ECHORA SYSTEMS</span>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Status: Nominal
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
