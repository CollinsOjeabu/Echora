"use node"

import { internalAction } from "./_generated/server"
import { internal } from "./_generated/api"
import { v } from "convex/values"

/**
 * Compute graph edges for a single content item by finding its nearest
 * neighbors via Convex vector search.
 *
 * For each neighbor with similarity >= 0.7, an edge is upserted into graphEdges.
 * This is fire-and-forget — failure does not break ingestion.
 *
 * @internal — called from the ingestion pipeline and from backfillEdgesForUser.
 */
export const computeEdgesForSource = internalAction({
  args: { contentItemId: v.id("contentItems") },
  handler: async (ctx, args): Promise<{ skipped: true; reason: string } | { skipped: false; candidates: number; edgesUpserted: number }> => {
    // 1. Fetch this item's embedding
    const embedding = await ctx.runQuery(internal.embeddings.getEmbeddingForContentItem, {
      contentItemId: args.contentItemId,
    })

    if (!embedding) {
      console.log(`[computeEdges] No embedding found for ${args.contentItemId}, skipping`)
      return { skipped: true, reason: "no_embedding" }
    }

    // 2. Vector search for nearest neighbors (same user)
    const results = await ctx.vectorSearch("embeddings", "by_user", {
      vector: embedding.vector,
      limit: 50,
      filter: (q) => q.eq("userId", embedding.userId),
    })

    // 3. Process results — upsert edges for similar items
    let edgesUpserted = 0

    for (const result of results) {
      // Skip self-match
      if (result._id === embedding._id) continue

      // Skip low similarity (Convex _score uses cosine similarity, range -1 to 1)
      if (result._score < 0.7) continue

      // Fetch the matched embedding to get its contentItemId
      const matchedEmbedding = await ctx.runQuery(internal.graphComputeHelpers.getEmbeddingById, {
        embeddingId: result._id,
      })

      if (!matchedEmbedding) continue

      // Upsert the edge
      const edgeId = await ctx.runMutation(internal.graphEdges.upsertEdge, {
        userId: embedding.userId,
        sourceIdA: args.contentItemId,
        sourceIdB: matchedEmbedding.contentItemId,
        similarity: result._score,
      })

      if (edgeId) {
        edgesUpserted++
      }
    }

    console.log(
      `[computeEdges] Content item ${args.contentItemId}: ` +
      `${results.length} candidates, ${edgesUpserted} edges upserted`
    )

    return {
      skipped: false,
      candidates: results.length,
      edgesUpserted,
    }
  },
})

/**
 * Backfill graph edges for all content items belonging to a user.
 * Iterates all items, runs computeEdgesForSource for each.
 * Safe to run multiple times (idempotent via upsertEdge).
 *
 * Invoke from the Convex dashboard:
 *   npx convex run graphCompute:backfillEdgesForUser '{"userId":"<USER_ID>"}'
 *
 * @internal
 */
export const backfillEdgesForUser = internalAction({
  args: { userId: v.id("profiles") },
  handler: async (ctx, args): Promise<{ sourcesProcessed: number; totalEdges: number; errors: number; totalItems: number }> => {
    // 1. List all content items for this user
    const items = await ctx.runQuery(internal.embeddings.listContentItemIdsForUser, {
      userId: args.userId,
    })

    let sourcesProcessed = 0
    let totalEdges = 0
    let errors = 0

    console.log(`[backfill] Starting edge backfill for user ${args.userId}: ${items.length} content items`)

    for (const item of items) {
      try {
        const result = await ctx.runAction(internal.graphCompute.computeEdgesForSource, {
          contentItemId: item._id as any,
        })

        sourcesProcessed++

        if (!result.skipped) {
          totalEdges += result.edgesUpserted ?? 0
        }
      } catch (e) {
        console.error(`[backfill] Error computing edges for ${item._id}:`, e)
        errors++
      }

      // Log progress every 10 items
      if (sourcesProcessed % 10 === 0) {
        console.log(`[backfill] Progress: ${sourcesProcessed}/${items.length} processed, ${totalEdges} edges, ${errors} errors`)
      }
    }

    const summary = { sourcesProcessed, totalEdges, errors, totalItems: items.length }
    console.log(`[backfill] Complete:`, summary)
    return summary
  },
})
