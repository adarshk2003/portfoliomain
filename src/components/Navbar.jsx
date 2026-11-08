import { useEffect, useState } from 'react'
import { navLinks, profile } from '../data.js'
import { useApp } from '../context.jsx'
import { useSlidingPill } from '../hooks.js'
import AccentPicker from './AccentPicker.jsx'
import { Icon } from './Icons.jsx'

export default function Navbar({ active }) {
  const { theme, toggleTheme, setPaletteOpen } = useApp()
  const [compact, setCompact] = useState(false)
  const [linksRef, pill] = useSlidingPill('a.is-active', [active, compact])

  // Full-width bar at the top → floating capsule after scrolling
  useEffect(() => {
    let ticking = false
    const update = () => {
      const y = window.scrollY
      // two thresholds (hysteresis) so it never flickers near the edge
      setCompact((prev) => (prev ? y > 8 : y > 48))
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav-wrap ${compact ? 'is-compact' : ''}`}>
      <nav className="nav glass glow" aria-label="Main">
        <a className="brand" href="#home" aria-label={`${profile.name} — home`}>
          <span className="brand-mark">{profile.initials}</span>
          <span className="brand-name">{profile.name}</span>
        </a>

        <div className="nav-links" ref={linksRef}>
          <span
            className={`nav-pill ${pill.ready ? 'ready' : ''} ${pill.animate ? 'animate' : ''}`}
            style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
            aria-hidden="true"
          />
          <ul>
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className={active === l.id ? 'is-active' : ''}
                  aria-current={active === l.id ? 'true' : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setPaletteOpen(true)}
            aria-label="Search and commands"
            title="Search (Ctrl K)"
            data-magnetic
          >
            <Icon name="search" />
          </button>
          <AccentPicker />
          <button
            type="button"
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            data-magnetic
          >
            <Icon name="moon" className="icon-moon" />
            <Icon name="sun" className="icon-sun" />
          </button>
        </div>

        <span className="nav-progress-track" aria-hidden="true">
          <span className="nav-progress" />
        </span>
      </nav>
    </header>
  )
}
