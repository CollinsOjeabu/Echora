# Sprint 2 — Reconnaissance Report

**Date:** 2026-04-26
**Scope:** Rate limiting + profile counters + content.remove auth fix

---

## Auth Helper

- **Name:** `internal.helpers.getProfileByClerkId`
- **File:** `convex/helpers.ts:48`
- **Signature:** `internalQuery({ args: { clerkId: v.string() }, handler → profile | null })`
- Usable from actions via `ctx.runQuery(internal.helpers.getProfileByClerkId, { clerkId })`
- For mutations, the inline pattern `ctx.db.query("profiles").withIndex("by_clerk_id", ...).unique()` is used everywhere

## Function Signatures to Gate

| Function | File | Type | Resource | Profile access |
|---|---|---|---|---|
| `sendMessage` | `canvasChat.ts:12` | `action` | generations | `internal.helpers.getProfileByClerkId` at line 34 |
| `generatePost` | `generation.ts:109` | `action` | generations | `internal.helpers.getProfileByClerkId` at line 133 |
| `regeneratePost` | `generation.ts:238` | `action` | generations | `internal.helpers.getProfileByClerkId` at line 248 |
| `analyzeManualSamples` | `voiceDna.ts:10` | `action` | voiceDnaAnalyses | `internal.helpers.getProfileByClerkId` at line 17 |
| `startIngestion` | `ingestion.ts:13` | `action` | ingestions | takes `userId` arg directly (no auth) |
| `createSession` | `canvas.ts:8` | `mutation` | canvasSessions | inline clerk lookup at line 18 |
| `getForUser` | `ideas.ts:24` | `action` | generations | takes `userId` arg directly (no auth) |

## Schema Discovery

**SURPRISE:** `profiles.plan` already exists as `v.union(v.literal("free"), v.literal("pro"), v.literal("team"))` — NOT optional, and MISSING `"internal"`.

**Impact:** Must add `v.literal("internal")` to the union. Counter fields are new and should be `v.optional(...)`.

**`users.ts:getByClerkId`** has a `returns` validator that also lists `plan` with 3 literals — must add `"internal"` there too.

## Ownership Audit — Mutations Accepting Foreign-Key IDs

| Mutation | File | Has auth? | Has ownership check? | Risk | Fix |
|---|---|---|---|---|---|
| `content.remove` | `content.ts:149` | ❌ | ❌ | **HIGH** — deletes any item | Sprint 2 ✅ |
| `content.create` | `content.ts:112` | ❌ | N/A — takes `userId` directly | **MEDIUM** — can insert as another user | Sprint 2 ✅ |
| `posts.updateStatus` | `posts.ts:97` | ❌ | ❌ | **HIGH** — changes any post status | Sprint 2 ✅ |
| `posts.remove` | `posts.ts:154` | ❌ | ❌ | **HIGH** — deletes any post | Sprint 2 ✅ |
| `users.updateVoiceProfile` | `users.ts:212` | ❌ | ❌ | **MEDIUM** — modifies any profile's voice | Sprint 2 ✅ |
| `ideas.getForUser` | `ideas.ts:24` | ❌ | N/A — takes `userId` directly | **LOW** — read + Claude call, but no auth | Deferred |
| `content.list` | `content.ts:9` | ❌ | N/A — query, takes `userId` | **LOW** — read-only | Deferred |
| `content.search` | `content.ts:217` | ❌ | N/A — query, takes `userId` | **LOW** — read-only | Deferred |
| `posts.list` | `posts.ts:32` | ❌ | N/A — query, takes `userId` | **LOW** — read-only | Deferred |

## Design Decision

Using **Option A** (all new fields `v.optional(...)`) for counter fields. Existing rows continue to work without backfill. Helpers treat `undefined` as the default value (0 for counters, `Date.now()` for periodResetAt).

---

## Sprint 2 — Outcome

### New Files Created

| File | Purpose |
|------|---------|
| `convex/lib/rateLimits.ts` | Pure constants: plan limits, resource-to-field mapping, types |
| `convex/lib/rateLimit.ts` | `gateMutation()` function for rate-limit checks inside mutations |
| `convex/rateLimitHelpers.ts` | `checkAndIncrementCounter` internalMutation (action gateway to gateMutation) |
| `convex/rateLimit.ts` | Admin utilities: `resetMyCounters`, `getMyUsage`, `setPlanForProfile` |

### Files Modified

| File | Changes |
|------|---------|
| `convex/schema.ts` | Added `"internal"` to plan union; added 5 optional counter fields |
| `convex/users.ts` | Added `"internal"` to `getByClerkId` returns validator; added counter fields to returns; added auth to `updateVoiceProfile` |
| `convex/canvasChat.ts` | Added rate-limit gate (`generations`) to `sendMessage` |
| `convex/generation.ts` | Added rate-limit gate (`generations`) to `generatePost` and `regeneratePost` |
| `convex/voiceDna.ts` | Added rate-limit gate (`voiceDnaAnalyses`) to `analyzeManualSamples` |
| `convex/ingestion.ts` | Added rate-limit gate (`ingestions`) to `startIngestion` |
| `convex/canvas.ts` | Added rate-limit gate (`canvasSessions`) to `createSession`; imported `gateMutation` |
| `convex/content.ts` | Added auth + ownership check to `remove`; added auth check to `create` |
| `convex/posts.ts` | Added auth + ownership check to `updateStatus` and `remove` |

### Schema Changes

#### `profiles` table
- `plan`: `v.union("free", "pro", "team")` → `v.union("free", "pro", "team", "internal")`
- Added (all `v.optional`): `generationsThisMonth`, `ingestionsThisMonth`, `canvasSessionsThisMonth`, `voiceDnaAnalysesThisMonth`, `periodResetAt`

### Ownership Check Audit Results

**Patched this sprint (5 mutations):**
- `content.remove` — was completely unauth'd, now has full auth + ownership
- `content.create` — accepted any `userId`, now verifies caller owns that profile
- `posts.updateStatus` — was completely unauth'd, now has full auth + ownership
- `posts.remove` — was completely unauth'd, now has full auth + ownership
- `users.updateVoiceProfile` — accepted any `profileId`, now verifies caller owns it

**Deferred (4 functions — all LOW risk, read-only or query-based):**
- `ideas.getForUser` — takes `userId` directly, but is a read + Claude call; no data mutation risk
- `content.list` — query, read-only, takes `userId`
- `content.search` — query, read-only, takes `userId`
- `posts.list` — query, read-only, takes `userId`

### Three Escape Hatches — Confirmed Built

1. ✅ `RATE_LIMIT_DEV_BYPASS=true` env var — first line of `gateMutation()`
2. ✅ `internal` plan tier — short-circuits gate, no counter increment
3. ✅ `resetMyCounters` internalMutation in `convex/rateLimit.ts`

### CLI Commands for Collins

**Set profile to internal (run once):**
```bash
npx convex run rateLimit:setPlanForProfile '{"userId":"jn729k2d24zd2jrkwj61sqdyv9850fye","plan":"internal"}'
```

**View current usage:**
```bash
npx convex run rateLimit:getMyUsage '{}'
```

**Reset counters manually:**
```bash
npx convex run rateLimit:resetMyCounters '{"userId":"jn729k2d24zd2jrkwj61sqdyv9850fye"}'
```

### Deviations from Prompt

1. **`profiles.plan` was NOT optional.** Prompt assumed it didn't exist; it was already a required field with 3 literals. Added `"internal"` to the existing union instead of creating it from scratch.
2. **`users.ts:getByClerkId` returns validator.** Had to add `"internal"` + counter fields there too — the prompt didn't mention this but it would have caused runtime validation errors.
3. **File split for gate.** Prompt specified `convex/lib/rateLimit.ts` for gate functions + the internalMutation helper. But Convex doesn't register `lib/` files as function modules, so the `internalMutation` was placed in `convex/rateLimitHelpers.ts` instead. The pure `gateMutation()` function stays in `convex/lib/rateLimit.ts` as specified.
4. **`content.create` auth fix.** Not explicitly listed in the prompt's Step 9/10 but identified during recon as MEDIUM risk. Fixed proactively.
5. **`ideas.getForUser` gate skipped.** The prompt listed this in Step 4/5 scope but it has no auth pattern to attach to (takes raw `userId`). Adding auth would require changing its public API contract. Deferred as LOW risk — it only reads data and generates ideas.

