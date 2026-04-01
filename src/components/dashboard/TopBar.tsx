"use client";

import { Search, Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Image from "next/image";

export default function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const { profile, clerkUser } = useCurrentUser();
  const { signOut } = useClerk();

  const displayName =
    profile?.name ?? clerkUser?.fullName ?? clerkUser?.firstName ?? "User";
  const avatarUrl = profile?.avatarUrl ?? clerkUser?.imageUrl;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

        {/* User Avatar + Name */}
        <div className="flex items-center gap-2">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-border-default object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-ember/20 border border-ember/30 flex items-center justify-center text-ember text-xs font-bold">
              {initials}
            </div>
          )}
          <span className="text-sm text-text-secondary font-medium hidden lg:block max-w-[120px] truncate">
            {displayName}
          </span>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="p-2 rounded-lg text-text-tertiary hover:text-status-error hover:bg-status-error/10 transition-all"
          title="Sign out"
        >
          <LogOut className="w-[18px] h-[18px]" />
        </button>
      </div>
    </header>
  );
}
