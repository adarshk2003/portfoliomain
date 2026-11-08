# MERN Portfolio (React + Vite)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Edit your content
Everything is in **src/data.js**: name, roles, about text, links, skills, journey timeline,
projects (with details, highlights, live/repo links, gallery) and upcoming projects.

- Screenshots: put each project's images in its matching `public/projects/<ProjectName>/` folder, then set its `image` and `gallery` paths in `src/data.js`. Clyro's screenshots are already configured as an example.
- GitHub section: set `profile.githubUser` to your username to show real repos + recent pushes.
- Turn effects on/off in the `features` object at the top of data.js (cursor, refraction, loader, hero3d).

## What's inside
- Glass navbar: full width on top → capsule on scroll, sliding active pill, scroll progress line
- Light/dark theme toggle + accent colour picker (saved in the browser; iOS blue by default)
- Mouse effects: spotlight, card edge glow, 3D tilt, magnetic buttons, custom cursor, parallax tiles, drifting background
- Reduced-motion support, readable light/dark glass surfaces, and touch-friendly mobile navigation
- Subtle liquid-glass refraction, layered highlights, and edge reflections on the navbar and hero tiles (Chromium browsers; blurred-glass fallback elsewhere)
- Smooth, consistent motion, a clearer hero accent, and refined project-card previews
- Live 3D object in the hero (three.js), project filter tabs, project details sheet
- Command palette (Ctrl/Cmd + K), copy-email toast, mobile bottom dock, intro loader
- Easter egg: ↑ ↑ ↓ ↓ ← → ← → B A
