import { internalMutation, internalQuery, query } from "./_generated/server"
import { v } from "convex/values"

/**
 * Internal mutation to save a scraped + processed content item.
 * Called from the ingestion action.
 */
export const saveContentItem = internalMutation({
  args: {
    userId: v.id("profiles"),
    url: v.string(),
    title: v.string(),
    rawText: v.string(),
    summary: v.string(),
    embeddingId: v.string(),
  },
  returns: v.id("contentItems"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("contentItems", {
      userId: args.userId,
      type: "article",
      title: args.title,
      url: args.url,
      rawText: args.rawText,
      summary: args.summary || undefined,
      embeddingId: args.embeddingId || undefined,
      status: "ready",
    })
  },
})

/**
 * Internal query to get item status (for ingestion polling).
 */
export const getItemStatus = internalQuery({
  args: { itemId: v.id("contentItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId)
    if (!item) return null
    return { status: item.status, errorMessage: item.errorMessage }
  },
})

/**
 * Internal query to get profile by Clerk ID.
 * Used by voiceDna and ingestion actions.
 */
export const getProfileByClerkId = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique()
  },
})

/**
 * Internal mutation to save voice profile JSON string.
 */
export const saveVoiceProfile = internalMutation({
  args: {
    clerkId: v.string(),
    voiceProfile: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique()

    if (!profile) return null

    await ctx.db.patch(profile._id, {
      voiceProfile: {
        tone: "analyzed",
        style: args.voiceProfile,
      },
    })
    return null
  },
})

/**
 * Internal mutation to append chat messages to a canvas session.
 */
export const appendCanvasMessages = internalMutation({
  args: {
    sessionId: v.id("canvasSessions"),
    userMessage: v.string(),
    agentResponse: v.string(),
    timestamp: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId)
    if (!session) return null

    const history = session.chatHistory ?? []
    history.push(
      { role: "user", content: args.userMessage, timestamp: args.timestamp },
      { role: "agent", content: args.agentResponse, timestamp: args.timestamp + 1 },
    )

    await ctx.db.patch(args.sessionId, {
      chatHistory: history,
      lastOpenedAt: Date.now(),
    })
    return null
  },
})

/**
 * Get the current user's voice profile (parsed from JSON).
 * Public query — used by the Settings page.
 */
export const getVoiceProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()

    if (!profile?.voiceProfile?.style) return null

    try {
      return JSON.parse(profile.voiceProfile.style)
    } catch {
      return null
    }
  },
})
