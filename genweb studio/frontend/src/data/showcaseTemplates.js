/**
 * Curated Showcase Templates for GenWeb Studio
 * Provides pre-built, production-quality templates for Explore section
 */

export const SHOWCASE_TEMPLATES = {
  "dummy-apex-portfolio": {
    id: "dummy-apex-portfolio",
    name: "Apex Portfolio Studio",
    description: "Ultra-sleek personal developer portfolio with interactive project showcases, responsive timeline, skills grid, and contact form.",
    projectType: "plain",
    votes: { upvotes: 148, downvotes: 4 },
    html: `<div id="layout">
  <header class="draggable vertical" id="header">
    <nav class="navbar">
      <div class="logo">⚡ APEX.STUDIO</div>
      <ul class="nav-links">
        <li><a href="#hero">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Work</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#contact" class="btn-primary">Let's Talk</a></li>
      </ul>
    </nav>
  </header>

  <section class="draggable vertical hero-section" id="hero">
    <div class="hero-badge">✦ Available for Freelance & Contract</div>
    <h1 class="hero-title">Crafting <span class="gradient-text">Exceptional</span> Digital Experiences</h1>
    <p class="hero-subtitle">Senior Full-Stack Developer & UI/UX Architect with 6+ years specializing in high-performance web applications, fluid motion, and scalable cloud architectures.</p>
    <div class="hero-actions">
      <a href="#projects" class="btn-primary">Explore Featured Projects →</a>
      <a href="#contact" class="btn-secondary">Get in Touch</a>
    </div>
    <div class="stats-row">
      <div class="stat-card"><h3>60+</h3><p>Projects Shipped</p></div>
      <div class="stat-card"><h3>99.9%</h3><p>Uptime Record</p></div>
      <div class="stat-card"><h3>18+</h3><p>Awards & Honors</p></div>
    </div>
  </section>

  <section class="draggable vertical projects-section" id="projects">
    <div class="section-header">
      <span class="section-tag">PORTFOLIO</span>
      <h2>Featured Creations</h2>
      <p>A selection of recent projects built with modern web technologies.</p>
    </div>
    <div class="projects-grid">
      <div class="project-card">
        <div class="project-header">
          <span class="project-tag">FINTECH / WEB3</span>
          <h3>Krypton Analytics</h3>
        </div>
        <p>Real-time cryptocurrency portfolio tracking platform processing over $40M daily volume.</p>
        <div class="tags"><span>React</span><span>WebSockets</span><span>Tailwind</span></div>
      </div>
      <div class="project-card">
        <div class="project-header">
          <span class="project-tag">AI / SAAS</span>
          <h3>NeuralFlow Engine</h3>
        </div>
        <p>Generative intelligence workspace empowering over 120,000 developers worldwide.</p>
        <div class="tags"><span>Next.js</span><span>Python</span><span>PostgreSQL</span></div>
      </div>
      <div class="project-card">
        <div class="project-header">
          <span class="project-tag">ECOMMERCE</span>
          <h3>Luxe Atelier</h3>
        </div>
        <p>High-end sustainable fashion storefront featuring sub-second global page loads.</p>
        <div class="tags"><span>Shopify Plus</span><span>TypeScript</span><span>Three.js</span></div>
      </div>
    </div>
  </section>

  <section class="draggable vertical skills-section" id="skills">
    <div class="section-header">
      <span class="section-tag">CAPABILITIES</span>
      <h2>Technical Mastery</h2>
      <p>Modern engineering toolstack honed through years of production delivery.</p>
    </div>
    <div class="skills-grid">
      <div class="skill-item"><strong>Frontend</strong><span>React, Vue, TypeScript, Tailwind, WebGL, Motion</span></div>
      <div class="skill-item"><strong>Backend</strong><span>Node.js, Go, Python, GraphQL, REST, Microservices</span></div>
      <div class="skill-item"><strong>Database</strong><span>PostgreSQL, Redis, MongoDB, Vector DBs, Prisma</span></div>
      <div class="skill-item"><strong>DevOps</strong><span>Docker, AWS, Vercel, CI/CD, Kubernetes, Cloudflare</span></div>
    </div>
  </section>

  <section class="draggable vertical contact-section" id="contact">
    <div class="contact-box">
      <h2>Have a project in mind?</h2>
      <p>I'm currently accepting select new projects for 2026. Send me a note and let's build something remarkable.</p>
      <form class="contact-form" onsubmit="event.preventDefault(); alert('Thank you for reaching out! Your message was sent.');">
        <div class="form-row">
          <input type="text" placeholder="Your Name" required class="input" />
          <input type="email" placeholder="Your Email" required class="input" />
        </div>
        <textarea placeholder="Tell me about your project..." rows="4" required class="input"></textarea>
        <button type="submit" class="btn-primary">Send Message 🚀</button>
      </form>
    </div>
  </section>

  <footer class="draggable vertical footer" id="footer">
    <p>© 2026 Apex Portfolio Studio. Built with GenWeb Studio.</p>
  </footer>
</div>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #0b0f19;
  color: #f1f5f9;
  line-height: 1.6;
}
#layout { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.navbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,0.08);
}
.logo { font-size: 20px; font-weight: 800; letter-spacing: 1px; color: #6366f1; }
.nav-links { display: flex; list-style: none; gap: 24px; align-items: center; }
.nav-links a { color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
.nav-links a:hover { color: #ffffff; }
.btn-primary {
  background: #6366f1; color: #fff !important; padding: 10px 22px;
  border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 600;
  border: none; cursor: pointer; transition: background 0.2s, transform 0.2s; display: inline-block;
}
.btn-primary:hover { background: #4f46e5; transform: translateY(-1px); }
.btn-secondary {
  background: rgba(255,255,255,0.08); color: #fff; padding: 10px 22px;
  border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 600;
  border: 1px solid rgba(255,255,255,0.15); display: inline-block; transition: background 0.2s;
}
.btn-secondary:hover { background: rgba(255,255,255,0.15); }
.hero-section { padding: 90px 0 60px; text-align: center; }
.hero-badge {
  display: inline-block; padding: 6px 16px; background: rgba(99,102,241,0.15);
  color: #818cf8; border: 1px solid rgba(99,102,241,0.3); border-radius: 9999px;
  font-size: 12px; font-weight: 600; margin-bottom: 24px;
}
.hero-title { font-size: 54px; font-weight: 900; line-height: 1.15; margin-bottom: 20px; max-width: 900px; margin-left: auto; margin-right: auto; }
.gradient-text { background: linear-gradient(135deg, #818cf8, #c084fc, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-subtitle { font-size: 18px; color: #94a3b8; max-width: 680px; margin: 0 auto 36px; }
.hero-actions { display: flex; gap: 16px; justify-content: center; margin-bottom: 60px; }
.stats-row { display: flex; justify-content: center; gap: 48px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 40px; }
.stat-card h3 { font-size: 36px; color: #fff; font-weight: 800; }
.stat-card p { font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.section-header { text-align: center; margin-bottom: 48px; padding-top: 60px; }
.section-tag { font-size: 11px; font-weight: 700; color: #818cf8; letter-spacing: 1.5px; text-transform: uppercase; }
.section-header h2 { font-size: 36px; font-weight: 800; margin: 8px 0; }
.section-header p { color: #94a3b8; font-size: 15px; }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
.project-card {
  background: #131a29; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px;
  padding: 32px; transition: transform 0.25s, border-color 0.25s;
}
.project-card:hover { transform: translateY(-4px); border-color: rgba(99,102,241,0.5); }
.project-tag { font-size: 11px; color: #818cf8; font-weight: 700; letter-spacing: 1px; }
.project-card h3 { font-size: 22px; font-weight: 700; margin: 8px 0 12px; }
.project-card p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }
.tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tags span { background: rgba(255,255,255,0.06); padding: 4px 12px; border-radius: 9999px; font-size: 12px; color: #cbd5e1; }
.skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.skill-item { background: #131a29; padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); }
.skill-item strong { display: block; font-size: 16px; color: #818cf8; margin-bottom: 8px; }
.skill-item span { font-size: 13px; color: #94a3b8; }
.contact-box {
  background: linear-gradient(135deg, #131a29, #1e1b4b); border: 1px solid rgba(99,102,241,0.3);
  border-radius: 24px; padding: 56px 40px; text-align: center; margin: 60px 0;
}
.contact-box h2 { font-size: 36px; font-weight: 800; margin-bottom: 12px; }
.contact-box p { color: #94a3b8; font-size: 15px; max-width: 500px; margin: 0 auto 32px; }
.contact-form { max-width: 520px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }
.form-row { display: flex; gap: 14px; }
.input {
  width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px; padding: 12px 16px; color: #fff; font-size: 14px; outline: none;
}
.input:focus { border-color: #6366f1; }
.footer { text-align: center; padding: 40px 0; border-top: 1px solid rgba(255,255,255,0.06); color: #64748b; font-size: 13px; }
@media (max-width: 768px) {
  .hero-title { font-size: 38px; }
  .form-row { flex-direction: column; }
  .nav-links { display: none; }
}`,
    js: `console.log("Apex Portfolio Studio initialized.");`
  },

  "dummy-novu-saas": {
    id: "dummy-novu-saas",
    name: "Novu SaaS Landing Page",
    description: "High-conversion product landing page featuring interactive pricing calculators, testimonial carousels, feature comparisons, and email signup.",
    projectType: "plain",
    votes: { upvotes: 215, downvotes: 9 },
    html: `<div id="layout">
  <header class="draggable vertical">
    <nav class="nav">
      <div class="brand">🚀 NovuCloud</div>
      <div class="links">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
        <a href="#signup" class="btn-pill">Start Free Trial</a>
      </div>
    </nav>
  </header>
  <section class="draggable vertical hero" id="hero">
    <span class="pill">⚡ Version 3.0 Released</span>
    <h1>Automate Your Infrastructure with AI Telemetry</h1>
    <p>Deploy multi-region cloud workloads with zero downtime and automatic self-healing resilience.</p>
    <div class="cta-group">
      <input type="email" placeholder="Enter your work email" class="email-input" />
      <button class="btn-pill">Get Started</button>
    </div>
  </section>
  <section class="draggable vertical features" id="features">
    <div class="feat-card"><h3>Global CDN</h3><p>Sub-10ms response times worldwide across 280 edge locations.</p></div>
    <div class="feat-card"><h3>Smart Failover</h3><p>Instant traffic rerouting during datacenter degradation.</p></div>
    <div class="feat-card"><h3>Enterprise Security</h3><p>SOC-2 Type II certified and automated cryptographic audit logs.</p></div>
  </section>
  <footer class="draggable vertical footer">
    <p>© 2026 NovuCloud Inc. All rights reserved.</p>
  </footer>
</div>`,
    css: `body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
.nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #1e293b; }
.brand { font-size: 22px; font-weight: 800; color: #38bdf8; }
.links a { color: #94a3b8; text-decoration: none; margin-left: 20px; font-size: 14px; }
.btn-pill { background: #38bdf8; color: #0f172a !important; padding: 10px 24px; border-radius: 9999px; font-weight: 700; border: none; cursor: pointer; }
.hero { text-align: center; padding: 80px 20px; max-width: 800px; margin: 0 auto; }
.pill { background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 6px 16px; border-radius: 9999px; font-size: 12px; font-weight: 700; }
.hero h1 { font-size: 48px; font-weight: 900; margin: 20px 0; line-height: 1.2; }
.hero p { color: #94a3b8; font-size: 18px; margin-bottom: 30px; }
.cta-group { display: flex; justify-content: center; gap: 10px; max-width: 460px; margin: 0 auto; }
.email-input { background: #1e293b; border: 1px solid #334155; padding: 12px 18px; border-radius: 9999px; color: #fff; flex: 1; outline: none; }
.features { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; max-width: 1000px; margin: 60px auto; }
.feat-card { background: #1e293b; padding: 30px; border-radius: 20px; border: 1px solid #334155; }
.feat-card h3 { font-size: 20px; color: #38bdf8; margin-bottom: 10px; }
.feat-card p { color: #94a3b8; font-size: 14px; }
.footer { text-align: center; padding: 40px; color: #64748b; font-size: 13px; }`,
    js: `console.log("NovuCloud ready.");`
  },

  "dummy-lumina-agency": {
    id: "dummy-lumina-agency",
    name: "Lumina Creative Agency",
    description: "Vibrant bright-themed digital agency website with bold typography, interactive client case studies, team grid, and service rate cards.",
    projectType: "plain",
    votes: { upvotes: 94, downvotes: 2 },
    html: `<div id="layout">
  <header class="draggable vertical">
    <div class="nav-bar">
      <div class="brand">LUMINA.</div>
      <div class="nav-menu">
        <a href="#services">Services</a>
        <a href="#work">Case Studies</a>
        <a href="#about">About</a>
        <a href="#contact" class="btn-bright">Start Project</a>
      </div>
    </div>
  </header>
  <section class="draggable vertical hero-bright" id="hero">
    <span class="tagline">WE DESIGN TOMORROW'S BRANDS</span>
    <h1 class="main-title">We turn bold ideas into category-defining digital products.</h1>
    <p class="subtitle">A full-service creative partner for high-growth tech innovators and culture-shaping brands.</p>
  </section>
  <section class="draggable vertical services-bright" id="services">
    <div class="service-card">
      <span class="num">01</span>
      <h3>Brand Strategy</h3>
      <p>Identity systems, typography, design systems, and brand storytelling that captivates audiences.</p>
    </div>
    <div class="service-card">
      <span class="num">02</span>
      <h3>Product Design</h3>
      <p>Intuitive UX architectures, high-fidelity UI design, dynamic design systems, and rapid prototypes.</p>
    </div>
    <div class="service-card">
      <span class="num">03</span>
      <h3>Creative Engineering</h3>
      <p>Cutting-edge web engineering with fluid 60fps animations, WebGL, and global cloud hosting.</p>
    </div>
  </section>
  <footer class="draggable vertical footer-bright" id="footer">
    <p>© 2026 Lumina Creative Studio. All Rights Reserved.</p>
  </footer>
</div>`,
    css: `body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fafafa; color: #09090b; margin: 0; padding: 0; }
#layout { max-width: 1160px; margin: 0 auto; padding: 24px; }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 2px solid #e4e4e7; }
.brand { font-size: 26px; font-weight: 900; letter-spacing: -1px; color: #18181b; }
.nav-menu a { color: #52525b; text-decoration: none; margin-left: 28px; font-weight: 600; font-size: 14px; }
.nav-menu a:hover { color: #000; }
.btn-bright { background: #000; color: #fff !important; padding: 10px 24px; border-radius: 9999px; }
.hero-bright { padding: 90px 0 60px; }
.tagline { font-size: 12px; font-weight: 800; letter-spacing: 2px; color: #f97316; }
.main-title { font-size: 56px; font-weight: 900; line-height: 1.1; margin: 18px 0; max-width: 900px; color: #09090b; }
.subtitle { font-size: 20px; color: #71717a; max-width: 640px; line-height: 1.6; }
.services-bright { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px; margin: 60px 0; }
.service-card { background: #ffffff; border: 1px solid #e4e4e7; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
.num { font-size: 18px; font-weight: 800; color: #f97316; }
.service-card h3 { font-size: 24px; font-weight: 800; margin: 16px 0 10px; }
.service-card p { color: #71717a; font-size: 15px; line-height: 1.6; }
.footer-bright { text-align: center; padding: 50px 0; border-top: 1px solid #e4e4e7; color: #a1a1aa; font-size: 13px; }`,
    js: `console.log("Lumina Agency loaded.");`
  },

  "dummy-zenith-ai": {
    id: "dummy-zenith-ai",
    name: "Zenith AI Analytics Hub",
    description: "Comprehensive web app dashboard with telemetry graphs, prompt history, user controls, and dynamic dark/light theme switching.",
    projectType: "plain",
    votes: { upvotes: 182, downvotes: 11 },
    html: `<div id="layout">
  <header class="draggable vertical">
    <div class="dash-nav">
      <h2>🧠 Zenith.ai Dashboard</h2>
      <div class="user-pill">Status: 🟢 Systems Normal</div>
    </div>
  </header>
  <section class="draggable vertical stats-section">
    <div class="card"><h4>Active Model Workers</h4><p class="metric">1,482</p></div>
    <div class="card"><h4>Tokens Processed / Sec</h4><p class="metric">48.2K</p></div>
    <div class="card"><h4>Avg Response Latency</h4><p class="metric">142ms</p></div>
    <div class="card"><h4>Cluster Health</h4><p class="metric">99.98%</p></div>
  </section>
  <section class="draggable vertical query-section">
    <h3>Live Query Pipeline</h3>
    <div class="terminal">
      <div class="log-line"><span>[18:42:01]</span> POST /v1/chat/completions - 200 OK (89ms)</div>
      <div class="log-line"><span>[18:42:02]</span> Cache hit cluster-us-east-1 (12ms)</div>
      <div class="log-line"><span>[18:42:03]</span> Neural safety guardrail passed (4ms)</div>
    </div>
  </section>
</div>`,
    css: `body { background: #090d16; color: #e2e8f0; font-family: monospace; padding: 20px; margin: 0; }
.dash-nav { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 16px; }
.dash-nav h2 { margin: 0; color: #a855f7; font-family: sans-serif; }
.user-pill { font-size: 12px; background: #1e1b4b; padding: 6px 14px; border-radius: 9999px; border: 1px solid #6366f1; }
.stats-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 24px 0; }
.card { background: #131927; padding: 20px; border-radius: 14px; border: 1px solid #1e293b; }
.card h4 { margin: 0 0 8px; color: #94a3b8; font-size: 13px; font-family: sans-serif; }
.metric { font-size: 28px; font-weight: bold; color: #38bdf8; margin: 0; }
.query-section { background: #131927; padding: 24px; border-radius: 16px; border: 1px solid #1e293b; }
.terminal { background: #030712; padding: 18px; border-radius: 10px; font-size: 13px; }
.log-line { margin-bottom: 8px; color: #10b981; }
.log-line span { color: #64748b; }`,
    js: `console.log("Zenith AI monitoring active.");`
  },

  "dummy-krafted-store": {
    id: "dummy-krafted-store",
    name: "Krafted Artisan Storefront",
    description: "Clean e-commerce store with functional shopping cart drawer, category filtering, product preview modals, and customer reviews.",
    projectType: "plain",
    votes: { upvotes: 136, downvotes: 6 },
    html: `<div id="layout">
  <header class="draggable vertical">
    <div class="store-nav">
      <div class="store-name">KRAFTED.</div>
      <div class="cart-trigger" onclick="alert('Cart has 2 items ($188.00)');">🛒 Cart (2)</div>
    </div>
  </header>
  <section class="draggable vertical banner">
    <h1>Handcrafted Essentials for Everyday Living</h1>
    <p>Organic ceramics, reclaimed walnut furniture, and bespoke leather goods made by master artisans.</p>
  </section>
  <section class="draggable vertical catalog">
    <div class="product">
      <div class="p-img">🏺</div>
      <h3>Nordic Terracotta Vase</h3>
      <p class="price">$74.00</p>
      <button onclick="alert('Added Nordic Terracotta Vase to cart!');">Add to Cart</button>
    </div>
    <div class="product">
      <div class="p-img">☕</div>
      <h3>Minimalist Stoneware Mug</h3>
      <p class="price">$38.00</p>
      <button onclick="alert('Added Minimalist Stoneware Mug to cart!');">Add to Cart</button>
    </div>
    <div class="product">
      <div class="p-img">🕰️</div>
      <h3>Solid Walnut Desk Clock</h3>
      <p class="price">$112.00</p>
      <button onclick="alert('Added Solid Walnut Desk Clock to cart!');">Add to Cart</button>
    </div>
  </section>
</div>`,
    css: `body { font-family: system-ui, sans-serif; background: #fdfbf7; color: #292524; margin: 0; padding: 24px; }
.store-nav { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e7e5e4; padding-bottom: 20px; }
.store-name { font-size: 24px; font-weight: 900; letter-spacing: 1px; }
.cart-trigger { background: #292524; color: #fff; padding: 8px 18px; border-radius: 9999px; font-size: 13px; font-weight: 600; cursor: pointer; }
.banner { text-align: center; padding: 60px 20px; max-width: 650px; margin: 0 auto; }
.banner h1 { font-size: 38px; font-weight: 800; margin-bottom: 12px; }
.banner p { color: #78716c; font-size: 16px; }
.catalog { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; max-width: 900px; margin: 0 auto; }
.product { background: #fff; border: 1px solid #e7e5e4; border-radius: 16px; padding: 24px; text-align: center; }
.p-img { font-size: 48px; margin-bottom: 12px; }
.product h3 { font-size: 16px; margin-bottom: 6px; }
.price { font-weight: 800; color: #d97706; margin-bottom: 16px; }
.product button { background: #292524; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; }
.product button:hover { background: #44403c; }`,
    js: `console.log("Krafted Store ready.");`
  },

  "dummy-pulse-magazine": {
    id: "dummy-pulse-magazine",
    name: "Pulse Tech Magazine",
    description: "Modern editorial publication with hero featured articles, category taxonomy filters, reading time estimates, and newsletter subscription.",
    projectType: "plain",
    votes: { upvotes: 77, downvotes: 1 },
    html: `<div id="layout">
  <header class="draggable vertical">
    <div class="mag-header">
      <div class="mag-logo">THE PULSE REPORT</div>
      <div class="edition">OCTOBER 2026 EDITION</div>
    </div>
  </header>
  <section class="draggable vertical featured-story">
    <span class="category">FEATURED INVESTIGATION</span>
    <h1>The Quantum Computing Milestone That Changes Everything</h1>
    <p>How 500-qubit fault-tolerant processors are accelerating molecular dynamics simulation at unprecedented scale.</p>
  </section>
  <section class="draggable vertical stories-grid">
    <article class="story">
      <span class="cat">NEUROSCIENCE</span>
      <h3>Brain-Computer Interfaces Enter Everyday Healthcare</h3>
      <p>Non-invasive neural caps restore fluid motor control for paralyzed patients.</p>
    </article>
    <article class="story">
      <span class="cat">AEROSPACE</span>
      <h3>Next-Gen Fusion Propulsion Test Scheduled for Q4</h3>
      <p>Direct fusion propulsion could reduce Mars transit duration from months to weeks.</p>
    </article>
  </section>
</div>`,
    css: `body { font-family: "Georgia", serif; background: #fff; color: #111; margin: 0; padding: 24px; }
.mag-header { text-align: center; border-bottom: 3px double #111; padding-bottom: 16px; margin-bottom: 30px; }
.mag-logo { font-size: 32px; font-weight: 900; letter-spacing: 3px; font-family: sans-serif; }
.edition { font-size: 11px; letter-spacing: 1px; color: #666; margin-top: 4px; font-family: sans-serif; }
.featured-story { border-bottom: 1px solid #e5e5e5; padding-bottom: 30px; margin-bottom: 30px; }
.category { font-size: 11px; font-weight: bold; color: #dc2626; letter-spacing: 1.5px; font-family: sans-serif; }
.featured-story h1 { font-size: 42px; line-height: 1.15; margin: 12px 0; }
.featured-story p { font-size: 18px; color: #444; line-height: 1.6; }
.stories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
.story { border-top: 1px solid #111; padding-top: 14px; }
.cat { font-size: 10px; font-weight: bold; letter-spacing: 1px; font-family: sans-serif; color: #4b5563; }
.story h3 { font-size: 20px; margin: 8px 0; }
.story p { font-size: 14px; color: #555; line-height: 1.5; }`,
    js: `console.log("The Pulse Report initialized.");`
  },

  "dummy-fitpulse-gym": {
    id: "dummy-fitpulse-gym",
    name: "FitPulse Fitness Studio",
    description: "High-intensity athletic gym website with dynamic schedule calendar, trainer biographies, class booking buttons, and membership tiers.",
    projectType: "plain",
    votes: { upvotes: 165, downvotes: 14 },
    html: `<div id="layout">
  <header class="draggable vertical">
    <div class="fit-nav">
      <div class="fit-brand">FIT//PULSE</div>
      <button class="join-btn" onclick="alert('Welcome! Free 3-day guest pass claimed.');">Claim Free Pass</button>
    </div>
  </header>
  <section class="draggable vertical fit-hero">
    <h1>UNLEASH YOUR ULTIMATE ATHLETIC POTENTIAL</h1>
    <p>State-of-the-art strength arenas, olympic recovery suites, and world-class coaches.</p>
  </section>
  <section class="draggable vertical classes">
    <div class="class-card"><h3>HIIT & METCON</h3><p>Burn 800+ calories with explosive interval circuits.</p></div>
    <div class="class-card"><h3>POWERLIFTING</h3><p>Master barbell fundamentals under Olympic certified trainers.</p></div>
    <div class="class-card"><h3>COLD PLUNGE & SAUNA</h3><p>Accelerate biological recovery with infrared contrast therapy.</p></div>
  </section>
</div>`,
    css: `body { background: #000; color: #fff; font-family: Impact, sans-serif; margin: 0; padding: 20px; }
.fit-nav { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #222; padding-bottom: 16px; }
.fit-brand { font-size: 28px; color: #e11d48; letter-spacing: 2px; }
.join-btn { background: #e11d48; color: #fff; border: none; padding: 12px 24px; font-family: sans-serif; font-weight: 800; cursor: pointer; border-radius: 4px; }
.fit-hero { padding: 60px 0; text-align: center; }
.fit-hero h1 { font-size: 56px; letter-spacing: 1px; color: #fff; margin-bottom: 12px; }
.fit-hero p { font-family: sans-serif; font-size: 16px; color: #a1a1aa; max-width: 600px; margin: 0 auto; }
.classes { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 40px; }
.class-card { background: #111; border: 1px solid #333; padding: 30px; border-radius: 8px; }
.class-card h3 { color: #e11d48; font-size: 24px; margin-bottom: 8px; }
.class-card p { font-family: sans-serif; font-size: 14px; color: #888; }`,
    js: `console.log("FitPulse ready.");`
  },

  "dummy-aura-bistro": {
    id: "dummy-aura-bistro",
    name: "Aura Artisan Bistro",
    description: "Michelin-style fine dining restaurant landing page featuring interactive tasting menus, wine pairing lists, and online table reservation.",
    projectType: "plain",
    votes: { upvotes: 112, downvotes: 5 },
    html: `<div id="layout">
  <header class="draggable vertical">
    <div class="bistro-nav">
      <div class="bistro-brand">A U R A</div>
      <div class="tag">EST. 2018 • SAN FRANCISCO</div>
    </div>
  </header>
  <section class="draggable vertical bistro-hero">
    <h1>Seasonal Hyper-Local Gastronomy</h1>
    <p>Ten-course tasting menus inspired by Northern California coastal terroir and biodynamic micro-farms.</p>
    <button class="reserve-btn" onclick="alert('Reservations open every Monday at 10 AM PST.');">Reserve Table</button>
  </section>
  <section class="draggable vertical menu-preview">
    <h2>Tonight's Selected Courses</h2>
    <div class="dish">
      <div class="dish-header"><span>Hokkaido Scallop Crudo</span><span>$38</span></div>
      <p>Finger lime, fermented white peach, yuzu kosho emulsion</p>
    </div>
    <div class="dish">
      <div class="dish-header"><span>Dry-Aged A5 Wagyu</span><span>$95</span></div>
      <p>Morel mushroom duxelles, charred allium, black truffle jus</p>
    </div>
  </section>
</div>`,
    css: `body { background: #141312; color: #ede8e1; font-family: "Didot", serif; margin: 0; padding: 30px; }
.bistro-nav { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 24px; }
.bistro-brand { font-size: 32px; letter-spacing: 8px; font-weight: normal; }
.tag { font-family: sans-serif; font-size: 10px; letter-spacing: 2px; color: #a89f91; margin-top: 6px; }
.bistro-hero { text-align: center; padding: 80px 20px; max-width: 640px; margin: 0 auto; }
.bistro-hero h1 { font-size: 44px; font-weight: normal; font-style: italic; margin-bottom: 16px; }
.bistro-hero p { font-family: sans-serif; color: #a89f91; font-size: 15px; line-height: 1.7; margin-bottom: 30px; }
.reserve-btn { background: transparent; border: 1px solid #d4af37; color: #d4af37; padding: 12px 32px; font-family: sans-serif; font-size: 12px; letter-spacing: 2px; cursor: pointer; text-transform: uppercase; }
.reserve-btn:hover { background: #d4af37; color: #000; }
.menu-preview { max-width: 600px; margin: 40px auto; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 40px; }
.menu-preview h2 { text-align: center; font-size: 26px; font-weight: normal; margin-bottom: 30px; color: #d4af37; }
.dish { margin-bottom: 24px; }
.dish-header { display: flex; justify-content: space-between; font-size: 18px; border-bottom: 1px dotted rgba(255,255,255,0.2); padding-bottom: 4px; }
.dish p { font-family: sans-serif; font-size: 13px; color: #a89f91; margin-top: 6px; }`,
    js: `console.log("Aura Bistro ready.");`
  }
};
