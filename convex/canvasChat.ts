"use node"

import { action } from "./_generated/server"
import { internal } from "./_generated/api"
import { v } from "convex/values"
import { ConvexError } from "convex/values"

/**
 * Send a message to the Canvas AI agent.
 * Reads source context, generates Claude response, persists both messages.
 */
export const sendMessage = action({
  args: {
    sessionId: v.id("canvasSessions"),
    message: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError("Not authenticated")

    // 1. Get session data
    const session = await ctx.runQuery(internal.canvasChatHelpers.getSessionForChat, {
      sessionId: args.sessionId,
      clerkId: identity.subject,
    })
    if (!session) throw new ConvexError("Session not found")

    // 2. Get source content for context
    const sourceContext = await ctx.runQuery(internal.canvasChatHelpers.getSourceTexts, {
      sourceIds: session.sourceIds,
    })

    // 3. Get voice profile for persona context
    const profile = await ctx.runQuery(internal.helpers.getProfileByClerkId, {
      clerkId: identity.subject,
    })
    const displayName = profile?.name ?? "the user"

    let voiceContext = ""
    if (profile?.voiceProfile?.style) {
      try {
        const vp = JSON.parse(profile.voiceProfile.style)
        const traits: string[] = []
        if (vp.storytelling >= 60) traits.push("storytelling")
        if (vp.technical >= 60) traits.push("technical depth")
        if (vp.provocative >= 60) traits.push("provocative takes")
        if (vp.datadriven >= 60) traits.push("data-driven arguments")
        const top2 = traits.slice(0, 2).join(" and ") || "clarity and directness"
        voiceContext = `\n\nVoice context for ${displayName}:\n${vp.writingPersona ?? "Professional communicator"}\nLean toward: ${top2}`
      } catch {
        // Voice profile unparseable, skip
      }
    }

    // 4. Build conversation history for Claude
    const history = session.chatHistory ?? []
    const claudeMessages: Array<{ role: "user" | "assistant"; content: string }> = []

    for (const msg of history) {
      claudeMessages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })
    }

    // Add the new user message
    claudeMessages.push({ role: "user", content: args.message })

    // 5. Build system prompt
    const systemPrompt = `You are The Authority, a LinkedIn content strategist working with ${displayName} to develop original content from their research.

Your job is to be a sharp, focused creative collaborator — not an analyst, not an explainer, not a summariser. You help the user find angles, test ideas, and eventually draft content.

RULES:
- Respond conversationally. Short paragraphs, plain language.
- NEVER use markdown formatting in your responses. No asterisks, no bold, no bullet points with dashes, no headers with ##. Write in plain prose only.
- NEVER comment on the quality, completeness, or credibility of sources. Work with what you have — always.
- NEVER say things like "this appears to be", "I should note that", "it's worth mentioning", "as an AI". Just respond.
- Keep responses under 120 words unless you are drafting actual post content.
- When asked for angles or ideas, give 2-3 specific, opinionated options. Not vague suggestions — concrete angles with a point of view.
- When asked to draft content, write the full draft. No preamble, no explanation after. Just the draft.
- Match the energy of the conversation. If the user is exploring, explore with them. If they want a draft, deliver it clean.

The user has loaded these research sources:

${sourceContext}${voiceContext}`

    // 6. Call Claude
    const Anthropic = (await import("@anthropic-ai/sdk")).default
    const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

    const response = await claude.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: systemPrompt,
      messages: claudeMessages,
    })

    const textBlock = response.content.find(
      (block: { type: string }) => block.type === "text"
    )
    const agentResponse = textBlock && "text" in textBlock
      ? (textBlock as { text: string }).text
      : "Sorry, I couldn't generate a response. Please try again."

    // 7. Persist both messages
    await ctx.runMutation(internal.helpers.appendCanvasMessages, {
      sessionId: args.sessionId,
      userMessage: args.message,
      agentResponse,
      timestamp: Date.now(),
    })

    return agentResponse
  },
})
