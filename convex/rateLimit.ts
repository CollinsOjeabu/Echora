import { query, internalMutation } from "./_generated/server"
import { v } from "convex/values"
import { ConvexError } from "convex/values"
import { PLAN_LIMITS, type Plan } from "./lib/rateLimits"

/**
 * Escape hatch 3: Reset all rate-limit counters for a profile.
 * Callable from the Convex dashboard:
 *   npx convex run rateLimit:resetMyCounters '{"userId":"<PROFILE_ID>"}'
 *
 * @internal
 */
export const resetMyCounters = internalMutation({
  args: { userId: v.id("profiles") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      generationsThisMonth: 0,
      ingestionsThisMonth: 0,
      canvasSessionsThisMonth: 0,
      voiceDnaAnalysesThisMonth: 0,
      periodResetAt: Date.now(),
    })
    return { reset: true, at: Date.now() }
  },
})

/**
 * Get the calling user's current usage stats, plan, limits, and remaining.
 * Public query — future Settings page uses this; dashboard can call manually.
 */
export const getMyUsage = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError("Not authenticated")

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()
    if (!profile) throw new ConvexError("Profile not found")

    const plan: Plan = (profile.plan as Plan) ?? "free"
    const limits = PLAN_LIMITS[plan]

    return {
      plan,
      periodResetAt: profile.periodResetAt ?? profile._creationTime,
      usage: {
        generations: {
          current: profile.generationsThisMonth ?? 0,
          limit: limits.generations,
        },
        ingestions: {
          current: profile.ingestionsThisMonth ?? 0,
          limit: limits.ingestions,
        },
        canvasSessions: {
          current: profile.canvasSessionsThisMonth ?? 0,
          limit: limits.canvasSessions,
        },
        voiceDnaAnalyses: {
          current: profile.voiceDnaAnalysesThisMonth ?? 0,
          limit: limits.voiceDnaAnalyses,
        },
      },
    }
  },
})

/**
 * Set the plan tier for a profile.
 * Callable from the Convex dashboard to set Collins's account to "internal":
 *   npx convex run rateLimit:setPlanForProfile '{"userId":"jn729k2d24zd2jrkwj61sqdyv9850fye","plan":"internal"}'
 *
 * @internal
 */
export const setPlanForProfile = internalMutation({
  args: {
    userId: v.id("profiles"),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("team"), v.literal("internal")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { plan: args.plan })
    return { profileId: args.userId, plan: args.plan }
  },
})
