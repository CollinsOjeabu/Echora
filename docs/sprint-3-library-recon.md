# Library Sync & Scraping Reconnaissance Report

## Issue 1: Missing Library Items (6 old vs 1 new)
**Description:** A user logs in with an account that previously had 6 library items, but after going through onboarding again, the dashboard only shows 1 item (the new one). However, the Convex dashboard shows 7 items total.

**Root Cause:** 
When you manually deleted the user account from the `profiles` table in Convex, the 6 `contentItems` associated with that user were not deleted. They became "orphaned" records still pointing to the old, deleted `profile._id`.
When you cleared your local storage and signed in again with Google, Clerk authenticated you, but since the profile was missing in Convex, the app auto-created a *brand new* profile document for you with a completely new `_id`. 
The library dashboard (`api.content.list`) strictly filters items by your current `profile._id`. Because your new profile ID doesn't match the old profile ID, the dashboard cannot see the 6 orphaned items. It only sees the 1 new item you created during the new onboarding session.

**To fix manually:** In the Convex dashboard, you can edit the 6 old `contentItems` and replace their `userId` field with your new profile's `_id`. In the future, a cascading delete mechanism should be implemented when an account is deleted.

---

## Issue 2: Onboarding Link Not Scraped (Stuck on "Content not yet available")
**Description:** During the onboarding flow, the user is asked to add their first library item. After adding a URL, the item appears in the library but its status says "Content not yet available. This item will be scraped and indexed when the AI pipeline is active." It never actually gets scraped.

**Root Cause:**
In the normal library flow (`/dashboard/library/new`), when a user submits a URL, the app calls the `api.ingestion.startIngestion` action. This action is the actual "engine" that calls Firecrawl to scrape the page, uses Claude to summarize it, and creates vector embeddings.

However, in the onboarding flow (`src/app/onboarding/page.tsx`), the "Fetch article" button executes the following code:
```typescript
const title = new URL(sourceUrl).hostname
await createContent({ title, url: sourceUrl.trim(), content: '', type: 'article' })
```
It exclusively calls `api.content.createFromAuth`, which simply inserts a blank row into the Convex database with `status: "queued"`. **It never triggers the `startIngestion` AI pipeline.** Because the ingestion action is never called, the item remains permanently stuck in the "queued" state.

**Required Fix (No code changed during this recon):**
The `handleFetchSource` function in `src/app/onboarding/page.tsx` needs to be updated to call `api.ingestion.startIngestion` instead of just inserting a blank row via `createFromAuth`.
