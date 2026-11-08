import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { features } from './data.js'
import { ACCENTS } from './accents.js'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

const inkFor = (color) => (ACCENTS.find((a) => a.value === color) || {}).ink || '#ffffff'

function readStore(key) {
  try { return localStorage.getItem(key) } catch (e) { return null }
}
function writeStore(key, val) {
  try { localStorage.setItem(key, val) } catch (e) { /* storage unavailable */ }
}

function readAccent() {
  const saved = readStore('accent')
  return ACCENTS.some((accent) => accent.value === saved) ? saved : ACCENTS[0].value
}

function applyAccent(color) {
  const s = document.documentElement.style
  s.setProperty('--accent', color)
  s.setProperty('--on-accent', inkFor(color))
  window.dispatchEvent(new CustomEvent('accentchange', { detail: color }))
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark')
  const [accent, setAccentState] = useState(readAccent)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [project, setProject] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(0)
  const accentRef = useRef(accent)

  // theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'light' ? '#eef0f8' : '#090a12')
  }, [theme])

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    writeStore('theme', next)
  }, [theme])

  // accent
  useEffect(() => {
    accentRef.current = accent
    applyAccent(accent)
  }, [accent])

  const setAccent = useCallback((c) => {
    setAccentState(c)
    writeStore('accent', c)
  }, [])

  // liquid-glass refraction only works with Chromium's backdrop-filter: url()
  useEffect(() => {
    const brands = (navigator.userAgentData && navigator.userAgentData.brands) || []
    if (features.refraction && brands.some((b) => /Chromium/i.test(b.brand))) {
      document.documentElement.classList.add('refract')
    }
  }, [])

  // toast + clipboard
  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), msg })
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }, [])

  const copy = useCallback(
    async (text, label = 'Copied to clipboard') => {
      try {
        await navigator.clipboard.writeText(text)
      } catch (e) {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.cssText = 'position:fixed;opacity:0'
        document.body.appendChild(ta)
        ta.select()
        try { document.execCommand('copy') } catch (err) { /* ignore */ }
        ta.remove()
      }
      showToast(label)
    },
    [showToast]
  )

  // Ctrl/Cmd + K opens the command palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Easter egg: ↑ ↑ ↓ ↓ ← → ← → B A  →  aurora mode (accent cycles through every hue)
  useEffect(() => {
    let i = 0
    let raf = 0
    const aurora = () => {
      cancelAnimationFrame(raf)
      showToast('Aurora mode unlocked')
      const start = performance.now()
      const loop = (now) => {
        const t = now - start
        if (t > 8000) {
          applyAccent(accentRef.current)
          return
        }
        applyAccent(`hsl(${Math.round((t / 8000) * 720) % 360}, 90%, 60%)`)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      i = k === KONAMI[i] ? i + 1 : k === KONAMI[0] ? 1 : 0
      if (i === KONAMI.length) {
        i = 0
        aurora()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      cancelAnimationFrame(raf)
    }
  }, [showToast])

  const value = useMemo(
    () => ({
      theme, toggleTheme,
      accent, setAccent,
      paletteOpen, setPaletteOpen,
      project, openProject: setProject, closeProject: () => setProject(null),
      toast, showToast, copy,
    }),
    [theme, toggleTheme, accent, setAccent, paletteOpen, project, toast, showToast, copy]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
