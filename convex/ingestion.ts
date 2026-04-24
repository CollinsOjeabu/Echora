"use node"

import { action } from "./_generated/server"
import { internal } from "./_generated/api"
import { v } from "convex/values"
import { ConvexError } from "convex/values"
import type { Id } from "./_generated/dataModel"

/**
 * Full URL → content ingestion pipeline.
 * Firecrawl scrape → Claude summarization → OpenAI embedding → Convex storage.
 */
export const startIngestion = action({
  args: {
    url: v.string(),
    userId: v.id("profiles"),
  },
  handler: async (ctx, args): Promise<{ success: boolean; title: string; summary: string; itemId: Id<"contentItems"> }> => {
    // Step 1: Validate URL
    let parsedUrl: URL
    try {
      parsedUrl = new URL(args.url)
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol")
      }
    } catch {
      throw new ConvexError("Invalid URL. Must start with http:// or https://")
    }

    // Step 2: Scrape with Firecrawl v2 API
    const Firecrawl = (await import("@mendable/firecrawl-js")).default
    const firecrawl = new Firecrawl({
      apiKey: process.env.FIRECRAWL_API_KEY!,
    })

    let scrapeResult: { markdown?: string; metadata?: { title?: string } }
    try {
      scrapeResult = await firecrawl.scrape(args.url, {
        formats: ["markdown"],
        onlyMainContent: true,
      })
    } catch {
      throw new ConvexError(`Failed to scrape URL: ${args.url}`)
    }

    // Step 3: Extract title and text
    const title =
      scrapeResult.metadata?.title ||
      scrapeResult.markdown?.match(/^#\s+(.+)/m)?.[1] ||
      parsedUrl.hostname
    const rawText = (scrapeResult.markdown || "").slice(0, 8000)

    if (!rawText || rawText.trim().length < 20) {
      throw new ConvexError("No meaningful content found at that URL")
    }

    // Step 4: Summarize with Claude
    let summary = ""
    try {
      const Anthropic = (await import("@anthropic-ai/sdk")).default
      const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

      const summaryResult = await claude.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system:
          "You are a research assistant. Extract the key insight from this article in 2-3 sentences. Be specific and factual. Focus on what is novel or actionable. Return only the summary, no preamble.",
        messages: [
          { role: "user", content: rawText.slice(0, 6000) },
        ],
      })

      const textBlock = summaryResult.content.find(
        (block: { type: string }) => block.type === "text",
      )
      summary = textBlock && "text" in textBlock ? (textBlock as { text: string }).text : ""
    } catch (e) {
      // Partial failure — save without summary
      console.error("Claude summarization failed:", e)
    }

    // Step 5: Generate embedding via OpenAI
    let embeddingStr = ""
    try {
      const OpenAI = (await import("openai")).default
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

      const embeddingResult = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: summary || rawText.slice(0, 2000),
      })

      const embedding = embeddingResult.data[0].embedding
      embeddingStr = JSON.stringify(embedding)
    } catch (e) {
      // Partial failure — save without embedding
      console.error("OpenAI embedding failed:", e)
    }

    // Step 6: Store in Convex
    const itemId: Id<"contentItems"> = await ctx.runMutation(internal.helpers.saveContentItem, {
      userId: args.userId,
      url: args.url,
      title: String(title).slice(0, 200),
      rawText,
      summary,
      embeddingId: embeddingStr,
    })

    return { success: true, title: String(title), summary, itemId }
  },
})

/**
 * Get the ingestion status of a content item.
 */
export const getIngestionStatus = action({
  args: { itemId: v.id("contentItems") },
  handler: async (ctx, args): Promise<{ status: string; errorMessage?: string } | null> => {
    const item: { status: string; errorMessage?: string } | null = await ctx.runQuery(internal.helpers.getItemStatus, {
      itemId: args.itemId,
    })
    return item
  },
})
