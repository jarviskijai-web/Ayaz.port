import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              AYAZ
              <br />
              <span>AHMAD</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Founder &</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Freelance</div>
              <div className="landing-h2-2">Architect</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Designer</div>
              <div className="landing-h2-info-1">Visionary</div>
            </h2>
          </div>

        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
