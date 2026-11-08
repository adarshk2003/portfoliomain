import { useEffect, useState } from 'react'
import { features, profile } from '../data.js'
import { prefersReducedMotion } from '../hooks.js'

const seen = () => {
  try { return sessionStorage.getItem('loader-seen') === '1' } catch (e) { return false }
}

export default function Loader() {
  const [phase, setPhase] = useState(() => (features.loader && !seen() ? 'show' : 'gone'))

  useEffect(() => {
    if (phase === 'gone') return
    if (prefersReducedMotion()) {
      setPhase('gone')
      return
    }
    try { sessionStorage.setItem('loader-seen', '1') } catch (e) { /* ignore */ }
    const t1 = setTimeout(() => setPhase('hide'), 1000)
    const t2 = setTimeout(() => setPhase('gone'), 1700)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'gone') return null
  return (
    <div className={`loader ${phase === 'hide' ? 'is-hiding' : ''}`} aria-hidden="true">
      <div className="loader-mark glass">{profile.initials}</div>
    </div>
  )
}
