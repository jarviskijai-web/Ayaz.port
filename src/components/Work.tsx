import { useState, useCallback } from "react";
import "./styles/Work.css";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { FaGlobe, FaCode, FaRobot } from "react-icons/fa";

const projectGradients = [
  "linear-gradient(315deg,#03a9f4,#ff0058)", "linear-gradient(315deg,#4dff03,#00d0ff)",
  "linear-gradient(315deg,#ff00b3,#ffeb3b)", "linear-gradient(315deg,#7d06f0,#03a9f4)",
  "linear-gradient(315deg,#ff5722,#ffeb3b)", "linear-gradient(315deg,#00bcd4,#f44336)",
  "linear-gradient(315deg,#9c27b0,#ffeb3b)", "linear-gradient(315deg,#ff9800,#ffeb3b)",
  "linear-gradient(315deg,#e91e63,#2196f3)", "linear-gradient(315deg,#607d8b,#000000)",
  "linear-gradient(315deg,#f44336,#9c27b0)", "linear-gradient(315deg,#ffeb3b,#4caf50)",
  "linear-gradient(315deg,#3f51b5,#00bcd4)", "linear-gradient(315deg,#ff5722,#e91e63)",
  "linear-gradient(315deg,#4caf50,#ffeb3b)", "linear-gradient(315deg,#795548,#212121)",
  "linear-gradient(315deg,#009688,#ff0058)", "linear-gradient(315deg,#673ab7,#ffeb3b)",
  "linear-gradient(315deg,#000000,#03a9f4)", "linear-gradient(315deg,#f06292,#ba68c8)",
  "linear-gradient(315deg,#4db6ac,#81c784)", "linear-gradient(315deg,#ff8a65,#ffb74d)",
  "linear-gradient(315deg,#9575cd,#4fc3f7)", "linear-gradient(315deg,#aed581,#fff176)"
];

const projects = [
  {
    title: "Aris One",
    category: "Flagship AI",
    description: "The world's first proactive AI architect bridging human emotion with machine logic. Your digital sanctuary, architected for the future.",
    tools: "Neural Matrix · Proactive Interaction",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4628c9759?q=80&w=1000&auto=format&fit=crop",
    link: "https://aris-one.com",
    isLocked: false
  },
  {
    title: "Future Blueprints",
    category: "Loading Infinity",
    description: "System expansion in progress. Data packets currently being compiled. Future architecture incoming...",
    tools: "Data Loading · ∞",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
    link: "#",
    isLocked: true
  }
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToNextIndex(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNextIndex = (index: number) => {
    goToSlide(index);
  };

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2 className="work-heading">
          My <span>Projects</span>
        </h2>

        <div className="carousel-wrapper">
          <button className="carousel-arrow carousel-arrow-left" onClick={goToPrev} data-cursor="disable">
            <MdArrowBack />
          </button>
          <button className="carousel-arrow carousel-arrow-right" onClick={goToNext} data-cursor="disable">
            <MdArrowForward />
          </button>

          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="book" style={{ "--neon-gradient": projectGradients[index % projectGradients.length] } as any}>
                    {/* Inner Page (Neon Style) */}
                    <div className="book-content neon-card">
                       <b className="neon-inner-bg"></b>
                       <span className="book-number">0{index + 1}</span>
                       <div className="neon-content-box">
                         <h3 className="book-title">{project.title}</h3>
                         <p className="book-category">{project.category}</p>
                         <p className="book-description">{project.description}</p>
                         <ul className="neon-icons">
                            <li><FaGlobe /></li>
                            <li><FaCode /></li>
                            <li><FaRobot /></li>
                         </ul>
                         <a 
                           href={project.link} 
                           target={project.isLocked ? "_self" : "_blank"}
                           rel="noopener noreferrer" 
                           className={`neon-launch-btn ${project.isLocked ? 'locked' : ''}`}
                           onClick={(e) => project.isLocked && e.preventDefault()}
                         >
                            {project.isLocked ? "System Loading..." : "Launch Blueprint"}
                         </a>
                       </div>
                    </div>

                    {/* Cover (Neon Style with Flip) */}
                    <div className="cover neon-card">
                       <b className="neon-inner-bg"></b>
                       <img src={project.image} alt={project.title} className="cover-img" loading="lazy" decoding="async" />
                       <div className="neon-content-box cover-content">
                         <h4 className="cover-title">{project.title} <span>Blueprint</span></h4>
                         <p className="cover-hint">FLIP TO REVEAL</p>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""}`}
                onClick={() => goToSlide(index)}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;

