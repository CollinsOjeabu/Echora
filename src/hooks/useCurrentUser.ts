"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useEffect } from "react"

/**
 * Hook that returns the current user's Convex profile,
 * auto-creating it from Clerk data on first visit.
 *
 * Returns: { profile, isLoading }
 */
export function useCurrentUser() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()

  // Query Convex for the profile matching this Clerk ID
  const profile = useQuery(
    api.users.getByClerkId,
    clerkUser ? { clerkId: clerkUser.id } : "skip",
  )

  const ensureProfile = useMutation(api.users.ensureProfile)

  // Auto-create profile if Clerk user exists but Convex profile doesn't
  useEffect(() => {
    if (clerkLoaded && clerkUser && profile === null) {
      ensureProfile({
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        name: clerkUser.fullName ?? clerkUser.firstName ?? undefined,
        avatarUrl: clerkUser.imageUrl ?? undefined,
      })
    }
  }, [clerkLoaded, clerkUser, profile, ensureProfile])

  return {
    profile: profile ?? null,
    isLoading: !clerkLoaded || profile === undefined,
    clerkUser,
  }
}
