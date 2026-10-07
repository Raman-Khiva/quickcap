'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="pillOutline" size="xs" className="h-8 rounded-full px-3 text-xs gap-1.5 opacity-60">
        <Sun className="size-3.5" />
        <span className="hidden sm:inline">Theme</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark' || theme === 'dark'

  return (
    <Button
      variant="pillOutline"
      size="xs"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="h-8 rounded-full px-3 text-xs gap-1.5 transition-all cursor-pointer"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      {isDark ? (
        <>
          <Sun className="size-3.5 text-amber-400 fill-amber-400" />
          <span className="hidden sm:inline font-medium">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="size-3.5 text-zinc-700" />
          <span className="hidden sm:inline font-medium">Dark Mode</span>
        </>
      )}
    </Button>
  )
}
