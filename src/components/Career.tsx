import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Founder & Architect</h4>
                <h5>Aris One</h5>
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
                <h4>Creative Technologist</h4>
                <h5>Independent</h5>
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
                <h4>Community Contributor</h4>
                <h5>Tech for Good</h5>
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
