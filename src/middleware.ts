import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtected   = createRouteMatcher(['/dashboard(.*)'])
const isOnboarding  = createRouteMatcher(['/onboarding'])
const isAuthRoute   = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const isOnboarded = req.cookies.get('echora-onboarded')?.value === 'true'

  // Unauthenticated → sign-in
  if (!userId && isProtected(req)) {
    const url = new URL('/sign-in', req.url)
    url.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(url)
  }

  // Authenticated + dashboard + no onboarding cookie → /onboarding
  if (userId && isProtected(req) && !isOnboarded) {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  // Authenticated + onboarding + cookie already set → /dashboard
  if (userId && isOnboarding(req) && isOnboarded) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Authenticated + auth routes → /dashboard
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
