// ─────────────────────────────────────────────
//  EDIT THIS FILE — all text and links live here
// ─────────────────────────────────────────────

// Switch effects on/off
export const features = {
  cursor: true,      // custom dot + ring cursor (desktop mouse only)
  refraction: true,  // "liquid glass" bending on the navbar + hero tiles (Chromium browsers only)
  loader: true,      // short splash on first visit
  hero3d: true,      // live 3D object in the hero (loads three.js)
}

export const profile = {
  name: 'ADARSH',
  initials: 'AK',
  role: 'MERN Stack Developer',
  tagline:
    'I design and build fast, full-stack web apps with MongoDB, Express, React and Node.js — from database schema to pixel-perfect UI.',
  about: [
    "I'm a full-stack developer who enjoys turning ideas into reliable products. I work across the whole MERN stack: modelling data, building REST APIs, and crafting responsive interfaces.",
    'I care about clean code, good UX and shipping things that people actually use. Right now I am building side projects and looking for opportunities to grow with a great team.',
  ],
  email: 'kadarsh122003@gmail.com',
  githubUser: 'adarshk2003', // set your real GitHub username to load live repos + activity
  socials: [
    { label: 'GitHub', href: 'https://github.com/adarshk2003' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/adarsh-k-154631348 ' },
    { label: 'Twitter', href: 'https://twitter.com/your-username' },
  ],
  resume: 'https://drive.google.com/file/d/10cblrElsl28QtPSXG9Iase-sSA2Qs_pO/view?usp=drive_link', // put a link to your CV here
}

// Words that type out under your name in the hero
export const roles = ['MERN Stack Developer', 'Full-Stack Engineer', 'React Developer', 'Node.js Developer']

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export const stack = [
  { letter: 'M', name: 'MongoDB' },
  { letter: 'E', name: 'Express' },
  { letter: 'R', name: 'React' },
  { letter: 'N', name: 'Node.js' },
]

export const skills = [
  { group: 'Frontend', items: ['React', 'Vite', 'JavaScript', 'TypeScript', 'Redux Toolkit', 'Tailwind CSS', 'HTML & CSS'] },
  { group: 'Backend', items: ['Node.js', 'Express', 'REST APIs', 'JWT Auth', 'Socket.io', 'Validation' , 'BullMQ'] },
  { group: 'Database', items: ['MongoDB', 'Mongoose', 'Aggregation', 'Indexing', 'Redis', 'PostgreSQL'] },
  { group: 'Tools', items: ['Git & GitHub', 'Postman', 'Docker', 'Vercel', 'Render', 'Linux'] },
]

// My journey — education, development, and professional experience
export const timeline = [
  {
    when: '2021',
    title: 'Started my BCA journey',
    text: 'Began my Bachelor of Computer Applications, building a foundation in computer science, programming, and software development.'
  },
  {
    when: '2024',
    title: 'Graduated and pursued MERN stack',
    text: 'Completed my BCA and started learning full-stack web development with MongoDB, Express.js, React.js, and Node.js.'
  },
  {
    when: '2024',
    title: 'Gained hands-on development experience',
    text: 'Joined Synnefo Solutions as a Full Stack Developer Intern, applying MERN stack skills to real-world application development.'
  },
  {
    when: '2025',
    title: 'Built Clyro & Vertex',
    text: 'Developed Clyro, a watch store application, and Vertex, a 3D model showcase using modern web technologies.'
  },
  {
    when: '2025',
    title: 'Entered industrial electrical engineering',
    text: 'Took on a Technical Engineer role in the industrial electrical field, gaining practical experience in electrical systems and technical troubleshooting.'
  },

{
  when: 'Now',
  title: 'Building PulseEngine',
  text: 'Developing an upcoming distributed, real-time incident orchestration and observability platform focused on event processing, incident management, and system reliability.'
},
]

export const categories = ['All', 'Web', '3D', 'Backend']

/*
  Projects
  - categories: used by the filter tabs (All / Web / 3D / Backend)
  - image:   cover screenshot, e.g. '/projects/Clyro/cover.png' (file goes in /public/projects/<ProjectName>). '' = gradient placeholder
  - gallery: extra screenshots shown in the details sheet. [] = placeholders
  - live / repo: your URLs. '' = button shows "coming soon"
  - hue:     two colour hues (0–360) for the placeholder cover
*/
export const projects = [
  {
    title: 'Clyro',
    categories: ['Web'],
    description: 'A watch store with a clean product catalogue, search and filters, cart and checkout, built on the MERN stack.',
    details:
      'Clyro is a watch store built end to end on the MERN stack. Shoppers can browse the catalogue, search and filter, add watches to a cart and check out.',
    highlights: [
      'Product catalogue with search and filters',
      'Cart and checkout flow',
      'REST API with Express and MongoDB',
      'Responsive storefront built in React',
    ],
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'JWT Auth', 'REST API'],
    live: 'https://watchstore-frontent.onrender.com/',
    repo: '',
    image: '/projects/Clyro/Screenshot 2026-11-07 171958.png',
    gallery: [
      '/projects/Clyro/Screenshot 2026-11-07 171958.png',
      '/projects/Clyro/Screenshot 2026-11-07 172440.png',
      '/projects/Clyro/Screenshot 2026-11-07 172405.png',
      '/projects/Clyro/Screenshot 2026-11-07 171758.png',
    ],
    hue: [215, 265],
  },
  {
    title: 'Vertex',
    categories: ['Web', '3D'],
    description: 'A 3D product showcase where visitors can rotate, zoom and explore items in the browser.',
    details:
      'Vertex is a 3D showcase for products. Visitors can rotate, zoom and inspect items right in the browser, with no plugins needed.',
    highlights: [
      'Interactive 3D viewer',
      'Smooth orbit and zoom controls',
      'Runs in the browser with WebGL',
      'likes and comments for each product',
      'login and user profiles with JWT authentication',
    ],
    tags: ['React', 'Three.js', 'WebGL', 'Node.js', 'Express', 'MongoDB', 'JWT Auth'],
    live: '',
    repo: 'https://github.com/adarshk2003/vertex3d',
    image: '/projects/Vertex/Screenshot 2026-11-07 181029.png',
    gallery: [
      '/projects/Vertex/Screenshot 2026-11-07 180959.png',
      '/projects/Vertex/Screenshot 2026-11-07 181029.png',
      '/projects/Vertex/Screenshot 2026-11-07 181223.png'
    ],
    hue: [165, 205],
  },
{
  title: 'Grab',
  categories: ['Web', 'Media Tools'],
  description:
    'A web-based media extractor for finding and extracting images and videos from websites.',
  details:
    'Grab simplifies media extraction with a streamlined interface for discovering and processing image and video resources from supported websites.',
  highlights: [
    'Image and video extraction',
    'Website media resource detection',
    'Video extraction powered by yt-dlp',
    'Media processing with FFmpeg',
    'Simple and intuitive interface',
  ],
  tags: ['yt-dlp', 'FFmpeg' ,'Node.js', 'Express', 'React'],
  live: '',
  repo: '',
  image: '/projects/Grab/Screenshot 2026-11-07 175640.png',
  gallery: [
    '/projects/Grab/Screenshot 2026-11-07 175640.png',
    '/projects/Grab/Screenshot 2026-11-07 180428.png'
  ],
 hue: [195, 225],
},

]

export const upcoming = [
  {
    title: 'PulseEngine',
    categories: ['Backend'],
    description: 'Distributed real-time incident orchestration and observability platform: detect, route and resolve incidents as they happen.',
    tags: ['Node.js', 'WebSockets', 'Distributed Systems', 'Observability', 'Event Processing', 'Incident Management','bullmq', 'Redis', 'PostgreSQL'],
    image: '/projects/PulseEngine/Screenshot 2026-11-07 182101.png',
    hue: [20, 50],
  },
]
