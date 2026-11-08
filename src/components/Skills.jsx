import { skills } from '../data.js'
import Reveal from './Reveal.jsx'

export default function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal as="h2">Skills</Reveal>
      <div className="skills-grid">
        {skills.map((g, i) => (
          <Reveal key={g.group} delay={i * 70}>
            <article className="glass card">
              <h3>{g.group}</h3>
              <ul className="chips">
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
