"use client";

import { motion } from "framer-motion";
import { BookOpen, Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function LibraryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            Knowledge Base
          </h1>
          <p className="text-text-secondary mt-1">
            Your saved articles, PDFs, notes, and research.
          </p>
        </div>
        <Link href="/dashboard/library/new">
          <button className="btn-lime flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Content
          </button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search your knowledge base..."
            className="input-base pl-10"
          />
        </div>
        <button className="btn-ghost flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Empty State */}
      <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-600 flex items-center justify-center mb-4">
          <BookOpen className="w-7 h-7 text-text-tertiary" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
          Your knowledge base is empty
        </h3>
        <p className="text-text-secondary text-sm max-w-md mb-6">
          Start building your personal knowledge graph by saving articles,
          uploading PDFs, or adding notes. Everything you save becomes
          searchable and connected.
        </p>
        <Link href="/dashboard/library/new">
          <button className="btn-lime flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Content
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
