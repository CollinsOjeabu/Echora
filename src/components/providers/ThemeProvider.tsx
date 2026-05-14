'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'

type Theme = 'void' | 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'void',
  setTheme: () => {},
})

const STORAGE_KEY = 'threadda-theme'
const LEGACY_KEY = 'threadda-theme-legacy'
const VALID_THEMES: Theme[] = ['void', 'dark', 'light']

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
  // Update color-scheme for native elements
  document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark'
}

function readLocalTheme(): Theme {
  try {
    // Check for legacy key first and migrate
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const migrated: Theme = legacy === 'eden' ? 'dark' : (VALID_THEMES.includes(legacy as Theme) ? legacy as Theme : 'void')
      localStorage.setItem(STORAGE_KEY, migrated)
      localStorage.removeItem(LEGACY_KEY)
      console.log(`[theme] migrated from threadda-theme-legacy key: ${migrated}`)
      return migrated
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && VALID_THEMES.includes(stored as Theme)) {
      return stored as Theme
    }
  } catch {
    // SSR or localStorage unavailable
  }
  return 'void'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('void')
  const [hasMounted, setHasMounted] = useState(false)

  // Convex queries
  const convexTheme = useQuery(api.theme.getMyTheme)
  const setMyTheme = useMutation(api.theme.setMyTheme)

  // Read from localStorage on mount
  useEffect(() => {
    const localTheme = readLocalTheme()
    setThemeState(localTheme)
    applyTheme(localTheme)
    console.log(`[theme] mounted (from localStorage): ${localTheme}`)
    setHasMounted(true)
  }, [])

  // Hydrate from Convex when available
  useEffect(() => {
    if (!hasMounted || convexTheme === undefined) return

    const convexValue = convexTheme as Theme
    if (VALID_THEMES.includes(convexValue) && convexValue !== theme) {
      console.log(`[theme] localStorage and Convex differ — Convex wins: ${convexValue}`)
      setThemeState(convexValue)
      applyTheme(convexValue)
      try {
        localStorage.setItem(STORAGE_KEY, convexValue)
      } catch {
        // localStorage unavailable
      }
    } else if (hasMounted && convexTheme !== undefined) {
      console.log(`[theme] hydrated from Convex: ${convexValue}`)
    }
    // Only run when convexTheme changes, not on every theme change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convexTheme, hasMounted])

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (!VALID_THEMES.includes(newTheme)) return

      console.log(`[theme] user changed: ${theme}→${newTheme}`)
      setThemeState(newTheme)
      applyTheme(newTheme)

      try {
        localStorage.setItem(STORAGE_KEY, newTheme)
      } catch {
        // localStorage unavailable
      }

      // Fire and forget — optimistic update already applied
      setMyTheme({ theme: newTheme }).catch((err) => {
        console.warn('[theme] Failed to persist to Convex:', err)
      })
    },
    [theme, setMyTheme],
  )

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
