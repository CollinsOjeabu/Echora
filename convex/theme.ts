import { mutation, query } from "./_generated/server"
import { v, ConvexError } from "convex/values"

/**
 * Get the authenticated user's theme preference.
 * Returns "void" if no theme is set (default).
 */
export const getMyTheme = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return "void"

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()
    if (!profile) return "void"

    return profile.theme ?? "void"
  },
})

/**
 * Set the authenticated user's theme preference.
 * Idempotent — last write wins.
 */
export const setMyTheme = mutation({
  args: {
    theme: v.union(v.literal("void"), v.literal("dark"), v.literal("light")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" })
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()
    if (!profile) {
      throw new ConvexError({ code: "PROFILE_NOT_FOUND", message: "Profile not found" })
    }

    await ctx.db.patch(profile._id, { theme: args.theme })
    return { theme: args.theme }
  },
})
