import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ACCENTS } from '../accents.js'
import { useApp } from '../context.jsx'

export default function AccentPicker() {
  const { accent, setAccent } = useApp()
  const [pos, setPos] = useState(null) // null = closed
  const btn = useRef(null)
  const pop = useRef(null)
  const open = !!pos

  const toggle = () => {
    if (open) return setPos(null)
    const r = btn.current.getBoundingClientRect()
    setPos({ top: r.bottom + 12, right: Math.max(8, window.innerWidth - r.right - 8) })
  }

  useEffect(() => {
    if (!open) return
    const close = () => setPos(null)
    const onDown = (e) => {
      if (pop.current && pop.current.contains(e.target)) return
      if (btn.current && btn.current.contains(e.target)) return
      close()
    }
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', close, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', close)
    }
  }, [open])

  return (
    <>
      <button
        ref={btn}
        type="button"
        className="icon-btn"
        onClick={toggle}
        aria-label="Accent colour"
        aria-expanded={open}
        title="Accent colour"
        data-magnetic
      >
        <span className="accent-dot" />
      </button>

      {open &&
        createPortal(
          <div ref={pop} className="accent-pop glass" style={{ top: pos.top, right: pos.right }} role="group" aria-label="Accent colours">
            {ACCENTS.map((a) => (
              <button
                key={a.value}
                type="button"
                className="swatch"
                style={{ '--c': a.value }}
                aria-label={a.name}
                aria-pressed={a.value === accent}
                onClick={() => setAccent(a.value)}
              />
            ))}
          </div>,
          document.body
        )}
    </>
  )
}
