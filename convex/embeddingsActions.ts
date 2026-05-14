"use node"

import { internalAction } from "./_generated/server"
import { internal } from "./_generated/api"
import { v } from "convex/values"

/**
 * Migrate a single content item's legacy JSON-string embedding to the new embeddings table.
 * Reads embeddingId from contentItems, parses the JSON, writes to the embeddings table.
 * Does NOT delete the legacy field — Sprint 6 cleanup.
 */
export const migrateJsonEmbeddingToTable = internalAction({
  args: { contentItemId: v.id("contentItems") },
  handler: async (ctx, args) => {
    // 1. Read the content item to get the legacy embedding
    const item = await ctx.runQuery(internal.embeddings.getContentItemForMigration, {
      contentItemId: args.contentItemId,
    })

    if (!item) {
      console.log(`[migrate] Content item ${args.contentItemId} not found, skipping`)
      return { status: "skipped", reason: "not_found" }
    }

    if (!item.embeddingId) {
      console.log(`[migrate] Content item ${args.contentItemId} has no embeddingId, skipping`)
      return { status: "skipped", reason: "no_embedding" }
    }

    // 2. Check if already migrated
    const existing = await ctx.runQuery(internal.embeddings.getEmbeddingForContentItem, {
      contentItemId: args.contentItemId,
    })

    if (existing) {
      console.log(`[migrate] Content item ${args.contentItemId} already has embedding in new table, skipping`)
      return { status: "skipped", reason: "already_migrated" }
    }

    // 3. Parse the JSON-string embedding
    let vector: number[]
    try {
      vector = JSON.parse(item.embeddingId)
      if (!Array.isArray(vector) || vector.length !== 1536) {
        console.error(`[migrate] Content item ${args.contentItemId} has invalid embedding (length: ${Array.isArray(vector) ? vector.length : "not_array"})`)
        return { status: "error", reason: "invalid_vector" }
      }
    } catch (e) {
      console.error(`[migrate] Content item ${args.contentItemId} has unparseable embeddingId:`, e)
      return { status: "error", reason: "parse_error" }
    }

    // 4. Store in the new table
    await ctx.runMutation(internal.embeddings.storeEmbedding, {
      contentItemId: args.contentItemId,
      userId: item.userId,
      vector,
    })

    console.log(`[migrate] Successfully migrated embedding for content item ${args.contentItemId}`)
    return { status: "migrated" }
  },
})

/**
 * Batch migrate all legacy JSON embeddings to the new embeddings table.
 * Optionally filtered by userId. Safe to run multiple times (idempotent).
 * Logs progress: migrated, skipped, errors.
 *
 * Invoke from the Convex dashboard:
 *   npx convex run embeddingsActions:migrateAllJsonEmbeddings '{}'
 *   npx convex run embeddingsActions:migrateAllJsonEmbeddings '{"userId":"<USER_ID>"}'
 */
export const migrateAllJsonEmbeddings = internalAction({
  args: {
    userId: v.optional(v.id("profiles")),
  },
  handler: async (ctx, args) => {
    // 1. Get all content items (optionally filtered by user)
    let items: Array<{ _id: string; userId?: string; embeddingId?: string }>

    if (args.userId) {
      items = await ctx.runQuery(internal.embeddings.listContentItemIdsForUser, {
        userId: args.userId,
      })
    } else {
      items = await ctx.runQuery(internal.embeddings.listAllContentItemIds, {})
    }

    let migrated = 0
    let skipped = 0
    let errors = 0

    console.log(`[migrateAll] Starting migration of ${items.length} content items`)

    for (const item of items) {
      try {
        const result = await ctx.runAction(internal.embeddingsActions.migrateJsonEmbeddingToTable, {
          contentItemId: item._id as any,
        })

        if (result.status === "migrated") migrated++
        else if (result.status === "skipped") skipped++
        else errors++
      } catch (e) {
        console.error(`[migrateAll] Error migrating ${item._id}:`, e)
        errors++
      }
    }

    const summary = { migrated, skipped, errors, total: items.length }
    console.log(`[migrateAll] Complete:`, summary)
    return summary
  },
})
