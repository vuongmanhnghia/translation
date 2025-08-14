"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("system")
  const [mounted, setMounted] = React.useState(false)

  // Get system theme preference
  const getSystemTheme = React.useCallback((): "light" | "dark" => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "light"
  }, [])

  // Calculate resolved theme
  const resolvedTheme = React.useMemo(() => {
    if (theme === "system") {
      return getSystemTheme()
    }
    return theme as "light" | "dark"
  }, [theme, getSystemTheme])

  // Load theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme)
    }
    setMounted(true)
  }, [])

  // Save theme to localStorage and apply to document
  React.useEffect(() => {
    if (!mounted) return

    localStorage.setItem("theme", theme)

    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)

    // Also set data attribute for compatibility
    root.setAttribute("data-theme", resolvedTheme)
  }, [theme, resolvedTheme, mounted])

  // Listen for system theme changes
  React.useEffect(() => {
    if (theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      const root = document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(getSystemTheme())
      root.setAttribute("data-theme", getSystemTheme())
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, getSystemTheme])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, resolvedTheme],
  )

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
