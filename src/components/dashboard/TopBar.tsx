"use client";

import { Search, Bell } from "lucide-react";
import { useState } from "react";

export default function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-16 border-b border-border-default bg-surface-800/60 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search your knowledge base..."
          className="input-base pl-10 bg-surface-700/50"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-glass-bg transition-all">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-echora-lime rounded-full" />
        </button>

        {/* User Avatar */}
        <button className="w-8 h-8 rounded-full bg-surface-600 border border-border-default flex items-center justify-center text-text-secondary text-xs font-medium hover:border-border-hover transition-all">
          U
        </button>
      </div>
    </header>
  );
}
