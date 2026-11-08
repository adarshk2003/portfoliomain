import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context.jsx'
import { useDialog } from '../hooks.js'
import Cover from './Cover.jsx'
import { Icon } from './Icons.jsx'

export default function ProjectModal() {
  const { project } = useApp()
  return project ? <Sheet key={project.title} /> : null
}

function LinkButton({ href, children, primary }) {
  if (href) {
    return (
      <a className={`btn ${primary ? 'btn-primary' : 'btn-glass glass'}`} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }
  return (
    <span className="btn btn-glass glass is-disabled" aria-disabled="true">
      {children} · soon
    </span>
  )
}

function Sheet() {
  const { project: p, closeProject } = useApp()
  const ref = useRef(null)
  const [i, setI] = useState(0)
  useDialog(ref, closeProject)

  const slides = p.gallery && p.gallery.length ? p.gallery : [p.image || '', '', '']
  const go = (n) => setI((cur) => (cur + n + slides.length) % slides.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length])

  return (
    <div className="overlay">
      <div className="scrim" onClick={closeProject} />
      <div className="sheet glass" role="dialog" aria-modal="true" aria-labelledby="sheet-title" ref={ref}>
        <button type="button" className="icon-btn sheet-close" onClick={closeProject} aria-label="Close" data-autofocus>
          <Icon name="close" />
        </button>

        <div className="gallery">
          <div className="track" style={{ transform: `translateX(-${i * 100}%)` }}>
            {slides.map((s, k) => (
              <div className="slide" key={k} aria-hidden={k !== i}>
                <Cover image={s} title={`${p.title} ${k + 1}`} hue={[p.hue[0] + k * 28, p.hue[1] + k * 28]} />
              </div>
            ))}
          </div>
          {slides.length > 1 && (
            <>
              <button type="button" className="icon-btn g-prev" onClick={() => go(-1)} aria-label="Previous image">
                <Icon name="prev" />
              </button>
              <button type="button" className="icon-btn g-next" onClick={() => go(1)} aria-label="Next image">
                <Icon name="next" />
              </button>
              <div className="dots">
                {slides.map((_, k) => (
                  <button
                    key={k}
                    type="button"
                    className={k === i ? 'is-on' : ''}
                    onClick={() => setI(k)}
                    aria-label={`Image ${k + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="sheet-body">
          <h3 id="sheet-title">{p.title}</h3>
          <p className="lead">{p.details || p.description}</p>
          {p.highlights && p.highlights.length > 0 && (
            <ul className="highlights">
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          <ul className="chips">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="actions">
            <LinkButton href={p.live} primary>Live demo</LinkButton>
            <LinkButton href={p.repo}>Source code</LinkButton>
          </div>
        </div>
      </div>
    </div>
  )
}
