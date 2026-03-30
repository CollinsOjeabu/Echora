"use client";

import { motion } from "framer-motion";
import { Bot, Zap, Lock } from "lucide-react";

const agents = [
  {
    name: "LinkedIn Agent",
    description:
      "Generates thought leadership posts from your knowledge graph. Cites your real research.",
    status: "Setup Required",
    statusColor: "text-status-warning",
    icon: "💼",
    requirements: ["Voice profile trained", "3+ knowledge items"],
  },
  {
    name: "Twitter/X Agent",
    description:
      "Creates concise, engaging threads from your saved research and insights.",
    status: "Coming Soon",
    statusColor: "text-text-tertiary",
    icon: "🐦",
    requirements: ["Voice profile trained", "3+ knowledge items"],
  },
];

export default function AgentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Content Agents
        </h1>
        <p className="text-text-secondary mt-1">
          AI agents that craft posts in your voice, citing your real research.
        </p>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div key={agent.name} className="glass-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{agent.icon}</span>
                <div>
                  <h3 className="font-heading font-semibold text-text-primary">
                    {agent.name}
                  </h3>
                  <span className={`text-xs font-medium ${agent.statusColor}`}>
                    {agent.status}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-text-secondary text-sm">{agent.description}</p>
            <div className="space-y-2">
              <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">
                Requirements
              </p>
              {agent.requirements.map((req) => (
                <div key={req} className="flex items-center gap-2 text-sm text-text-secondary">
                  <Lock className="w-3.5 h-3.5 text-text-tertiary" />
                  {req}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-text-primary mb-4">
          How Agents Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: "1",
              title: "Train Your Voice",
              desc: "Provide sample posts so the AI learns your unique style.",
            },
            {
              step: "2",
              title: "Build Knowledge",
              desc: "Save articles and research to your knowledge graph.",
            },
            {
              step: "3",
              title: "Generate & Review",
              desc: "Agents draft posts citing your sources. You approve or edit.",
            },
          ].map((s) => (
            <div key={s.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-echora-lime/10 flex items-center justify-center flex-shrink-0">
                <span className="text-echora-lime font-heading font-bold text-sm">
                  {s.step}
                </span>
              </div>
              <div>
                <h4 className="font-heading font-medium text-text-primary text-sm">
                  {s.title}
                </h4>
                <p className="text-text-tertiary text-xs mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
