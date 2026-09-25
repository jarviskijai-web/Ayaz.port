import { MdArrowOutward, MdCopyright } from "react-icons/md";
import { FaGlobe } from "react-icons/fa";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <footer className="footer-final" id="contact">
      <div className="footer-container section-container">
        
        {/* Upper Branding Section */}
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="footer-logo">ARIS ONE</h3>
            <p className="footer-tagline">
              Architecting meaningful intersections between <br />
              human emotion and machine logic.
            </p>
          </div>
          <div className="footer-status">
            <div className="status-indicator">
              <span className="status-dot"></span>
              LIVE TRANSMISSION ACTIVE
            </div>
            <p>Ready for new visionary projects.</p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="footer-grid">
          <div className="footer-column">
            <h5>NAVIGATION</h5>
            <a href="#about">The Architect</a>
            <a href="#projects">Work Archive</a>
            <a href="#connect">Initiate Sync</a>
          </div>
          
          <div className="footer-column">
            <h5>SOCIAL NODES</h5>
            <a href="https://github.com/TheRustamDev" target="_blank" rel="noreferrer">
              GitHub <MdArrowOutward />
            </a>
            <a href="https://www.linkedin.com/in/rustam-parvez-5668ab32a?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer">
              LinkedIn <MdArrowOutward />
            </a>
            <a href="https://www.instagram.com/rustam_parvez" target="_blank" rel="noreferrer">
              Instagram <MdArrowOutward />
            </a>
            <a href="https://wa.me/917355779499" target="_blank" rel="noreferrer">
              WhatsApp <MdArrowOutward />
            </a>
          </div>

          <div className="footer-column">
            <h5>DIRECT LINE</h5>
            <a href="mailto:hello@arisone.in" className="footer-email">
              hello@arisone.in <MdArrowOutward />
            </a>
            <p className="footer-location">
              <FaGlobe /> GLOBAL / REMOTE
            </p>
          </div>
        </div>

        {/* Massive Name Branding */}
        <div className="footer-massive-text">
          <h2>AYAZ AHMAD</h2>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="copyright-info">
            <MdCopyright /> 2026 ARIS ONE · ALL RIGHTS RESERVED
          </div>
          <div className="footer-credits">
            DESIGNED & DEVELOPED WITH INTENT
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Contact;
