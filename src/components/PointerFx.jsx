import { useEffect, useRef } from 'react'
import { features } from '../data.js'
import { hasFinePointer, prefersReducedMotion } from '../hooks.js'

/**
 * One shared pointer loop for:
 *  - cursor dot + ring (+ hover states)
 *  - spotlight glow in the background
 *  - edge glow / sheen on `.glow` cards (--gx / --gy)
 *  - magnetic buttons ([data-magnetic])
 *  - parallax inputs (--nx / --ny on [data-pointer-root])
 */
export default function PointerFx() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (!hasFinePointer()) return
    const root = document.documentElement
    const reduce = prefersReducedMotion()
    if (features.cursor) root.classList.add('has-cursor')

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let rx = tx
    let ry = ty
    let raf = 0
    let live = false

    const tick = () => {
      raf = 0
      const k = reduce ? 1 : 0.2
      rx += (tx - rx) * k
      ry += (ty - ry) * k

      if (dot.current) dot.current.style.transform = `translate3d(${tx}px,${ty}px,0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`

      const nx = ((tx / window.innerWidth) * 2 - 1).toFixed(3)
      const ny = ((ty / window.innerHeight) * 2 - 1).toFixed(3)
      document.querySelectorAll('[data-pointer-root]').forEach((el) => {
        el.style.setProperty('--nx', nx)
        el.style.setProperty('--ny', ny)
      })
      const spot = document.querySelector('.spotlight')
      if (spot) spot.style.transform = `translate3d(${rx}px,${ry}px,0)`

      document.querySelectorAll('.glow').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < -300 || r.top > window.innerHeight + 300) return
        el.style.setProperty('--gx', `${tx - r.left}px`)
        el.style.setProperty('--gy', `${ty - r.top}px`)
      })

      if (!reduce) {
        document.querySelectorAll('[data-magnetic]').forEach((el) => {
          const r = el.getBoundingClientRect()
          const dx = tx - (r.left + r.width / 2)
          const dy = ty - (r.top + r.height / 2)
          const reach = Math.max(r.width, r.height) / 2 + 36
          el.style.translate = Math.hypot(dx, dy) < reach ? `${(dx * 0.28).toFixed(1)}px ${(dy * 0.28).toFixed(1)}px` : ''
        })
      }

      if (Math.abs(tx - rx) > 0.2 || Math.abs(ty - ry) > 0.2) raf = requestAnimationFrame(tick)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (!live) {
        live = true
        rx = tx
        ry = ty
        root.classList.add('pointer-live')
      }
      ring.current && ring.current.classList.remove('is-hidden')
      schedule()
    }

    const onOver = (e) => {
      const t = e.target
      if (!t || !t.closest || !ring.current) return
      const blocked = !!t.closest('.is-upcoming, [aria-disabled="true"]')
      const link = !!t.closest('a, button, [role="button"], [role="option"], [data-cursor]')
      const text = !!t.closest('input, textarea')
      ring.current.classList.toggle('is-blocked', blocked)
      ring.current.classList.toggle('is-link', link && !blocked)
      ring.current.classList.toggle('is-text', text)
    }
    const onDown = () => ring.current && ring.current.classList.add('is-down')
    const onUp = () => ring.current && ring.current.classList.remove('is-down')
    const onLeave = () => {
      ring.current && ring.current.classList.add('is-hidden')
      document.querySelectorAll('[data-magnetic]').forEach((el) => (el.style.translate = ''))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor', 'pointer-live')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true"><i /></div>
    </>
  )
}
