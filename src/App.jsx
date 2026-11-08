import { AppProvider } from './context.jsx'
import { navLinks, profile } from './data.js'
import { useActiveSection } from './hooks.js'
import Loader from './components/Loader.jsx'
import PointerFx from './components/PointerFx.jsx'
import ScrollFx from './components/ScrollFx.jsx'
import Navbar from './components/Navbar.jsx'
import Dock from './components/Dock.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Journey from './components/Journey.jsx'
import GithubActivity from './components/GithubActivity.jsx'
import Contact from './components/Contact.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import ProjectModal from './components/ProjectModal.jsx'
import Toast from './components/Toast.jsx'

const sectionIds = navLinks.map((l) => l.id)

export default function App() {
  const active = useActiveSection(sectionIds)

  return (
    <AppProvider>
      {/* SVG filter used for the liquid-glass refraction (Chromium) */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <filter id="liquid" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.014" numOctaves="2" seed="4" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="1.5" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="12" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <Loader />
      <PointerFx />
      <ScrollFx />

      <div className="ambient" data-pointer-root aria-hidden="true">
        <span />
        <span />
        <span />
        <div className="spotlight" />
      </div>

      <Navbar active={active} />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <GithubActivity />
        <Contact />
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} {profile.name}. Built with React &amp; Vite. Press Ctrl K for the command menu.
      </footer>

      <Dock active={active} />
      <CommandPalette />
      <ProjectModal />
      <Toast />
    </AppProvider>
  )
}
