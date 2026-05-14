/**
 * Rate limit constants and types.
 * Pure constants — no Convex imports.
 */

export type Plan = "free" | "pro" | "team" | "internal";

export const UNLIMITED = Number.POSITIVE_INFINITY;

export const PLAN_LIMITS: Record<Plan, {
  generations: number;
  ingestions: number;
  canvasSessions: number;
  voiceDnaAnalyses: number;
}> = {
  free:     { generations: 5,   ingestions: 10,        canvasSessions: 25,        voiceDnaAnalyses: 1 },
  pro:      { generations: 50,  ingestions: 100,       canvasSessions: UNLIMITED, voiceDnaAnalyses: 10 },
  team:     { generations: 200, ingestions: UNLIMITED, canvasSessions: UNLIMITED, voiceDnaAnalyses: UNLIMITED },
  internal: { generations: UNLIMITED, ingestions: UNLIMITED, canvasSessions: UNLIMITED, voiceDnaAnalyses: UNLIMITED },
};

export const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export type RateLimitResource = "generations" | "ingestions" | "canvasSessions" | "voiceDnaAnalyses";

export type RateLimitError = {
  code: "RATE_LIMIT_EXCEEDED";
  resource: RateLimitResource;
  current: number;
  limit: number;
  plan: Plan;
  resetAt: number;
};

/**
 * Map from resource name to the profile field that stores the counter.
 */
export const RESOURCE_TO_FIELD: Record<RateLimitResource, string> = {
  generations: "generationsThisMonth",
  ingestions: "ingestionsThisMonth",
  canvasSessions: "canvasSessionsThisMonth",
  voiceDnaAnalyses: "voiceDnaAnalysesThisMonth",
};
