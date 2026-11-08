import { lazy, Suspense, useEffect, useState } from 'react'
import { features, profile, roles, stack } from '../data.js'
import { prefersReducedMotion } from '../hooks.js'

const HeroObject = lazy(() => import('./HeroObject.jsx'))

// depth > 0 moves with the mouse, depth < 0 moves against it
const depths = [14, -20, -16, 22]

function useTyping(words) {
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (prefersReducedMotion()) return
    let w = 0
    let i = words[0].length
    let deleting = false
    let t
    const step = () => {
      const word = words[w]
      if (!deleting) {
        i++
        setText(word.slice(0, i))
        if (i >= word.length) {
          deleting = true
          t = setTimeout(step, 1600)
          return
        }
        t = setTimeout(step, 70)
      } else {
        i--
        setText(word.slice(0, i))
        if (i <= 0) {
          deleting = false
          w = (w + 1) % words.length
          t = setTimeout(step, 350)
          return
        }
        t = setTimeout(step, 35)
      }
    }
    t = setTimeout(step, 2200)
    return () => clearTimeout(t)
  }, [words])
  return text
}

export default function Hero() {
  const typed = useTyping(roles)

  return (
    <section id="home" className="section hero">
      <div className="hero-copy">
        <p className="hero-role">
          <span className="sr-only">{profile.role}</span>
          <span aria-hidden="true">{typed}</span>
          <span className="caret" aria-hidden="true" />
        </p>
        <h1>
          Hi, I'm <span className="hero-name">{profile.name}</span>. I build full-stack web apps.
        </h1>
        <p className="lead">{profile.tagline}</p>
        <div className="actions">
          <a className="btn btn-primary" href="#projects" data-magnetic>View projects</a>
          <a className="btn btn-glass glass" href="#contact" data-magnetic>Get in touch</a>
        </div>
      </div>

      <div className="hero-visual" data-pointer-root>
        {features.hero3d && (
          <Suspense fallback={null}>
            <HeroObject />
          </Suspense>
        )}
        <ul className="stack-grid" aria-label="Tech stack">
          {stack.map((s, i) => (
            <li key={s.letter} className={`stack-tile glass glow pos-${i}`} style={{ '--depth': depths[i] }}>
              <span className="stack-letter">{s.letter}</span>
              <span className="stack-name">{s.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
