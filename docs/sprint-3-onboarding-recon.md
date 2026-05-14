# Onboarding Flow Reconnaissance Report

## Issue Description
New accounts signing up via Google Sign-in are getting stuck on the first step of the onboarding wizard. They can edit their name but cannot proceed to the voice DNA questionnaire or the rest of the flow.

## Root Cause Analysis

The issue stems from a combination of middleware routing, missing auto-creation logic on the onboarding page, and a strict update mutation.

### 1. Middleware Redirection Bypasses Auto-Creation
When a new user signs in, Clerk attempts to redirect them to `/dashboard`. 
The `middleware.ts` intercepts this (because the user lacks the `threadda-onboarded` cookie) and immediately redirects them to `/onboarding`.
Normally, when a user hits the dashboard, the `useCurrentUser()` hook runs. This hook contains an `ensureProfile` mutation that automatically creates the Convex profile if it doesn't exist (acting as a fallback if the Clerk `user.created` webhook is delayed or fails in local development). 
Because the user is redirected straight to `/onboarding`, the dashboard never mounts, and `useCurrentUser()` is never executed.

### 2. Onboarding Page Missing Profile Initialization
Inside `src/app/onboarding/page.tsx`, the component fetches the user profile using a direct query instead of the custom hook:
```typescript
const profile = useQuery(api.users.getCurrent)
```
Since the webhook likely hasn't fired (or failed in local dev) and `useCurrentUser()` was bypassed, `profile` returns `null`. The profile does not exist in the Convex database.

### 3. Step 1 Fails on `updateProfile`
Step 1 of the onboarding wizard ONLY contains a text input for the user's name (which explains why you noted you couldn't upload a picture—there is no avatar upload UI on this step).
When the user clicks "Continue", it triggers `handleStep1`:
```typescript
const handleStep1 = async () => {
  // ...
  try { await updateProfile({ name: displayName.trim() }); goNext() }
  catch (e) { setError(...) }
}
```
This calls `api.users.updateProfile` in `convex/users.ts`. However, `updateProfile` strictly requires the profile to already exist:
```typescript
const profile = await ctx.db
  .query("profiles")
  .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
  .unique()

if (!profile) throw new ConvexError("Profile not found") // <--- THIS FAILS
```
Because the profile is `null`, the mutation throws a `"Profile not found"` error. The `catch` block intercepts this error, preventing `goNext()` from being called.

## Summary
The user is permanently stuck on Step 1 because the application tries to update a profile that hasn't been created yet. 

**Required Fix (For future reference, no code changed during this recon):**
The `OnboardingPage` needs to use the `useCurrentUser()` hook (or manually call `ensureProfile`) so that the Convex profile is created before `updateProfile` is called. Alternatively, Step 1 could use `ensureProfile` instead of `updateProfile` to guarantee the profile exists before proceeding to Step 2.
