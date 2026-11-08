import { useEffect, useState } from 'react'
import { profile } from '../data.js'
import Reveal from './Reveal.jsx'
import { Icon } from './Icons.jsx'

const PLACEHOLDER_USER = 'your-username'
const WEEKS = 12
const DAYS = WEEKS * 7

const dayKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

function sampleData() {
  const counts = {}
  const today = new Date()
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1
    counts[dayKey(d)] = r < 0.45 ? 0 : Math.round(r * 9)
  }
  const ago = (days) => new Date(Date.now() - days * 864e5).toISOString()
  return {
    sample: true,
    counts,
    repos: [
      { name: 'clyro-store', description: 'Watch store built with the MERN stack.', language: 'JavaScript', stargazers_count: 0, pushed_at: ago(2), html_url: '#' },
      { name: 'vertex-3d', description: '3D product showcase in the browser.', language: 'JavaScript', stargazers_count: 0, pushed_at: ago(6), html_url: '#' },
      { name: 'pulse-engine', description: 'Real-time incident orchestration (in progress).', language: 'JavaScript', stargazers_count: 0, pushed_at: ago(11), html_url: '#' },
    ],
  }
}

async function loadGithub(user) {
  const key = `gh:${user}`
  try {
    const c = JSON.parse(sessionStorage.getItem(key))
    if (c && Date.now() - c.t < 30 * 60e3) return c.data
  } catch (e) { /* no cache */ }

  const [reposRes, eventsRes] = await Promise.all([
    fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=8`),
    fetch(`https://api.github.com/users/${user}/events/public?per_page=100`),
  ])
  if (!reposRes.ok) throw new Error('GitHub request failed')
  const repos = (await reposRes.json()).filter((r) => !r.fork).slice(0, 6)
  const events = eventsRes.ok ? await eventsRes.json() : []

  const counts = {}
  events.forEach((ev) => {
    if (ev.type !== 'PushEvent') return
    const k = dayKey(new Date(ev.created_at))
    counts[k] = (counts[k] || 0) + ((ev.payload && ev.payload.size) || 1)
  })

  const data = { sample: false, counts, repos }
  try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), data })) } catch (e) { /* ignore */ }
  return data
}

function timeAgo(iso) {
  const days = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 864e5))
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.round(days / 30)
  return months === 1 ? '1 month ago' : `${months} months ago`
}

function buildCells(counts) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(today.getDate() - (DAYS - 1))
  const cells = []
  for (let i = 0; i < start.getDay(); i++) cells.push(null) // pad so rows = weekdays
  let total = 0
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const n = counts[dayKey(d)] || 0
    total += n
    const level = n === 0 ? 0 : n < 2 ? 1 : n < 4 ? 2 : n < 7 ? 3 : 4
    cells.push({ n, level, label: `${n} push${n === 1 ? '' : 'es'} on ${d.toDateString()}` })
  }
  return { cells, total, cols: Math.ceil(cells.length / 7) }
}

export default function GithubActivity() {
  const user = profile.githubUser
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let off = false
    if (!user || user === PLACEHOLDER_USER) {
      setState({ status: 'ready', ...sampleData() })
      return
    }
    loadGithub(user)
      .then((data) => !off && setState({ status: 'ready', ...data }))
      .catch(() => !off && setState({ status: 'error' }))
    return () => {
      off = true
    }
  }, [user])

  const grid = state.status === 'ready' ? buildCells(state.counts) : null

  return (
    <section id="github" className="section">
      <Reveal as="h2">GitHub activity</Reveal>

      {state.status === 'loading' && <p className="empty glass">Loading GitHub activity…</p>}

      {state.status === 'error' && (
        <p className="empty glass">
          Couldn't load GitHub right now. You can still{' '}
          <a href={`https://github.com/${user}`} target="_blank" rel="noreferrer" className="text-link">open the profile</a>.
        </p>
      )}

      {grid && (
        <Reveal>
          <div className="github-layout">
            <div className="glass card heat-card">
              <h3>Recent pushes</h3>
              <p className="muted">
                {grid.total} in the last {WEEKS} weeks{state.sample ? ' (sample data)' : ''}
              </p>
              <div className="heat" style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }} role="img" aria-label={`${grid.total} pushes in the last ${WEEKS} weeks`}>
                {grid.cells.map((c, i) =>
                  c ? <i key={i} style={{ '--l': c.level }} title={c.label} /> : <b key={i} />
                )}
              </div>
              {state.sample && <p className="muted small">Set <code>githubUser</code> in src/data.js to show your real activity.</p>}
            </div>

            <ul className="repo-list">
              {state.repos.map((r) => (
                <li key={r.name}>
                  <a className="glass repo" href={r.html_url} target="_blank" rel="noreferrer">
                    <span className="repo-name"><Icon name="github" />{r.name}</span>
                    <span className="repo-desc">{r.description || 'No description yet.'}</span>
                    <span className="repo-meta">
                      {r.language && <span>{r.language}</span>}
                      <span className="repo-star"><Icon name="star" />{r.stargazers_count}</span>
                      <span>Updated {timeAgo(r.pushed_at)}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </section>
  )
}
