import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

/**
 * List agent-generated posts for a user, filtered by status.
 */
export const list = query({
  args: {
    userId: v.id("profiles"),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("review"),
        v.literal("approved"),
        v.literal("published"),
        v.literal("rejected"),
      ),
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id("agentPosts"),
      _creationTime: v.number(),
      userId: v.id("profiles"),
      agent: v.union(v.literal("authority"), v.literal("catalyst")),
      platform: v.union(v.literal("linkedin"), v.literal("x")),
      title: v.optional(v.string()),
      body: v.string(),
      sourceContentIds: v.array(v.id("contentItems")),
      status: v.union(
        v.literal("draft"),
        v.literal("review"),
        v.literal("approved"),
        v.literal("published"),
        v.literal("rejected"),
      ),
      scheduledAt: v.optional(v.number()),
      publishedAt: v.optional(v.number()),
      publishedUrl: v.optional(v.string()),
      feedback: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("agentPosts")
        .withIndex("by_user_and_status", (q) =>
          q.eq("userId", args.userId).eq("status", args.status!),
        )
        .order("desc")
        .collect()
    }

    return await ctx.db
      .query("agentPosts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()
  },
})

/**
 * Approve or reject a post from the review queue.
 */
export const updateStatus = mutation({
  args: {
    postId: v.id("agentPosts"),
    status: v.union(
      v.literal("approved"),
      v.literal("rejected"),
    ),
    feedback: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, {
      status: args.status,
      feedback: args.feedback,
    })
    return null
  },
})

/**
 * Delete a post.
 */
export const remove = mutation({
  args: { postId: v.id("agentPosts") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.postId)
    return null
  },
})
