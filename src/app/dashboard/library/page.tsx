"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Search,
  FileText,
  Video,
  StickyNote,
  MessageCircle,
  File,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const typeIcons: Record<string, typeof FileText> = {
  article: FileText,
  video: Video,
  note: StickyNote,
  tweet: MessageCircle,
  pdf: File,
};

const typeFilters = [
  { value: undefined, label: "All" },
  { value: "article" as const, label: "Articles" },
  { value: "video" as const, label: "Videos" },
  { value: "note" as const, label: "Notes" },
  { value: "tweet" as const, label: "Tweets" },
  { value: "pdf" as const, label: "PDFs" },
];

export default function LibraryPage() {
  const { profile, isLoading } = useCurrentUser();
  const [activeFilter, setActiveFilter] = useState<
    "article" | "video" | "note" | "tweet" | "pdf" | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch content from Convex
  const contentItems = useQuery(
    api.content.list,
    profile ? { userId: profile._id, type: activeFilter } : "skip",
  );

  // Search results (only active when searchQuery is non-empty)
  const searchResults = useQuery(
    api.content.search,
    profile && searchQuery.length >= 2
      ? { userId: profile._id, query: searchQuery }
      : "skip",
  );

  const removeContent = useMutation(api.content.remove);

  const displayItems = searchQuery.length >= 2 ? searchResults : contentItems;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 text-ember animate-spin" />
      </div>
    );
  }

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
            {displayItems && displayItems.length > 0
              ? `${displayItems.length} item${displayItems.length !== 1 ? "s" : ""} saved`
              : "Your saved articles, PDFs, notes, and research."}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {typeFilters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeFilter === filter.value
                ? "bg-ember/15 text-ember border border-ember/30"
                : "text-text-secondary hover:text-text-primary hover:bg-glass-bg border border-transparent"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Content List */}
      {displayItems === undefined ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 text-text-tertiary animate-spin" />
        </div>
      ) : displayItems.length > 0 ? (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {displayItems.map((ci) => {
              const Icon = typeIcons[ci.type] ?? FileText;
              return (
                <motion.div
                  key={ci._id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card px-5 py-4 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-surface-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-text-tertiary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate max-w-[500px]">
                        {ci.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-text-tertiary capitalize">
                          {ci.type}
                        </span>
                        <span className="text-text-tertiary text-xs">·</span>
                        <span
                          className={`text-xs capitalize ${
                            ci.status === "ready"
                              ? "text-status-success"
                              : ci.status === "error"
                                ? "text-status-error"
                                : ci.status === "processing"
                                  ? "text-status-warning"
                                  : "text-text-tertiary"
                          }`}
                        >
                          {ci.status}
                        </span>
                        {ci.tags && ci.tags.length > 0 && (
                          <>
                            <span className="text-text-tertiary text-xs">·</span>
                            {ci.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-1.5 py-0.5 rounded bg-surface-600 text-text-tertiary"
                              >
                                {tag}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {ci.url && (
                      <a
                        href={ci.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-glass-bg transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => removeContent({ contentId: ci._id })}
                      className="p-2 rounded-lg text-text-tertiary hover:text-status-error hover:bg-status-error/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-600 flex items-center justify-center mb-4">
            <BookOpen className="w-7 h-7 text-text-tertiary" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
            {searchQuery
              ? "No results found"
              : "Your knowledge base is empty"}
          </h3>
          <p className="text-text-secondary text-sm max-w-md mb-6">
            {searchQuery
              ? `No items match "${searchQuery}". Try a different search term.`
              : "Start building your personal knowledge graph by saving articles, uploading PDFs, or adding notes. Everything you save becomes searchable and connected."}
          </p>
          {!searchQuery && (
            <Link href="/dashboard/library/new">
              <button className="btn-lime flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Content
              </button>
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}
