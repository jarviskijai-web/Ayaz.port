import "./styles/Connect.css";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import TextReveal from "./TextReveal";

const Connect = () => {
  return (
    <div className="connect-section" id="connect">
      <div className="connect-container section-container">
        
        {/* Left Content */}
        <div className="connect-side left">
          <TextReveal as="h2" className="connect-heading" split="word">READY TO <span>ARCHITECT</span> THE FUTURE?</TextReveal>
          <p className="connect-para">
            I help visionary founders and teams translate complex ideas into 
            world-class digital experiences. From concept to code, I build 
            the bridge.
          </p>
          <div className="status-badge">
            <span className="dot"></span>
            AVAILABLE FOR FREELANCE
          </div>
        </div>

        {/* Center Card */}
        <div className="parent">
          <div className="card">
            <div className="logo">
              <span className="circle circle1"></span>
              <span className="circle circle2"></span>
              <span className="circle circle3"></span>
              <span className="circle circle4"></span>
              <span className="circle circle5">
                <svg className="svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" fill="none" />
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" fill="none" />
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </div>
            <div className="glass"></div>
            <div className="content">
              <span className="title">INITIATE</span>
              <span className="text">
                Visionary architect for next-gen Websites, Apps, and AI. 
                Bridging human emotion with machine logic.
              </span>
            </div>
            <div className="bottom">
              <div className="social-buttons-container">
                <a href="https://www.instagram.com/rustam_parvez" target="_blank" rel="noreferrer" className="social-button">
                  <FaInstagram className="svg" />
                </a>
                <a href="https://wa.me/917355779499" target="_blank" rel="noreferrer" className="social-button">
                  <FaWhatsapp className="svg" />
                </a>
                <a href="mailto:hello@arisone.in" className="social-button">
                  <FaEnvelope className="svg" />
                </a>
              </div>
              <div className="view-more">
                <button className="view-more-button">AYAZ AHMAD</button>
                <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="connect-side right">
          <div className="service-nodes">
            <h5>SERVICE NODES</h5>
            <ul>
              <li><span>01</span> Web Architecture</li>
              <li><span>02</span> Mobile Interfaces</li>
              <li><span>03</span> Emotional AI Systems</li>
              <li><span>04</span> Product Strategy</li>
            </ul>
          </div>
          <p className="transmission-note">
            Establishing secure connection... <br />
            Response time: &lt; 12 Hours
          </p>
        </div>

      </div>
    </div>
  );
};

export default Connect;
