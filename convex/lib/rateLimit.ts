import { ConvexError } from "convex/values"
import {
  PLAN_LIMITS,
  ONE_MONTH_MS,
  RESOURCE_TO_FIELD,
  type Plan,
  type RateLimitResource,
  type RateLimitError,
} from "./rateLimits"
import type { Id } from "../_generated/dataModel"
import type { MutationCtx } from "../_generated/server"

// ──────────────────────────────────────────────────────────────────────────────
// Gate for mutations (has direct ctx.db access)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Rate-limit gate for use inside mutation handlers.
 * Checks plan limits, performs opportunistic reset, increments counter.
 * Throws ConvexError with RateLimitError payload if limit exceeded.
 */
export async function gateMutation(
  ctx: MutationCtx,
  profileId: Id<"profiles">,
  resource: RateLimitResource,
): Promise<void> {
  // Escape hatch 1: dev bypass
  if (process.env.RATE_LIMIT_DEV_BYPASS === "true") {
    console.log(`[rateLimit] BYPASS: dev flag set`)
    return
  }

  const profile = await ctx.db.get(profileId)
  if (!profile) {
    throw new ConvexError({ code: "NOT_FOUND", message: "Profile not found" })
  }

  // Resolve effective plan
  const plan: Plan = (profile.plan as Plan) ?? "free"

  // Escape hatch 2: internal plan
  if (plan === "internal") {
    console.log(`[rateLimit] BYPASS: internal plan, profile ${profileId}`)
    return
  }

  const limits = PLAN_LIMITS[plan]
  const limit = limits[resource]

  // Opportunistic period reset
  const periodResetAt = profile.periodResetAt ?? profile._creationTime
  if (Date.now() - periodResetAt > ONE_MONTH_MS) {
    await ctx.db.patch(profileId, {
      generationsThisMonth: 0,
      ingestionsThisMonth: 0,
      canvasSessionsThisMonth: 0,
      voiceDnaAnalysesThisMonth: 0,
      periodResetAt: Date.now(),
    })
    console.log(`[rateLimit] RESET: counters reset for profile ${profileId} (period elapsed)`)
    // After reset, current count is 0
    await ctx.db.patch(profileId, {
      [RESOURCE_TO_FIELD[resource]]: 1,
    })
    console.log(`[rateLimit] PASS: profile ${profileId} ${resource} 1/${limit}`)
    return
  }

  // Read current counter
  const fieldName = RESOURCE_TO_FIELD[resource]
  const current = (profile[fieldName as keyof typeof profile] as number | undefined) ?? 0

  // Check limit
  if (current >= limit) {
    const error: RateLimitError = {
      code: "RATE_LIMIT_EXCEEDED",
      resource,
      current,
      limit,
      plan,
      resetAt: periodResetAt + ONE_MONTH_MS,
    }
    console.log(`[rateLimit] BLOCKED: profile ${profileId} ${resource} ${current}/${limit} on plan ${plan}`)
    throw new ConvexError(error)
  }

  // Increment counter (absolute value, not delta, for idempotency on retry)
  const newCount = current + 1
  await ctx.db.patch(profileId, {
    [fieldName]: newCount,
  })
  console.log(`[rateLimit] PASS: profile ${profileId} ${resource} ${newCount}/${limit}`)
}
