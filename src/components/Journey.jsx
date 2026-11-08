import { timeline } from '../data.js'
import Reveal from './Reveal.jsx'

export default function Journey() {
  return (
    <section id="journey" className="section">
      <Reveal as="h2">Journey</Reveal>
      <ol className="timeline">
        {timeline.map((t, i) => (
          <Reveal as="li" key={t.title} delay={i * 60} className="tl-item">
            <span className="tl-dot" aria-hidden="true" />
            <span className="tl-when">{t.when}</span>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
