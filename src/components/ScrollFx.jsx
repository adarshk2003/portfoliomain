import { useEffect } from 'react'
import { prefersReducedMotion } from '../hooks.js'

/** Scroll progress bar in the navbar + hero fade/shrink as you scroll away */
export default function ScrollFx() {
  useEffect(() => {
    const reduce = prefersReducedMotion()
    let raf = 0

    const update = () => {
      raf = 0
      const y = window.scrollY
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

      const bar = document.querySelector('.nav-progress')
      if (bar) bar.style.transform = `scaleX(${Math.min(1, y / max).toFixed(4)})`

      if (reduce) return
      if (window.matchMedia('(max-width: 640px)').matches) {
        const copy = document.querySelector('.hero-copy')
        const vis = document.querySelector('.hero-visual')
        if (copy) {
          copy.style.opacity = ''
          copy.style.transform = ''
        }
        if (vis) {
          vis.style.opacity = ''
          vis.style.transform = ''
        }
        return
      }
      const p = Math.min(1, y / (window.innerHeight * 0.7))
      const copy = document.querySelector('.hero-copy')
      if (copy) {
        copy.style.opacity = String(1 - p * 0.92)
        copy.style.transform = `translate3d(0, ${(-p * 44).toFixed(1)}px, 0) scale(${(1 - p * 0.05).toFixed(3)})`
      }
      const vis = document.querySelector('.hero-visual')
      if (vis) {
        vis.style.opacity = String(1 - p * 0.75)
        vis.style.transform = `translate3d(0, ${(p * 36).toFixed(1)}px, 0)`
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return null
}
