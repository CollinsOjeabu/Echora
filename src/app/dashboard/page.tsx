"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  GitFork,
  Bot,
  TrendingUp,
  Plus,
  ArrowRight,
  Zap,
  Brain,
  FileText,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const quickActions = [
  {
    title: "Save an Article",
    description: "Paste a URL to add to your knowledge base",
    icon: FileText,
    href: "/dashboard/library/new",
    color: "text-status-info",
  },
  {
    title: "Explore Your Graph",
    description: "See how your ideas connect",
    icon: Brain,
    href: "/dashboard/graph",
    color: "text-echora-lime",
  },
  {
    title: "Generate a Post",
    description: "Let AI craft content from your research",
    icon: Zap,
    href: "/dashboard/agents",
    color: "text-status-warning",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function DashboardPage() {
  const { profile, isLoading } = useCurrentUser();

  // Fetch real data once we have the profile
  const contentItems = useQuery(
    api.content.list,
    profile ? { userId: profile._id } : "skip",
  );
  const agentPosts = useQuery(
    api.posts.list,
    profile ? { userId: profile._id } : "skip",
  );

  const contentCount = contentItems?.length ?? 0;
  const postsCount = agentPosts?.length ?? 0;

  const firstName = profile?.name?.split(" ")[0] ?? "there";

  const stats = [
    {
      label: "Knowledge Items",
      value: contentCount.toString(),
      change: contentCount > 0 ? `${contentCount} saved` : "Start adding content",
      icon: BookOpen,
      color: "text-status-info",
      bgColor: "bg-status-info/10",
    },
    {
      label: "Connections Found",
      value: "0",
      change: "Graph grows as you add",
      icon: GitFork,
      color: "text-echora-lime",
      bgColor: "bg-echora-lime/10",
    },
    {
      label: "Posts Generated",
      value: postsCount.toString(),
      change: postsCount > 0 ? `${postsCount} generated` : "Your agents are ready",
      icon: Bot,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
    },
    {
      label: "Voice Accuracy",
      value: "—",
      change: "Train your voice profile",
      icon: TrendingUp,
      color: "text-status-success",
      bgColor: "bg-status-success/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 text-ember animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Welcome back, {firstName}
        </h1>
        <p className="text-text-secondary mt-1">
          {contentCount === 0
            ? "Your knowledge graph is empty — let's start building it."
            : `You have ${contentCount} item${contentCount !== 1 ? "s" : ""} in your knowledge base.`}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-secondary text-sm font-medium">
                  {stat.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-heading font-bold text-text-primary">
                {stat.value}
              </div>
              <p className="text-text-tertiary text-xs mt-1">{stat.change}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">
          Get Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <motion.div
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="glass-card p-5 cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-glass-bg-hover flex items-center justify-center mb-3`}
                  >
                    <Icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <h3 className="font-heading font-semibold text-text-primary mb-1">
                    {action.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {action.description}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-echora-lime text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Get started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">
          Recent Activity
        </h2>
        {contentItems && contentItems.length > 0 ? (
          <div className="space-y-2">
            {contentItems.slice(0, 5).map((ci) => (
              <div
                key={ci._id}
                className="glass-card px-5 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-status-info/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-status-info" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary truncate max-w-[400px]">
                      {ci.title}
                    </p>
                    <p className="text-xs text-text-tertiary capitalize">
                      {ci.type} · {ci.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-600 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-text-tertiary" />
            </div>
            <h3 className="font-heading font-semibold text-text-primary mb-1">
              No activity yet
            </h3>
            <p className="text-text-secondary text-sm max-w-sm mb-5">
              Start by saving an article, uploading a PDF, or pasting some notes.
              Your knowledge graph will grow from here.
            </p>
            <Link href="/dashboard/library/new">
              <button className="btn-lime flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Content
              </button>
            </Link>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
