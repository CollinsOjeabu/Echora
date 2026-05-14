import { internalQuery } from "./_generated/server"
import { v } from "convex/values"

/**
 * Internal query to fetch an embedding document by its _id.
 * Needed because vectorSearch returns _id + _score but not the document.
 * Separated from graphCompute.ts because queries cannot run in Node.js runtime.
 */
export const getEmbeddingById = internalQuery({
  args: { embeddingId: v.id("embeddings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.embeddingId)
  },
})

/**
 * Verification query — run from the Convex dashboard to confirm Sprint 1 worked.
 *
 *   npx convex run graphComputeHelpers:verifyGraphEdges '{"userId":"<USER_ID>"}'
 *
 * @internal
 */
export const verifyGraphEdges = internalQuery({
  args: { userId: v.id("profiles") },
  handler: async (ctx, args) => {
    const contentItems = await ctx.db
      .query("contentItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    const embeddings = await ctx.db
      .query("embeddings")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect()

    const edges = await ctx.db
      .query("graphEdges")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    const similarities = edges.map((e) => e.similarity)

    return {
      contentItems: contentItems.length,
      embeddings: embeddings.length,
      edges: edges.length,
      avgEdgesPerSource: contentItems.length > 0
        ? Math.round(((edges.length * 2) / contentItems.length) * 100) / 100
        : 0,
      similarityStats: similarities.length > 0
        ? {
            min: Math.round(Math.min(...similarities) * 1000) / 1000,
            max: Math.round(Math.max(...similarities) * 1000) / 1000,
            avg: Math.round((similarities.reduce((a, b) => a + b, 0) / similarities.length) * 1000) / 1000,
          }
        : { min: 0, max: 0, avg: 0 },
    }
  },
})
