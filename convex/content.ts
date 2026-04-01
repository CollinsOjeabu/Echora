import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { ConvexError } from "convex/values"

/**
 * List content items for a user, optionally filtered by type.
 */
export const list = query({
  args: {
    userId: v.id("profiles"),
    type: v.optional(
      v.union(
        v.literal("article"),
        v.literal("video"),
        v.literal("note"),
        v.literal("tweet"),
        v.literal("pdf"),
      ),
    ),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("contentItems"),
      _creationTime: v.number(),
      userId: v.id("profiles"),
      type: v.union(
        v.literal("article"),
        v.literal("video"),
        v.literal("note"),
        v.literal("tweet"),
        v.literal("pdf"),
      ),
      title: v.string(),
      url: v.optional(v.string()),
      rawText: v.optional(v.string()),
      summary: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      embeddingId: v.optional(v.string()),
      status: v.union(
        v.literal("queued"),
        v.literal("processing"),
        v.literal("ready"),
        v.literal("error"),
      ),
      errorMessage: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50

    if (args.type) {
      return await ctx.db
        .query("contentItems")
        .withIndex("by_user_and_type", (q) =>
          q.eq("userId", args.userId).eq("type", args.type!),
        )
        .order("desc")
        .take(limit)
    }

    return await ctx.db
      .query("contentItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit)
  },
})

/**
 * Create a new content item (manual note, or queued URL for scraping).
 */
export const create = mutation({
  args: {
    userId: v.id("profiles"),
    type: v.union(
      v.literal("article"),
      v.literal("video"),
      v.literal("note"),
      v.literal("tweet"),
      v.literal("pdf"),
    ),
    title: v.string(),
    url: v.optional(v.string()),
    rawText: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.id("contentItems"),
  handler: async (ctx, args) => {
    if (args.title.trim().length === 0) {
      throw new ConvexError({ code: "VALIDATION", message: "Title is required" })
    }

    const isNote = args.type === "note"
    return await ctx.db.insert("contentItems", {
      userId: args.userId,
      type: args.type,
      title: args.title.trim(),
      url: args.url,
      rawText: args.rawText,
      tags: args.tags,
      status: isNote ? "ready" : "queued",
    })
  },
})

/**
 * Delete a content item by its ID.
 */
export const remove = mutation({
  args: { contentId: v.id("contentItems") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.contentId)
    return null
  },
})

/**
 * Search content items by title.
 */
export const search = query({
  args: {
    userId: v.id("profiles"),
    query: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("contentItems"),
      _creationTime: v.number(),
      userId: v.id("profiles"),
      type: v.union(
        v.literal("article"),
        v.literal("video"),
        v.literal("note"),
        v.literal("tweet"),
        v.literal("pdf"),
      ),
      title: v.string(),
      url: v.optional(v.string()),
      rawText: v.optional(v.string()),
      summary: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      embeddingId: v.optional(v.string()),
      status: v.union(
        v.literal("queued"),
        v.literal("processing"),
        v.literal("ready"),
        v.literal("error"),
      ),
      errorMessage: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contentItems")
      .withSearchIndex("search_content", (q) =>
        q.search("title", args.query).eq("userId", args.userId),
      )
      .take(20)
  },
})
