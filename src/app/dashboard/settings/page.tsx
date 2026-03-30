"use client";

import { motion } from "framer-motion";
import { User, Mic, Key, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Settings
        </h1>
        <p className="text-text-secondary mt-1">
          Manage your profile, voice, and integrations.
        </p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-text-secondary" />
          <h2 className="font-heading font-semibold text-text-primary">
            Profile
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Display Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input-base"
              disabled
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Bio
          </label>
          <textarea
            placeholder="A short bio for your content profile..."
            className="input-base min-h-[80px] resize-y"
          />
        </div>
        <button className="btn-lime">Save Profile</button>
      </div>

      {/* Voice Profile */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Mic className="w-5 h-5 text-text-secondary" />
          <h2 className="font-heading font-semibold text-text-primary">
            Voice Profile
          </h2>
        </div>
        <p className="text-text-secondary text-sm">
          Paste 3–5 of your best posts so the AI can learn your writing style,
          tone, and vocabulary.
        </p>
        <textarea
          placeholder="Paste your sample posts here, separated by blank lines..."
          className="input-base min-h-[160px] resize-y font-mono text-xs"
        />
        <button className="btn-lime">Analyze Voice</button>
      </div>

      {/* API Keys */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Key className="w-5 h-5 text-text-secondary" />
          <h2 className="font-heading font-semibold text-text-primary">
            API Keys
          </h2>
        </div>
        <p className="text-text-secondary text-sm">
          Connect your API keys to enable AI features.
        </p>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            placeholder="sk-..."
            className="input-base font-mono"
          />
        </div>
        <button className="btn-lime">Save Keys</button>
      </div>
    </motion.div>
  );
}
