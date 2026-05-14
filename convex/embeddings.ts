import { internalMutation, internalQuery } from "./_generated/server"
import { v } from "convex/values"

/**
 * Store an embedding vector for a content item in the dedicated embeddings table.
 * Idempotent: if a row already exists for this contentItemId, it is replaced.
 */
export const storeEmbedding = internalMutation({
  args: {
    contentItemId: v.id("contentItems"),
    userId: v.id("profiles"),
    vector: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    // Check if an embedding already exists for this content item
    const existing = await ctx.db
      .query("embeddings")
      .withIndex("by_content_item", (q) => q.eq("contentItemId", args.contentItemId))
      .unique()

    if (existing) {
      // Replace the existing embedding
      await ctx.db.replace(existing._id, {
        contentItemId: args.contentItemId,
        userId: args.userId,
        vector: args.vector,
        createdAt: Date.now(),
      })
      return existing._id
    }

    // Insert new embedding
    return await ctx.db.insert("embeddings", {
      contentItemId: args.contentItemId,
      userId: args.userId,
      vector: args.vector,
      createdAt: Date.now(),
    })
  },
})

/**
 * Get the embedding row for a given content item.
 * Returns the full embedding document or null.
 */
export const getEmbeddingForContentItem = internalQuery({
  args: { contentItemId: v.id("contentItems") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("embeddings")
      .withIndex("by_content_item", (q) => q.eq("contentItemId", args.contentItemId))
      .unique()
  },
})

/**
 * Delete the embedding row for a content item.
 * Called when a content item is deleted from the library.
 *
 * @internal — scheduled from content.remove.
 */
export const deleteEmbeddingForContentItem = internalMutation({
  args: { contentItemId: v.id("contentItems") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("embeddings")
      .withIndex("by_content_item", (q) => q.eq("contentItemId", args.contentItemId))
      .unique()

    if (existing) {
      await ctx.db.delete(existing._id)
      console.log(`[embeddings] Deleted embedding for content item ${args.contentItemId}`)
    }
  },
})

/**
 * Internal query helper to read content item data for migration.
 */
export const getContentItemForMigration = internalQuery({
  args: { contentItemId: v.id("contentItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.contentItemId)
    if (!item) return null
    return {
      _id: item._id,
      userId: item.userId,
      embeddingId: item.embeddingId,
    }
  },
})

/**
 * Internal query to list all content items for a user (for backfill/migration).
 */
export const listContentItemIdsForUser = internalQuery({
  args: { userId: v.id("profiles") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("contentItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
    return items.map((item) => ({
      _id: item._id,
      embeddingId: item.embeddingId,
    }))
  },
})

/**
 * Internal query to list ALL content item IDs across all users (for full backfill).
 */
export const listAllContentItemIds = internalQuery({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("contentItems").collect()
    return items.map((item) => ({
      _id: item._id,
      userId: item.userId,
      embeddingId: item.embeddingId,
    }))
  },
})
