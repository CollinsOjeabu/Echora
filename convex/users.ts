import { query, mutation, internalMutation } from "./_generated/server"
import { v } from "convex/values"

/**
 * Get the current user's profile by their Clerk ID.
 * Called on every authenticated page load.
 */
export const getByClerkId = query({
  args: { clerkId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("profiles"),
      _creationTime: v.number(),
      clerkId: v.string(),
      email: v.string(),
      name: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      plan: v.union(v.literal("free"), v.literal("pro"), v.literal("team")),
      onboardedAt: v.optional(v.number()),
      voiceProfile: v.optional(
        v.object({
          tone: v.optional(v.string()),
          style: v.optional(v.string()),
          samplePostIds: v.optional(v.array(v.string())),
        }),
      ),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique()
  },
})

/**
 * Ensure a profile exists for the current Clerk user.
 * Called client-side by the useCurrentUser hook on first dashboard visit.
 * Idempotent — does nothing if profile already exists.
 */
export const ensureProfile = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  returns: v.id("profiles"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique()

    if (existing) {
      return existing._id
    }

    return await ctx.db.insert("profiles", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      plan: "free",
    })
  },
})

/**
 * Upsert profile from Clerk webhook (user.created / user.updated).
 * Internal — only callable from other Convex functions (e.g. HTTP webhook handler).
 */
export const upsertFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  returns: v.id("profiles"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        avatarUrl: args.avatarUrl,
      })
      return existing._id
    }

    return await ctx.db.insert("profiles", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      plan: "free",
    })
  },
})

/**
 * Delete profile from Clerk webhook (user.deleted).
 * Internal only.
 */
export const deleteByClerkId = internalMutation({
  args: { clerkId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique()

    if (profile) {
      await ctx.db.delete(profile._id)
    }
    return null
  },
})

/**
 * Update voice profile settings.
 * Called from the Settings page.
 */
export const updateVoiceProfile = mutation({
  args: {
    profileId: v.id("profiles"),
    voiceProfile: v.object({
      tone: v.optional(v.string()),
      style: v.optional(v.string()),
      samplePostIds: v.optional(v.array(v.string())),
    }),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, {
      voiceProfile: args.voiceProfile,
    })
    return null
  },
})
