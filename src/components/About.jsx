import { profile } from '../data.js'
import Reveal from './Reveal.jsx'

export default function About() {
  return (
    <section id="about" className="section">
      <Reveal as="h2">About me</Reveal>
      <Reveal delay={80}>
        <div className="glass card about-card">
          {profile.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <a className="btn btn-glass glass" href={profile.resume} data-magnetic>Download résumé</a>
        </div>
      </Reveal>
    </section>
  )
}
