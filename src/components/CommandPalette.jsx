import { useEffect, useMemo, useRef, useState } from 'react'
import { navLinks, profile, projects } from '../data.js'
import { ACCENTS } from '../accents.js'
import { useApp } from '../context.jsx'
import { prefersReducedMotion, useDialog } from '../hooks.js'
import { Icon } from './Icons.jsx'

export default function CommandPalette() {
  const { paletteOpen } = useApp()
  return paletteOpen ? <Palette /> : null
}

function Palette() {
  const { setPaletteOpen, theme, toggleTheme, setAccent, copy, openProject } = useApp()
  const close = () => setPaletteOpen(false)
  const ref = useRef(null)
  const listRef = useRef(null)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  useDialog(ref, close)

  const goTo = (id) => {
    const section = document.getElementById(id)
    if (prefersReducedMotion()) section?.scrollIntoView()
    else section?.scrollIntoView({ behavior: 'smooth' })
  }

  const all = useMemo(
    () => [
      ...navLinks.map((l) => ({ group: 'Go to', label: l.label, icon: l.id, run: () => goTo(l.id) })),
      { group: 'Go to', label: 'GitHub activity', icon: 'github', run: () => goTo('github') },
      ...projects.map((p) => ({ group: 'Projects', label: p.title, hint: 'Open details', icon: 'projects', run: () => openProject(p) })),
      { group: 'Actions', label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', icon: theme === 'dark' ? 'sun' : 'moon', keywords: 'theme dark light', run: toggleTheme },
      { group: 'Actions', label: 'Copy email', hint: profile.email, icon: 'copy', run: () => copy(profile.email, 'Email copied') },
      ...profile.socials.map((s) => ({ group: 'Links', label: s.label, hint: 'Opens in a new tab', icon: 'link', run: () => window.open(s.href, '_blank', 'noopener') })),
      ...ACCENTS.map((a) => ({ group: 'Accent colour', label: a.name, icon: 'palette', swatch: a.value, keywords: 'color accent', run: () => setAccent(a.value) })),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  )

  const items = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    if (!words.length) return all
    return all.filter((c) => {
      const hay = `${c.label} ${c.group} ${c.keywords || ''}`.toLowerCase()
      return words.every((w) => hay.includes(w))
    })
  }, [q, all])

  useEffect(() => {
    const el = listRef.current && listRef.current.querySelector('[aria-selected="true"]')
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [sel, items])

  const run = (item) => {
    if (!item) return
    close()
    setTimeout(item.run, 60) // let the dialog unlock scrolling first
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSel((s) => (items.length ? (s + 1) % items.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel((s) => (items.length ? (s - 1 + items.length) % items.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(items[sel])
    }
  }

  let lastGroup = null
  return (
    <div className="overlay overlay-top">
      <div className="scrim" onClick={close} />
      <div className="palette glass" role="dialog" aria-modal="true" aria-label="Command menu" ref={ref}>
        <div className="palette-search">
          <Icon name="search" />
          <input
            data-autofocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setSel(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="Search sections, projects and actions"
            aria-label="Search commands"
            spellCheck="false"
            autoComplete="off"
          />
        </div>

        <ul className="palette-list" role="listbox" ref={listRef}>
          {items.length === 0 && <li className="palette-empty">Nothing matches "{q}".</li>}
          {items.map((c, i) => {
            const heading = c.group !== lastGroup
            lastGroup = c.group
            return (
              <li key={`${c.group}-${c.label}`} role="presentation">
                {heading && <div className="palette-group">{c.group}</div>}
                <div
                  role="option"
                  aria-selected={i === sel}
                  className={`palette-item ${i === sel ? 'is-sel' : ''}`}
                  onMouseMove={() => i !== sel && setSel(i)}
                  onClick={() => run(c)}
                >
                  {c.swatch ? <span className="swatch swatch-sm" style={{ '--c': c.swatch }} /> : <Icon name={c.icon} />}
                  <span className="palette-label">{c.label}</span>
                  {c.hint && <span className="palette-hint">{c.hint}</span>}
                </div>
              </li>
            )
          })}
        </ul>

        <div className="palette-foot">
          <span>↑ ↓ to move</span>
          <span>Enter to select</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  )
}
