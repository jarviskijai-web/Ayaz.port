import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import TextReveal from "./TextReveal";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <TextReveal as="h2" split="word">Hello! I'm</TextReveal>
            <TextReveal as="h1" split="word">
              AYAZ
              <br />
              <span>AHMAD</span>
            </TextReveal>
          </div>
          <div className="landing-info">
            <TextReveal as="h3" split="word">Founder &</TextReveal>
            <TextReveal as="h2" className="landing-info-h2" split="word">
              <div className="landing-h2-1">Freelance</div>
              <div className="landing-h2-2">Architect</div>
            </TextReveal>
            <TextReveal as="h2" split="word">
              <div className="landing-h2-info">Designer</div>
              <div className="landing-h2-info-1">Visionary</div>
            </TextReveal>
          </div>

        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
