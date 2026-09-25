import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <div className="about-card">
          <div className="about-label-col">
            <span className="about-label-line"></span>
            <h3 className="about-heading">About</h3>
            <h3 className="about-heading about-heading-accent">Me</h3>
            <span className="about-label-line"></span>
          </div>
          <div className="about-content-col">
            <p className="about-para">
              I am the founder and architect of <span className="about-highlight">Aris One</span> — a breathing AI companion
              built for real emotional connection. As a <span className="about-highlight">Freelance Visionary</span>, I help brands and startups design 
              next-generation <span className="about-highlight">Websites, Mobile Apps, and AI-driven Systems</span> that feel alive. 
              I craft digital sanctuaries where intelligence meets intuition.
            </p>
            <p className="about-accent">
              <span className="about-accent-dot"></span>
              Building Intelligence That Breathes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
