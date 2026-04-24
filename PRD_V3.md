# Product Requirements Document (PRD)
## [PRODUCT_NAME]: Research-to-Content Synthesis Platform

**Document Version:** 3.0  
**Last Updated:** 3 April 2026  
**Document Owner:** Collins (Solo Founder)  
**Status:** In Development — Phase D  
**Tagline:** Your Voice, Amplified.

---

## 1. Executive Summary

### Product Vision

[PRODUCT_NAME] is an AI-powered research-to-content synthesis platform that helps knowledge workers, founders, and thought leaders turn saved research into original, voice-matched content for LinkedIn and X (Twitter). Two specialized AI agents — The Authority (LinkedIn) and The Catalyst (X) — generate platform-optimised posts in the user's authentic writing voice, trained from their own content via Voice DNA.

### What Makes This Different

The core differentiator is **Voice DNA** — the system learns the user's actual writing voice by scraping their own LinkedIn posts via OAuth (`r_member_social` scope, last 20–50 posts), not from generic style presets or manual questionnaires. This is the primary mechanism that separates [PRODUCT_NAME] from competitors like Kleo, Eden, Taplio, and Buffer, all of which rely on either generic AI output or manual style configuration.

### Mission Statement

Eliminate generic AI-generated content by building a platform that truly understands individual writing styles through direct analysis of the user's own published work, then synthesizes new research into original posts that sound authentically like the author.

### Success Metrics (6-Month Targets)

| Metric | Target |
|--------|--------|
| Paying users | 1,000 |
| Monthly retention | 80%+ |
| Posts generated per user/month | 12 average |
| Voice match satisfaction | 85%+ user rating |
| MRR | $29K+ |

---

## 2. Product Architecture

### Core Loop

```
Save Research → Build Knowledge Graph → Synthesize in Canvas → Generate Voice-Matched Post → Approve → Publish
```

### Platform Components

| Component | Description |
|-----------|-------------|
| **Library** | Save articles, PDFs, notes, tweets, videos. Each item is scraped, summarized, and embedded for semantic search. |
| **Knowledge Graph** | Visual node graph showing connections between saved research items. Built from embedding similarity + AI-detected thematic links. Accessible as a view toggle within the Canvas, not a separate navigation destination. |
| **Synthesis Canvas** | 3-panel workspace: source selector (left), synthesis chat (right panel, tabbed), and content preview. The AI chat lives in the Canvas right panel as a tabbed interface. Users select sources, the AI finds non-obvious connections and generates a post. |
| **Agents Tab** | Approval inbox for Canvas-generated drafts before scheduling. The Authority handles LinkedIn posts; The Catalyst handles X posts. Each draft shows a voice match score. |
| **Schedule** | Calendar view of approved and published posts. Drag-and-drop scheduling. |
| **Analytics** | Performance tracking per post, per source, per agent. Shows which research sources generate the highest-performing content. |
| **Voice DNA** | Writing style profile trained from the user's own LinkedIn posts (primary) or manual writing samples (fallback). Stores metrics: storytelling, technical depth, provocativeness, data-driven tendency, formality, sentence length patterns, question usage, emoji frequency, and signature phrases. |
| **Settings** | Profile management, voice retraining, connected accounts, plan management. |

### Agent Specifications

| Agent | Platform | Personality | Content Style |
|-------|----------|-------------|---------------|
| **The Authority** | LinkedIn | Professional, synthesizing, insight-driven | Long-form posts (up to 3000 chars), data-backed, hook + insight + CTA structure |
| **The Catalyst** | X (Twitter) | Sharp, provocative, momentum-driven | Threads and standalone tweets, contrarian angles, real-time trend reactions |

Both agents use Voice DNA to match the user's writing style. They don't generate generic content — every output is filtered through the user's actual voice profile and uses their real writing samples as few-shot examples.

---

## 3. Technology Stack

### Confirmed Stack (Locked)

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js | 16 | App Router, React 19 |
| Styling | Tailwind CSS | v4 | CSS variables, dark-first |
| Component Library | shadcn/ui | Latest | Base components only |
| Animation | Framer Motion | 12.x | Page transitions, micro-interactions |
| Backend / Database | Convex | 1.34.x | Real-time reactive queries, serverless functions |
| Authentication | Clerk | v7 (@clerk/nextjs) | Social OAuth (LinkedIn, Google), JWT provider for Convex |
| AI — Content Generation | Anthropic Claude | claude-sonnet-4-5 | All synthesis, voice analysis, post generation. Via `@anthropic-ai/sdk` |
| AI — Embeddings Only | OpenAI | text-embedding-3-small | Semantic similarity for knowledge graph edges and content search. Via `openai` SDK |
| Web Scraping | Firecrawl | 4.x | URL content extraction for Library ingestion. Via `@mendable/firecrawl-js` |
| Graph Visualization | @xyflow/react | 12.x | Interactive knowledge graph in Canvas |
| Fonts | Google Fonts | CDN | DM Serif Display (headlines), Inter (UI/body), JetBrains Mono (code/IDs) |
| Deployment | Vercel | — | Edge functions, automatic preview deployments |

> **Critical Note for AI Agents:** Content generation and voice analysis use **Anthropic Claude (claude-sonnet-4-5)**, NOT OpenAI GPT-4o. OpenAI is used **only** for the `text-embedding-3-small` embedding model. The `openai` npm package is retained solely for embeddings. The `@anthropic-ai/sdk` package handles all generation tasks.

### Environment Variables

| Variable | Purpose | Status |
|----------|---------|--------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL | ✅ Set |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ Set |
| `CLERK_SECRET_KEY` | Clerk server key | ✅ Set |
| `CLERK_FRONTEND_API_URL` | Clerk frontend API | ✅ Set |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route | ✅ `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route | ✅ `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | Post-sign-in redirect | ✅ `/dashboard` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | Post-sign-up redirect | ✅ `/dashboard` |
| `CONVEX_DEPLOYMENT` | Convex cloud instance | ✅ `valiant-ibex-213.convex.cloud` |
| `ANTHROPIC_API_KEY` | Claude API (generation) | ✅ Set (in Convex env) |
| `OPENAI_API_KEY` | OpenAI API (embeddings only) | ✅ Set (in Convex env) |
| `FIRECRAWL_API_KEY` | Firecrawl (URL scraping) | ✅ Set (in Convex env) |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook validation | ⬜ Needs setup |

---

## 4. Database Schema (Convex)

### Tables

#### `profiles`
| Field | Type | Status | Notes |
|-------|------|--------|-------|
| clerkId | string (indexed) | ✅ Active | Primary user identifier |
| email | string (indexed) | ✅ Active | |
| name | optional string | ✅ Active | Display name |
| avatarUrl | optional string | ✅ Active | Profile image |
| plan | `"free" \| "pro" \| "team"` | ✅ Active | Maps to Scout / Authority / Collective in marketing |
| onboardedAt | optional number | ✅ Active | Timestamp of onboarding completion |
| onboardingComplete | optional boolean | ✅ Active | Gate flag for middleware redirect |
| voiceRawSamples | optional string[] | ✅ Active | Manual writing samples from onboarding |
| linkedInAccessToken | optional string | ⬜ Phase E | Encrypted OAuth token |
| linkedInTokenExpiry | optional number | ⬜ Phase E | Token expiration timestamp |
| voiceProfile | optional object | ⬜ Phase E | Full Voice DNA analysis results |

Voice DNA object shape (populated by Claude analysis in Phase E):
```
{
  storytelling: number (0-100),
  technical: number (0-100),
  provocative: number (0-100),
  dataDriver: number (0-100),
  formality: number (0-100),
  avgSentenceLength: number,
  usesQuestions: boolean,
  emojiUsage: 'none' | 'rare' | 'moderate' | 'frequent',
  signaturePhrases: string[],
  trainingPostCount: number,
  trainedAt: number,
  trainedFrom: 'linkedin_scrape' | 'manual_samples'
}
```

#### `contentItems`
| Field | Type | Status |
|-------|------|--------|
| userId | id("profiles") | ✅ |
| type | `"article" \| "video" \| "note" \| "tweet" \| "pdf"` | ✅ |
| title | string | ✅ |
| url | optional string | ✅ |
| rawText | optional string | ✅ |
| summary | optional string | ⬜ Phase E (AI) |
| tags | optional string[] | ⬜ Phase E (AI) |
| embeddingId | optional string | ⬜ Phase E (vector) |
| status | `"queued" \| "processing" \| "ready" \| "error"` | ✅ |
| createdAt | number | ✅ |

#### `voiceTrainingPosts`
| Field | Type | Status |
|-------|------|--------|
| userId | id("profiles") | ⬜ Phase E |
| platform | `"linkedin" \| "twitter"` | ⬜ Phase E |
| postId | string | ⬜ Phase E |
| content | string | ⬜ Phase E |
| postedAt | optional number | ⬜ Phase E |
| embedding | optional float64[] | ⬜ Phase E (vector index) |

#### `graphEdges`
| Field | Type | Status |
|-------|------|--------|
| sourceId | id("contentItems") | ⬜ Phase E |
| targetId | id("contentItems") | ⬜ Phase E |
| relationship | string | ⬜ Phase E |
| weight | number | ⬜ Phase E |

#### `canvasSessions`
| Field | Type | Status |
|-------|------|--------|
| userId | id("profiles") | ⬜ Phase E |
| title | string | ⬜ Phase E |
| sourceIds | id("contentItems")[] | ⬜ Phase E |
| insights | string[] | ⬜ Phase E |
| chatHistory | object[] | ⬜ Phase E |
| createdAt | number | ⬜ Phase E |
| updatedAt | number | ⬜ Phase E |

#### `agentPosts`
| Field | Type | Status |
|-------|------|--------|
| userId | id("profiles") | ✅ |
| agent | `"authority" \| "catalyst"` | ✅ |
| platform | `"linkedin" \| "twitter"` | ✅ |
| content | string | ✅ |
| voiceMatchScore | optional number | ⬜ Phase F |
| status | `"draft" \| "approved" \| "scheduled" \| "published"` | ✅ |
| scheduledFor | optional number | ⬜ Phase G |
| publishedAt | optional number | ⬜ Phase G |
| sourceSessionId | optional id("canvasSessions") | ⬜ Phase E |
| createdAt | number | ✅ |

### Backend Functions (Convex)

#### `convex/users.ts` — ✅ Complete
- `getByClerkId` (query) — Fetch profile by Clerk ID
- `getCurrent` (query) — Get authenticated user's profile
- `ensureProfile` (mutation) — Create profile if not exists
- `completeOnboarding` (mutation) — Set onboardingComplete flag + timestamp
- `saveVoiceSamples` (mutation) — Store raw writing samples
- `upsertFromClerk` (mutation) — Webhook handler for Clerk user sync
- `deleteByClerkId` (mutation) — Webhook handler for user deletion
- `updateVoiceProfile` (mutation) — Update voice profile settings

#### `convex/content.ts` — ✅ Complete
- `list` (query) — List user's content items with optional type filter
- `get` (query) — Get single content item
- `create` (mutation) — Create new content item
- `update` (mutation) — Update content item
- `search` (query) — Search by title/text
- `createFromAuth` (mutation) — Create content item for authenticated user (onboarding flow)

#### `convex/posts.ts` — ✅ Complete
- `list` (query) — List agent posts with optional status filter
- `updateStatus` (mutation) — Change post status (approve/reject/schedule)
- `remove` (mutation) — Delete a post
- `create` — ⬜ Phase F (AI generates posts)

#### `convex/voiceDna.ts` — ⬜ Phase E
- `storeLinkedInToken` (mutation)
- `scrapeLinkedInPosts` (action)
- `generateVoiceProfile` (action) — Uses Anthropic Claude for analysis
- `trainFromManualSamples` (action) — Uses Anthropic Claude for analysis
- `getTrainingStatus` (query)

---

## 5. Authentication & User Flow

### Auth Provider: Clerk v7

Clerk handles all authentication via `@clerk/nextjs`. Social login supported (Google, LinkedIn). JWT tokens issued to Convex for server-side identity verification.

### User Flow

```
Landing → Sign Up (Clerk) → /onboarding → Complete → Cookie set → /dashboard
                                              ↓
                                    Return visit → Cookie exists → /dashboard
```

### Middleware Rules (`src/proxy.ts`)

| Rule | Condition | Action |
|------|-----------|--------|
| 1 | Unauthenticated + `/dashboard(*)` | → `/sign-in` |
| 2 | Authenticated + `/dashboard(*)` + no `[PRODUCT_NAME]-onboarded` cookie | → `/onboarding` |
| 3 | Authenticated + `/onboarding` + cookie set | → `/dashboard` |
| 4 | Authenticated + `/sign-in` or `/sign-up` | → `/dashboard` |

### Onboarding Cookie

- **Name:** `[PRODUCT_NAME]-onboarded` (currently `echora-onboarded` — rename on brand finalization)
- **Value:** `true`
- **Max-age:** 1 year (31,536,000 seconds)
- **Set by:** Onboarding page after `completeOnboarding()` mutation succeeds
- **Reconciliation:** If an existing user clears cookies but has `profile.onboardingComplete === true` in Convex, the onboarding page auto-sets the cookie and redirects to `/dashboard` without showing the wizard again.

### Onboarding Flow (3 Steps) — ✅ Implemented

**Step 1 — Train Your Voice AI**
- Option A: Connect LinkedIn → triggers OAuth (placeholder in current build; functional in Phase E via `r_member_social` scope, scrapes last 20–50 posts)
- Option B: Add writing samples → textarea for 3–5 writing samples, saved to `profiles.voiceRawSamples`
- Option C: Skip for now → proceed with generic voice

**Step 2 — Voice Preview** (only for Option B)
- Shows animated voice profile bars based on sample length
- Displays "AI analysis · Phase E" badge (analysis deferred to Phase E when Claude integration is active)

**Step 3 — Add First Research Item**
- URL / Text / Note tabs
- Saves to `contentItems` via `content.createFromAuth`
- Skip option available

After completion or skip: `completeOnboarding()` mutation fires, cookie is set, redirect to `/dashboard`.

---

## 6. Design System

### Visual Direction

Dark-first, premium, editorial. No light mode. References: Stripe's precision, Arc Browser's personality, Notion's clarity. The product should feel like a creative studio that also ships enterprise-grade software.

### Color System (Locked — Eden + Ember)

**Brand direction:** Warm dark green base (Eden) with burnt orange accent (Ember). Organic, alive, premium. Like fire in a forest — not cold neon on black.

| Token | Hex | CSS Variable | Role |
|-------|-----|-------------|------|
| Void | `#070E09` | `--void` | Page background — warm dark green, not pure black |
| Surface | `#0D1610` | `--surface` | Card backgrounds |
| Elevated | `#152219` | `--elevated` | Hover states, modals, sidebar |
| Border | `#1E2E22` | `--border` | All borders, dividers |
| **Ember** | **`#FF6B35`** | `--ember` | **Primary accent — CTAs, active states, voice match, agent badges** |
| Ember Muted | `rgba(255,107,53,0.10)` | `--ember-muted` | Subtle accent backgrounds, badge fills |
| Ember Glow | `rgba(255,107,53,0.15)` | — | Hover glow on primary CTAs |
| Cream | `#EDE8E0` | `--cream` | Primary text — warm cream, not pure white |
| Cream Muted | `rgba(237,232,224,0.45)` | `--cream-muted` | Secondary text, body copy, captions |
| Cream Faint | `rgba(237,232,224,0.12)` | `--cream-faint` | Subtle borders, dividers, faint UI elements |
| Success | `#1D9E75` | `--success` | Published, connected |
| Warning | `#EF9F27` | `--warning` | Pending, awaiting approval |
| Danger | `#E24B4A` | — | Error, destructive |
| Info | `#378ADD` | `--info` | Informational |

> **Critical for AI agents:** The brand accent is **Ember (`#FF6B35`)** — a burnt orange. NOT lime, NOT yellow-green, NOT Signal. Any reference to `#C8FF00`, `#E8FF47`, "Neural Lime", or "Signal" as the accent color is outdated and must be replaced with Ember `#FF6B35`. The background is warm dark green `#070E09`, NOT pure black `#000000` or cool black `#0A0A0F`. CSS variables do NOT use a `--color-` prefix — they are `--void`, `--ember`, `--cream`, etc.

### Typography

| Role | Font | Usage |
|------|------|-------|
| Display / Headlines | DM Serif Display | Hero text, section titles, large callouts |
| Body / UI | Inter | All interface text, labels, buttons, body copy |
| Monospace | JetBrains Mono | Agent IDs (E-LI-772), metrics, technical labels |

### UI Themes (Planned)

| Theme | Description | Status |
|-------|-------------|--------|
| Eden + Ember (default) | Warm dark green `#070E09`, Ember `#FF6B35` accent, Parchment `#EDE8E0` text | ✅ Active |
| Eden Dark | Alternate dark palette | ⬜ Future |
| Light | Light mode | ⬜ Future |

### Dashboard Layout

- Sidebar collapses to 48px icon rail on narrow viewports
- TopBar shows user avatar, search, notifications
- Content area uses full remaining width

---

## 7. Pricing Tiers

| Tier | Marketing Name | Schema Value | Price | Key Limits |
|------|---------------|--------------|-------|------------|
| Free | Scout | `"free"` | $0/mo | 30 library items, 3 canvases/mo, 5 posts/mo, 1 platform |
| Paid | Authority | `"pro"` | $29/mo | Unlimited library, unlimited canvases, 20 posts/mo, LinkedIn + X |
| Team | Collective | `"team"` | $79/mo | Everything in Authority + team seats, shared library, approval workflows |

---

## 8. Landing Page — ✅ Production Ready

### Headline
"Save. Connect. Publish original."

### Sections (Ordered)
1. Navigation
2. Hero
3. Logo Ticker
4. About / Problem
5. How It Works (3-step)
6. Agent Intelligence (The Authority + The Catalyst)
7. Voice DNA
8. Features Bento Grid
9. Pricing (Scout / Authority / Collective)
10. CTA + Feature Ticker + Footer

### Quality Assessment
Production-quality. 9 section components, animated with Framer Motion, responsive, no backend dependency. Approximately 76KB total across all section files.

---

## 9. File Structure

### Frontend — `src/`

```
src/
├── app/
│   ├── layout.tsx                           Root layout (ConvexClerkProvider)
│   ├── page.tsx                             Landing page (9 section imports)
│   ├── globals.css                          Design tokens, theme system
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx  Clerk SignIn
│   │   └── sign-up/[[...sign-up]]/page.tsx  Clerk SignUp
│   ├── onboarding/
│   │   └── page.tsx                         3-step onboarding wizard
│   └── dashboard/
│       ├── layout.tsx                       Sidebar + TopBar shell
│       ├── page.tsx                         Home (wired to Convex)
│       ├── library/
│       │   ├── page.tsx                     Library list
│       │   └── new/page.tsx                 Add new item form
│       ├── canvas/page.tsx                  Graph canvas
│       ├── agents/page.tsx                  Approval queue
│       ├── schedule/page.tsx                Calendar
│       ├── analytics/page.tsx               Stats + charts
│       └── settings/page.tsx                Settings panels
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.tsx                      Wired — real user data
│   │   └── TopBar.tsx                       Wired — real user avatar
│   ├── landing/                             9 section components
│   └── ui/
│       └── skeleton.tsx                     Skeleton loader
├── hooks/
│   └── useCurrentUser.ts                    Clerk → Convex profile bridge
├── providers/
│   └── ConvexClerkProvider.tsx              Auth-wrapped Convex client
├── lib/
│   └── utils.ts                            cn() utility
└── proxy.ts                                Clerk middleware + onboarding gate
```

### Backend — `convex/`

```
convex/
├── schema.ts        5 tables (profiles, contentItems, graphEdges, canvasSessions, agentPosts)
├── users.ts         8 functions
├── content.ts       6 functions
├── posts.ts         3 functions
├── voiceDna.ts      ⬜ Phase E (5 functions planned)
└── auth.config.ts   Clerk JWT provider
```

---

## 10. Build Status & Phase Plan

### Completed Phases

| Phase | Description | Status |
|-------|-------------|--------|
| A | Landing page design + build | ✅ Done |
| B | Dashboard UI shells (all 7 routes) | ✅ Done |
| C | Convex schema + API functions | ✅ Done |
| Pre-D | Auth redirect fix, hydration fix, naming cleanup | ✅ Done |
| D / Step 1 | Wire dashboard home ↔ Convex | ✅ Done |
| D / Step 2 | Build onboarding route + middleware gate | ✅ Done |

### In Progress — Phase D (Wire UI ↔ Backend)

Remaining: wire each dashboard sub-page to real Convex data.

| Page | What Needs Wiring | Priority |
|------|-------------------|----------|
| **Library** | Replace hardcoded items with `content.list` query. Wire filter tabs. | 1 |
| **Library/New** | Wire form submit to `content.create` or `content.createFromAuth` | 2 |
| **Agents** | Replace hardcoded posts with `posts.list`. Wire approve/reject to `posts.updateStatus` | 3 |
| **Settings** | Wire profile fields to `users.updateVoiceProfile` and Clerk user update | 4 |
| **Schedule** | Replace hardcoded calendar with `posts.list({ status: "approved" \| "published" })` | 5 |
| **Analytics** | Replace hardcoded stats with computed queries | 6 |
| **Canvas** | Replace hardcoded SVG with `@xyflow/react` + `content.list` + `graphEdges` | 7 |

### Future Phases

| Phase | Description | Dependencies | Status |
|-------|-------------|-------------|--------|
| **E** | AI Pipeline: Firecrawl URL scraping → Anthropic Claude summarization → OpenAI embeddings → Knowledge graph edge creation → Voice DNA training (LinkedIn OAuth scrape + Claude analysis) | `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `FIRECRAWL_API_KEY` in Convex env; LinkedIn app approval for `r_member_social` scope | ⬜ |
| **F** | Agent Post Generation: The Authority + The Catalyst create posts from knowledge graph using Claude + Voice DNA few-shot examples | Phase E complete | ⬜ |
| **G** | Publishing: Connect to LinkedIn/X APIs for direct posting + scheduling | OAuth tokens, platform API access | ⬜ |

---

## 11. Known Issues & Technical Debt

| # | Severity | Issue | Recommendation |
|---|----------|-------|----------------|
| 1 | 🟡 Medium | `@xyflow/react`, `openai`, `firecrawl-js`, `lucide-react` installed but unused | Remove `lucide-react` (inline SVGs used instead). Keep others for their phase. |
| 2 | 🟡 Medium | Canvas uses hardcoded SVG graph, not `@xyflow/react` | Wire in Phase D canvas step (last priority) |
| 3 | 🟡 Medium | Landing page uses old color palette (`#C8FF00` lime / `#E8FF47` Signal, pure blacks) vs locked design system (Ember `#FF6B35`, Void `#070E09`) | Color unification pass needed — replace all lime/signal references with Ember |
| 4 | 🟢 Low | `CLERK_WEBHOOK_SECRET` is empty | Set up when deploying webhook endpoint |
| 5 | 🟢 Low | Cookie name hardcoded as `echora-onboarded` | Rename on brand finalization |
| 6 | 🟢 Low | `dangerouslySetInnerHTML` in Canvas page for chat bold text | Refactor to React nodes if user input is ever displayed |

---

## 12. Competitive Landscape

| Competitor | Weakness vs [PRODUCT_NAME] |
|------------|---------------------------|
| **Kleo** | Requires manual prompts. No autonomous generation. No knowledge graph. Generic style presets, not voice-trained from user's own writing. |
| **Eden** | Manual style selection. No LinkedIn scraping for voice training. No synthesis from research sources. |
| **Taplio** | LinkedIn-only. No X support. No research-to-content pipeline. Scheduling tool, not a synthesis engine. |
| **Buffer** | No intelligence. Pure scheduling. No AI generation. No voice matching. |
| **Hootsuite** | Enterprise bloat. No AI synthesis. No voice DNA. Designed for social media managers, not thought leaders. |

### [PRODUCT_NAME]'s Unique Position

No direct competitor combines all three of: (1) research ingestion and synthesis via knowledge graph, (2) voice training from the user's own published content via OAuth scraping, and (3) platform-specific AI agents that generate and manage content autonomously.

---

## 13. Voice DNA — Technical Specification

### Training Pipeline (Phase E)

**Primary Path — LinkedIn OAuth Scrape:**
1. User connects LinkedIn via Clerk's social OAuth flow
2. `r_member_social` permission scope grants access to user's posts
3. System calls LinkedIn API v2 `GET /ugcPosts` to fetch last 20–50 posts
4. Posts stored in `voiceTrainingPosts` table with deduplication by `postId`
5. OpenAI `text-embedding-3-small` generates embeddings for each post (batched in groups of 10)
6. Anthropic Claude (`claude-sonnet-4-5`) analyses the corpus:
   - Input: first 300 characters of each post, concatenated
   - Output: JSON voice profile (storytelling, technical, provocative, dataDriver, formality, avgSentenceLength, usesQuestions, emojiUsage, signaturePhrases)
7. Profile stored in `profiles.voiceProfile`

**Fallback Path — Manual Samples:**
1. User pastes 3–5 writing samples in onboarding Step 2
2. Samples stored in `profiles.voiceRawSamples`
3. Same Claude analysis pipeline runs on the samples
4. Profile stored with `trainedFrom: 'manual_samples'`

**Skip Path:**
1. User skips Voice DNA training during onboarding
2. Agents use generic voice until the user trains later from Settings

### Voice DNA in Post Generation (Phase F)

When generating a post, the synthesis prompt includes:
- The user's full Voice DNA profile (scores, patterns, phrases)
- The top 3–5 `voiceTrainingPosts` as few-shot examples (truncated to 400 chars each)
- This ensures the AI output matches the user's actual writing style, not a generic approximation

### Important Constraints

- Voice DNA is identity-locked. Users can only train from their own content. Cloning another person's voice is explicitly not supported — this is a product principle, not a limitation.
- LinkedIn `r_member_social` scope requires LinkedIn app approval for production use. Development/testing works with test users on the LinkedIn developer app.
- X/Twitter voice training is deferred. The X API v2 requires a paid Basic tier ($100/month). The `tweet.read` scope is the equivalent of `r_member_social`. This will be evaluated based on user demand.

---

## 14. Engineering Documents (Companion Files)

These documents are maintained alongside this PRD and contain implementation-level prompts for AI coding agents (Antigravity IDE / Claude):

| Document | Purpose |
|----------|---------|
| `SYSTEM_PROMPT.md` | Master Antigravity system prompt — stack, schema, file structure, phase order, coding conventions |
| `PHASE_A_PROMPTS.md` | Foundation phase prompts (dependency cleanup, Clerk, Convex setup) |
| `PHASE_B_PROMPTS.md` | Backend foundation prompts (schema, functions, Voice DNA pipeline) |
| `PHASE_CD_PROMPTS.md` | Core loop + wiring prompts (canvas, synthesis, dashboard wiring) |
| `QUICK_REFERENCE.md` | Condensed schema + stack reference for quick context loading |
| `MARKETING_SYSTEM.md` | Go-to-market strategy, content calendar, community launch plan |

> **All engineering documents must reference Anthropic Claude (`claude-sonnet-4-5`) for generation and OpenAI (`text-embedding-3-small`) for embeddings only.** Any reference to GPT-4o for generation tasks is outdated and should be corrected.

---

## 15. Go-to-Market Summary

### Pricing Strategy

- Free tier (Scout) for acquisition — enough to demonstrate value, limited enough to drive upgrades
- Authority ($29/mo) is the primary revenue tier — positioned as "your AI content team for the price of a nice dinner"
- Collective ($79/mo) for teams — shared libraries, approval workflows, multiple seats

### Launch Channels

1. **Build-in-public on X** — document the journey, show real product development
2. **Reddit + Indie Hackers** — lead with the problem ("How do you turn saved research into content?"), not the product
3. **LinkedIn organic** — use [PRODUCT_NAME] itself to generate launch content (dogfooding)
4. **Product Hunt launch** — timed for when Phase F (agent generation) is complete

### Waitlist

Email collection integrated into landing page CTA section. Stored in Convex or via Loops/Resend (TBD).

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 20 Jan 2026 | Initial PRD — generic AI content platform concept |
| 2.0 | 23 Jan 2026 | Pivot to autonomous agent architecture (The Authority + The Catalyst) |
| 3.0 | 3 Apr 2026 | Full rewrite reflecting actual build state. AI stack corrected to Anthropic Claude for generation + OpenAI for embeddings only. Voice DNA technical spec added. Phase status updated through D Step 2. Design system updated to latest locked direction. All decisions from build sessions incorporated. Product name placeholder added pending brand finalization. |

---

*This PRD is the single source of truth for [PRODUCT_NAME]. All engineering documents, AI coding prompts, and design decisions should reference this document. Updated as of 3 April 2026.*
