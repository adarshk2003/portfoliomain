import { useState } from 'react'
import { categories, projects, upcoming } from '../data.js'
import { useApp } from '../context.jsx'
import { useSlidingPill, useTilt } from '../hooks.js'
import Cover from './Cover.jsx'
import Reveal from './Reveal.jsx'

function Tags({ tags }) {
  return (
    <ul className="chips chips-sm">
      {tags.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}

function ProjectCard({ p }) {
  const { openProject } = useApp()
  const tilt = useTilt(4)
  return (
    <article ref={tilt} className="glass tilt project">
      <Cover {...p} />
      <span className="project-preview glass" aria-hidden="true">View details</span>
      <div className="project-body">
        <h3>
          <button
            type="button"
            className="project-open"
            onClick={() => openProject(p)}
            aria-haspopup="dialog"
            aria-label={`View details for ${p.title}`}
          >
            {p.title}
          </button>
        </h3>
        <p>{p.description}</p>
        <Tags tags={p.tags} />
      </div>
    </article>
  )
}

export default function Projects() {
  const [cat, setCat] = useState('All')
  const [tabsRef, pill] = useSlidingPill('button[aria-selected="true"]', [cat])

  const match = (p) => cat === 'All' || p.categories.includes(cat)
  const live = projects.filter(match)
  const soon = upcoming.filter(match)

  return (
    <section id="projects" className="section">
      <Reveal as="h2">Projects</Reveal>

      <div className="tabs glass" role="tablist" aria-label="Filter projects" ref={tabsRef}>
        <span
          className={`pill ${pill.ready ? 'ready' : ''} ${pill.animate ? 'animate' : ''}`}
          style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
          aria-hidden="true"
        />
        {categories.map((c) => (
          <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {live.length > 0 ? (
        <div className="projects-grid">
          {live.map((p, i) => (
            <Reveal key={`${cat}-${p.title}`} delay={i * 80}>
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="empty glass">No finished {cat} projects yet. Check the ones coming soon below.</p>
      )}

      {soon.length > 0 && (
        <>
          <Reveal as="h3" className="subhead">Coming soon</Reveal>
          <div className="projects-grid">
            {soon.map((p, i) => (
              <Reveal key={`${cat}-${p.title}`} delay={i * 80}>
                <article className="glass project is-upcoming" aria-disabled="true">
                  <Cover {...p} />
                  <span className="badge">Coming soon</span>
                  <div className="project-body">
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <Tags tags={p.tags} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
