import { profile } from '../data.js'
import { useApp } from '../context.jsx'
import Reveal from './Reveal.jsx'
import { Icon } from './Icons.jsx'

export default function Contact() {
  const { copy } = useApp()
  return (
    <section id="contact" className="section contact">
      <Reveal>
        <div className="glass card contact-card">
          <h2>Have a project in mind?</h2>
          <p className="lead">I'm open to freelance work and full-time roles. Send me a message and I'll reply within a day.</p>
          <div className="actions center">
            <a className="btn btn-primary" href={`mailto:${profile.email}`} data-magnetic>Email me</a>
            <button
              type="button"
              className="btn btn-glass glass"
              onClick={() => copy(profile.email, 'Email copied')}
              data-magnetic
            >
              <Icon name="copy" /> Copy email
            </button>
            {profile.socials.map((s) => (
              <a key={s.label} className="btn btn-glass glass" href={s.href} target="_blank" rel="noreferrer" data-magnetic>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
