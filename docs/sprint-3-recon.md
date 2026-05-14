# Sprint 3 — Reconnaissance Report

**Date:** 2026-04-26
**Scope:** Canvas decomposition + Constellation static + typography + 3-theme + persistence

---

## Font Loading (Current)

- **File:** `src/app/layout.tsx:3,7`
- **Method:** `next/font/google` for Geist only; CDN `<link>` for Inter, Inter Tight, Plus Jakarta Sans, DM Serif Display, JetBrains Mono
- **Missing:** Playfair Display — NOT loaded anywhere
- **Action:** Replace CDN links with `next/font/google` for Inter, Playfair Display, JetBrains Mono. Remove Geist, Inter Tight, Plus Jakarta Sans, DM Serif Display CDN refs.

## Theme Provider (Current)

- **No ThemeProvider component exists.** Zero results for `ThemeProvider`, `theme-provider`, `useTheme` in `src/`.
- Theme is only managed in `settings/page.tsx:131-140` — local state + `localStorage.setItem('echora-theme', t)` + `document.documentElement.setAttribute('data-theme', t)`.
- **`class="dark"` on `<html>`:** Yes — `layout.tsx:34` has `className={cn("dark", "font-sans", geist.variable)}`. This is unconditional.
- **`data-theme="void"` on `<html>`:** Yes — also in `layout.tsx:34`, hardcoded.
- **Legacy theme:** `data-theme="eden"` exists in `globals.css:113` — needs to be replaced with `data-theme="dark"`.

## Existing CSS Tokens

- `globals.css:73-111` — `:root, [data-theme="void"]` block: MOSTLY matches the locked spec, but missing `--ember-soft`, `--ember-glow`, `--text-faint` (which exists already)
- `globals.css:113-150` — `[data-theme="eden"]` — needs to become `[data-theme="dark"]` with corrected values
- `globals.css:152-189` — `[data-theme="light"]` — exists, needs minor value corrections
- `globals.css:10-55` — Tailwind v4 `@theme` block with legacy color names (`--color-ember`, `--color-void`, etc.)

## Profiles Schema (Confirmed)

```
profiles: {
  clerkId, email, name?, avatarUrl?, 
  plan: "free"|"pro"|"team"|"internal",
  onboardedAt?, onboardingComplete?, linkedInUrl?, twitterHandle?,
  voiceRawSamples?, voiceProfile?,
  generationsThisMonth?, ingestionsThisMonth?, canvasSessionsThisMonth?, voiceDnaAnalysesThisMonth?, periodResetAt?
}
```
Missing: `theme` field — Sprint 3 adds it.

## Canvas Page (Current State)

- **875 lines**, fully monolithic in `src/app/dashboard/canvas/page.tsx`
- ReactFlow only mounts in `active` session state — idle shows placeholder
- Graph nodes = session sources only, NO constellation/library-wide graph
- Right panel = flat agent label ("The Authority" or "Chat"), green dot, chat messages
- No Playfair Display used anywhere, JetBrains Mono only in chat agent label (inline fontFamily)
- All inline styles, no CSS classes from design system

## Settings Page Appearance Tab

- `settings/page.tsx:520-555` — theme section exists
- Uses `THEMES` array with `void`, `eden`, `light` — needs to become `void`, `dark`, `light`
- Local-only: `localStorage.setItem('echora-theme', t)` — no Convex persistence
- Theme label says "Choose how Echora looks" — keep for Sprint 3 (Echora→Threadda rename is Sprint 7)

## Graph Edges API (Sprint 1)

- `graphEdges.listEdgesForUser` — public query, returns `{ _id, sourceA, sourceB, similarity, createdAt }[]`
- `graphEdges.listEdgesForSources` — public query, takes `sourceIds`, returns edges where both endpoints are in the set

## Constellation Layout Decision

**Chosen algorithm: Circular layout** ordered by node degree (most-connected nodes at "north" position, rest distributed clockwise). Rationale:
1. Deterministic — same data always produces same layout
2. Visually intentional — doesn't look like random scatter
3. Simple — no physics simulation needed
4. Edge-friendly — circular layouts minimize edge crossings for planar-ish graphs
