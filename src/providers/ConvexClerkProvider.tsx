'use client'

import { type ReactNode } from 'react'
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string,
)

interface Props {
  children: ReactNode
}

export function ConvexClerkProvider({ children }: Props) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#FF6B35',
          colorBackground: '#0D1610',
          colorInputBackground: '#152219',
          colorInputText: '#EDE8E0',
          colorText: '#EDE8E0',
          colorTextSecondary: 'rgba(237,232,224,0.45)',
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
