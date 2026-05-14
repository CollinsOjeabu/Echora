import { internalMutation } from "./_generated/server"
import { v } from "convex/values"
import { gateMutation } from "./lib/rateLimit"
import type { RateLimitResource } from "./lib/rateLimits"

/**
 * Internal mutation wrapper for gateMutation.
 * Actions call this via ctx.runMutation to perform atomic read-check-increment.
 * The gate function handles all plan checks, opportunistic resets, and logging.
 */
export const checkAndIncrementCounter = internalMutation({
  args: {
    profileId: v.id("profiles"),
    resource: v.string(),
  },
  handler: async (ctx, args) => {
    const resource = args.resource as RateLimitResource
    await gateMutation(ctx, args.profileId, resource)
  },
})
