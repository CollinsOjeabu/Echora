"use client";

import { motion } from "framer-motion";
import { GitFork, BookOpen } from "lucide-react";

export default function GraphPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Knowledge Graph
        </h1>
        <p className="text-text-secondary mt-1">
          Visualize how your ideas and research connect.
        </p>
      </div>

      {/* Empty State */}
      <div className="glass-card flex flex-col items-center justify-center text-center" style={{ minHeight: "calc(100vh - 220px)" }}>
        <div className="w-16 h-16 rounded-2xl bg-surface-600 flex items-center justify-center mb-4">
          <GitFork className="w-7 h-7 text-text-tertiary" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
          Your graph is waiting
        </h3>
        <p className="text-text-secondary text-sm max-w-md mb-2">
          Add at least 3 content items to your Knowledge Base, and Echora will
          start discovering connections between your ideas.
        </p>
        <p className="text-text-tertiary text-xs flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          0 / 3 items needed
        </p>
      </div>
    </motion.div>
  );
}
