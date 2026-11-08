import { navLinks } from '../data.js'
import { Icon } from './Icons.jsx'

/** iOS-style tab bar, shown on phones only (CSS) */
export default function Dock({ active }) {
  return (
    <nav className="dock glass" aria-label="Sections">
      {navLinks.map((l) => (
        <a
          key={l.id}
          href={`#${l.id}`}
          className={active === l.id ? 'is-active' : ''}
          aria-current={active === l.id ? 'true' : undefined}
        >
          <Icon name={l.id} />
          <span>{l.label}</span>
        </a>
      ))}
    </nav>
  )
}
