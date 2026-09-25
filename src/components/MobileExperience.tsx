import { PropsWithChildren, useState } from "react";
import "./styles/MobileExperience.css";
import "./styles/MobileMascot.css";
import "./styles/MobileProjectMockups.css";

type Project = {
  name: string;
  type: string;
  description: string;
  image: string;
  features: string[];
  tools: string[];
};

const projects: Project[] = [
  {
    name: "GHARONIX",
    type: "PROPERTY PLATFORM",
    description: "A premium property experience shaped around clearer discovery, stronger presentation, and the pace of a real buying decision.",
    image: "https://www.gharonix.com/_next/image?url=%2Fimages%2Fhero-home.jpeg&w=1200&q=80",
    features: ["Property discovery", "Editorial presentation", "Responsive product thinking"],
    tools: ["React", "TypeScript", "Product design"],
  },
  {
    name: "REVIX ONE",
    type: "DIGITAL PRODUCT",
    description: "A focused product direction for making complex digital workflows feel direct, calm, and useful from the first interaction.",
    image: "/images/callhq.png",
    features: ["Clear information architecture", "Purposeful interactions", "System-led visual design"],
    tools: ["React", "Node.js", "Interface design"],
  },
  {
    name: "ARIS ONE",
    type: "AI COMPANION",
    description: "An evolving AI companion built around emotional resonance, proactive interaction, and the meeting point between human feeling and machine logic.",
    image: "/images/preview1.png",
    features: ["Proactive interaction", "Human-centered AI", "Immersive experience"],
    tools: ["React", "Three.js", "AI systems"],
  },
];

const navItems = [
  ["About", "#about"],
  ["Work", "#work"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];

const MobileExperience = ({ children }: PropsWithChildren) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard?.writeText("Rustamparvez785@gmail.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="mobile-site">
      <nav className="mobile-nav" aria-label="Primary navigation">
        <a href="#top" className="mobile-brand" aria-label="Ayaz Ahmad home">
          <span className="brand-mark">A</span>
          <span>AYAZ AHMAD</span>
        </a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">
          <span />
          <span />
        </button>
        <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </div>
      </nav>

      <section className="mobile-hero" id="top">
        <p className="eyebrow reveal">DIGITAL ARCHITECT / LUCKNOW, INDIA</p>
        <h1 className="reveal reveal-delay-1">HELLO, I&apos;M<br /><em>AYAZ</em> AHMAD.</h1>
        <p className="hero-statement reveal reveal-delay-2">I design and build digital products that make complex ideas feel <em>clear.</em></p>
        <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><b>↓</b></a>
      </section>

      <section className="mobile-info-row">
        <div><span className="info-icon">+</span><p>BASED IN<br /><strong>LUCKNOW, INDIA</strong></p></div>
        <div><span className="info-icon">◈</span><p>FOCUS<br /><strong>AI, PRODUCTS &amp; SYSTEMS</strong></p></div>
      </section>

      <section className="mobile-section" id="about">
        <p className="section-kicker">01 / THE APPROACH</p>
        <div className="identity-card">
          <div className="identity-orbit">A<span>01</span></div>
          <p className="card-label">AYAZ AHMAD</p>
          <h2>Products<br /><em>people remember.</em></h2>
          <p className="card-copy">Founder and architect of Aris One. I work across product strategy, interface design, and full-stack systems to turn ambitious ideas into things people can actually use.</p>
          <div className="tag-row"><span>DESIGN</span><span>DEVELOPMENT</span><span>PRODUCT</span></div>
        </div>
      </section>

      <section className="mobile-section location-section">
        <p className="section-kicker">02 / WHERE I WORK</p>
        <div className="location-card"><div className="location-grid" /><div className="pin">+</div><div className="location-copy"><span>BASED IN</span><strong>LUCKNOW</strong><small>INDIA / 26.84° N, 80.94° E</small></div></div>
      </section>

      <section className="mobile-section contact-section" id="contact">
        <p className="section-kicker">03 / LET&apos;S CONNECT</p>
        <div className="contact-card">
          <span className="available"><i /> AVAILABLE FOR THE RIGHT BUILD</span>
          <h2>Let&apos;s build<br /><em>something useful.</em></h2>
          <p>Have a product, system, or difficult idea that needs shape? Start a conversation.</p>
          <div className="contact-actions"><a href="mailto:Rustamparvez785@gmail.com">EMAIL ME <span>↗</span></a><button type="button" onClick={copyEmail}>{copied ? "COPIED" : "COPY EMAIL"} <span>⌘</span></button></div>
        </div>
      </section>

      <section className="mobile-section work-section" id="work">
        <div className="work-heading"><div><p className="section-kicker">04 / SELECTED WORK</p><h2>Building<br /><em>digital experiences.</em></h2></div><span className="work-count">03<br />PROJECTS</span></div>
        <div className="project-list">{projects.map((project, index) => <article className="project" key={project.name}><div className={`project-visual visual-${index}`}><img src={project.image} alt={`${project.name} project visual`} loading="lazy" />{project.name === "REVIX ONE" && <div className="music-mockup"><span className="music-art">R</span><strong>REVIX ONE</strong><small>Late night / 24 tracks</small><div className="music-line" /><div className="music-controls">◀︎ <b>▶</b> ▶︎</div></div>}<span>0{index + 1}</span></div><div className="project-meta"><p className="project-type">— {project.type}</p><h3>{project.name}</h3><p>{project.description}</p><ul>{project.features.map(feature => <li key={feature}>✦ {feature}</li>)}</ul><div className="tag-row">{project.tools.map(tool => <span key={tool}>{tool}</span>)}</div></div></article>)}</div>
      </section>

      <section className="mobile-section skills-section" id="skills">
        <p className="section-kicker">05 / THE TOOLKIT</p><h2>My skillset.<br /><em>The craft behind<br />what I build.</em></h2>
        <div className="skills-list"><div><span>01</span><strong>Product thinking</strong><small>Turning ambiguity into a direction people can feel.</small></div><div><span>02</span><strong>Full-stack development</strong><small>React, TypeScript, Node.js, Python, APIs and data.</small></div><div><span>03</span><strong>AI systems</strong><small>LLMs, agents, retrieval, automation and guardrails.</small></div><div><span>04</span><strong>Interface design</strong><small>Calm, expressive interfaces with a reason for every detail.</small></div></div>
      </section>

      <section className="mobile-mascot-section" aria-label="Ayaz Ahmad mascot">
        <p className="section-kicker">06 / THE ARCHITECT</p>
        <div className="mobile-mascot-frame">{children}</div>
      </section>

      <footer className="mobile-footer"><a href="#top" className="footer-name">AYAZ AHMAD<span>.</span></a><div><a href="mailto:Rustamparvez785@gmail.com">EMAIL ↗</a></div><small>© 2026 ARIS ONE / MADE WITH INTENT</small></footer>
    </main>
  );
};

export default MobileExperience;
