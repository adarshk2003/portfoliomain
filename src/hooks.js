import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Which section is in the middle of the screen */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

/** A highlight pill that glides to the active item inside a container */
export function useSlidingPill(activeSelector, deps) {
  const ref = useRef(null)
  const started = useRef(false)
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false, animate: false })

  const measure = useCallback(() => {
    const root = ref.current
    if (!root) return
    const a = root.querySelector(activeSelector)
    if (!a || !a.offsetWidth) {
      setPill((p) => (p.ready ? { ...p, ready: false } : p))
      return
    }
    setPill({ x: a.offsetLeft, w: a.offsetWidth, ready: true, animate: started.current })
    started.current = true
  }, [activeSelector])

  useLayoutEffect(() => {
    measure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps])

  useEffect(() => {
    window.addEventListener('resize', measure)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  return [ref, pill]
}

/** 3D tilt that follows the pointer (sets --rx / --ry on the element) */
export function useTilt(max = 7) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !hasFinePointer() || prefersReducedMotion()) return
    let raf = 0
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${((0.5 - py) * max * 2).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${((px - 0.5) * max * 2).toFixed(2)}deg`)
      })
    }
    const leave = () => {
      cancelAnimationFrame(raf)
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [max])
  return ref
}

/** Dialog behaviour: Esc to close, focus trap, scroll lock, restore focus. Mount it only while open. */
export function useDialog(ref, onClose) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const el = ref.current
    const prev = document.activeElement
    const focusables = () =>
      el ? [...el.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')] : []
    const target = (el && el.querySelector('[data-autofocus]')) || focusables()[0]
    if (target) target.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
      } else if (e.key === 'Tab') {
        const f = focusables()
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('no-scroll')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('no-scroll')
      if (prev && prev.focus) prev.focus()
    }
  }, [ref])
}
