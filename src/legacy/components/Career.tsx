import "./styles/Career.css";
import TextReveal from "./TextReveal";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <TextReveal as="h2" split="word">
          My career <span>&</span>
          <br /> experience
        </TextReveal>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <TextReveal as="h4" split="word">Founder & Architect</TextReveal>
                <TextReveal as="h5" split="word">Aris One</TextReveal>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Leading the development of Aris One, an evolving AI companion
              designed for emotional resonance and proactive interaction.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <TextReveal as="h4" split="word">Creative Technologist</TextReveal>
                <TextReveal as="h5" split="word">Independent</TextReveal>
              </div>
              <h3>2023-24</h3>
            </div>
            <p>
              Exploring the boundaries of 3D interfaces, generative art, and
              human-computer interaction as a self-taught developer.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <TextReveal as="h4" split="word">Community Contributor</TextReveal>
                <TextReveal as="h5" split="word">Tech for Good</TextReveal>
              </div>
              <h3>2022</h3>
            </div>
            <p>
              Contributing to open-source projects and community initiatives
              focused on accessible technology and digital wellbeing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
