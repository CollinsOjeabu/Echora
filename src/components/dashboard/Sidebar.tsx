"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import {
  LayoutDashboard,
  BookOpen,
  GitFork,
  Bot,
  Settings,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/library", icon: BookOpen, label: "Knowledge Base" },
  { href: "/dashboard/graph", icon: GitFork, label: "Knowledge Graph" },
  { href: "/dashboard/agents", icon: Bot, label: "Agents" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r border-border-default bg-surface-800"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border-default">
        <div className="w-8 h-8 rounded-lg bg-echora-lime flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-text-inverse" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-heading font-bold text-lg text-text-primary whitespace-nowrap overflow-hidden"
            >
              Echora
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="px-3 pt-4 pb-2 space-y-2">
        <Link href="/dashboard/library/new">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              "flex items-center gap-3 rounded-lg cursor-pointer transition-all",
              collapsed
                ? "justify-center p-2.5"
                : "px-3 py-2.5",
              "bg-echora-lime/10 border border-echora-lime/20 text-echora-lime hover:bg-echora-lime/15"
            )}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Add Content
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={clsx(
                  "flex items-center gap-3 rounded-lg transition-all relative",
                  collapsed
                    ? "justify-center p-2.5"
                    : "px-3 py-2.5",
                  isActive
                    ? "bg-glass-bg-hover text-echora-lime"
                    : "text-text-secondary hover:text-text-primary hover:bg-glass-bg"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-echora-lime rounded-r-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-3 border-t border-border-default">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-glass-bg transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}
