import { internalMutation } from "./_generated/server"

/**
 * One-shot migration: converts old voiceProfile {style, tone} format
 * to the new typed object format, and resets canvasSessionsThisMonth.
 *
 * Run once via Convex dashboard: internalMutation "migrations:migrateVoiceProfiles"
 */
export const migrateVoiceProfiles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect()
    let migrated = 0

    for (const profile of profiles) {
      const vp = profile.voiceProfile as Record<string, unknown> | undefined
      if (!vp) continue

      // Check if it has the old {style, tone} shape
      if (typeof vp.style === "string" || typeof vp.tone === "string") {
        let parsed: Record<string, unknown> = {}

        // Try to parse the JSON blob from `style`
        if (typeof vp.style === "string") {
          try {
            parsed = JSON.parse(vp.style) as Record<string, unknown>
          } catch {
            // Not valid JSON — clear it
            parsed = {}
          }
        }

        // Build the new typed voiceProfile
        const newProfile: Record<string, unknown> = {}
        const numberFields = [
          "storytelling", "technical", "provocative", "datadriven",
          "formality", "avgSentenceLength", "trainingPostCount", "trainedAt",
        ]
        const stringFields = ["emojiUsage", "writingPersona", "trainedFrom"]

        for (const f of numberFields) {
          if (typeof parsed[f] === "number") newProfile[f] = parsed[f]
        }
        for (const f of stringFields) {
          if (typeof parsed[f] === "string") newProfile[f] = parsed[f]
        }
        if (typeof parsed.usesQuestions === "boolean") {
          newProfile.usesQuestions = parsed.usesQuestions
        }
        if (Array.isArray(parsed.signaturePhrases)) {
          newProfile.signaturePhrases = parsed.signaturePhrases.filter(
            (s: unknown) => typeof s === "string"
          )
        }

        await ctx.db.patch(profile._id, {
          voiceProfile: newProfile as typeof profile.voiceProfile,
        })
        migrated++
        console.log(`[migration] Migrated voiceProfile for ${profile._id}`)
      }
    }

    // Also reset canvasSessionsThisMonth for all profiles
    for (const profile of profiles) {
      await ctx.db.patch(profile._id, {
        canvasSessionsThisMonth: 0,
      })
    }

    console.log(`[migration] Done. Migrated ${migrated} profiles, reset all session counters.`)
    return { migrated, total: profiles.length }
  },
})
