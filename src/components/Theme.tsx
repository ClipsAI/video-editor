// React
import { useEffect, useState, ComponentPropsWithoutRef } from 'react'

// Icons
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"

// Third-party Libraries
import { useTheme } from 'next-themes'


export function ThemeToggle() {
    let { resolvedTheme, setTheme } = useTheme()
    let otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    let [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <button
            type="button"
            className="flex items-center justify-center rounded-md
            transition hover:bg-zinc-900/5 dark:hover:bg-white/5 mr-0.5"
            aria-label={mounted ? `Switch to ${otherTheme} theme` : 'Toggle theme'}
            onClick={() => setTheme(otherTheme)}
        >
            <MoonIcon
                className="h-6 w-6 text-blue-600 stroke-blue-600 dark:hidden" 
            />
            <SunIcon
                className="hidden h-6 w-6 text-white/90 stroke-white dark:block"
            />
        </button>
    )
}

export function ThemeWatcher() {
    let { resolvedTheme, setTheme } = useTheme()

    useEffect(() => {
        let media = window.matchMedia('(prefers-color-scheme: dark)')

        function onMediaChange() {
            let systemTheme = media.matches ? 'dark' : 'light'
            if (resolvedTheme === systemTheme) {
                setTheme('system')
            }
        }

        onMediaChange()
        media.addEventListener('change', onMediaChange)

        return () => {
            media.removeEventListener('change', onMediaChange)
        }
    }, [resolvedTheme, setTheme])

    return null
}
