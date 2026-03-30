"use client";

import { motion } from "framer-motion";
import { Plus, LinkIcon, FileUp, StickyNote } from "lucide-react";
import { useState } from "react";

type ContentType = "url" | "file" | "note";

export default function NewContentPage() {
  const [activeTab, setActiveTab] = useState<ContentType>("url");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");

  const tabs = [
    { id: "url" as ContentType, label: "Paste URL", icon: LinkIcon },
    { id: "file" as ContentType, label: "Upload File", icon: FileUp },
    { id: "note" as ContentType, label: "Quick Note", icon: StickyNote },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Add Content
        </h1>
        <p className="text-text-secondary mt-1">
          Save articles, upload files, or jot down quick notes.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface-700 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-surface-500 text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* URL Input */}
      {activeTab === "url" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Article URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/article..."
              className="input-base"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <p className="text-text-tertiary text-xs">
            Echora will fetch the article, extract key concepts, and add it to
            your knowledge graph.
          </p>
          <button className="btn-lime flex items-center gap-2" disabled={!url}>
            <Plus className="w-4 h-4" />
            Save to Knowledge Base
          </button>
        </motion.div>
      )}

      {/* File Upload */}
      {activeTab === "file" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="border-2 border-dashed border-border-default rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-border-hover transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-surface-600 flex items-center justify-center mb-4">
              <FileUp className="w-5 h-5 text-text-tertiary" />
            </div>
            <h3 className="font-heading font-semibold text-text-primary mb-1">
              Drop a file here
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              PDF, DOC, TXT, or Markdown
            </p>
            <button className="btn-ghost text-sm">Browse Files</button>
          </div>
        </motion.div>
      )}

      {/* Quick Note */}
      {activeTab === "note" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Give your note a title..."
              className="input-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Content
            </label>
            <textarea
              placeholder="Write your thoughts, insights, or ideas..."
              className="input-base min-h-[200px] resize-y"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <button
            className="btn-lime flex items-center gap-2"
            disabled={!title || !note}
          >
            <Plus className="w-4 h-4" />
            Save Note
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
