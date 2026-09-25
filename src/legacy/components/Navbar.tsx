import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother | null = null;

const NAV_ITEMS = [
  { label: "ABOUT", target: "#about" },
  { label: "WHAT I DO", target: "#whatIDo" },
  { label: "CAREER", target: "#career" },
  { label: "WORK", target: "#work" },
  { label: "CONNECT", target: "#connect" },
  { label: "CONTACT", target: "#contact" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#about");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncScrollInstance = () => {
      const isDesktop = window.innerWidth > 1024;

      if (isDesktop && !smoother) {
        smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.7,
          speed: 1.7,
          effects: true,
          autoResize: true,
          ignoreMobileResize: true,
        });
      }

      if (!isDesktop && smoother) {
        smoother.kill();
        smoother = null;
      }
    };

    const handleScrollTo = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const section = target.getAttribute("data-href");
      if (section && window.innerWidth > 1024 && smoother) {
        e.preventDefault();
        smoother.scrollTo(section, true, "top top");
      }
    };

    syncScrollInstance();

    const links = document.querySelectorAll(".header a, .header button");
    links.forEach((elem) => {
      elem.addEventListener("click", handleScrollTo);
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(`#${visible.target.id}`);
        }
      },
      { threshold: [0.2, 0.5, 0.8], rootMargin: "-10% 0px -30% 0px" }
    );

    const sectionIds = ["about", "whatIDO", "career", "work", "connect", "contact"];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    const onResize = () => {
      syncScrollInstance();
      ScrollSmoother.refresh(true);
    };

    window.addEventListener("resize", onResize);

    return () => {
      if (smoother) {
        smoother.kill();
        smoother = null;
      }

      links.forEach((elem) => {
        elem.removeEventListener("click", handleScrollTo);
      });
      sectionObserver.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scrollToSection = (section: string) => {
    setMobileMenuOpen(false);
    const targetId = section.replace("#", "");
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: targetTop, behavior: "smooth" });
      return;
    }

    if (smoother && window.innerWidth > 1024) {
      smoother.scrollTo(section, true, "top top");
    }
  };

  return (
    <>
      <div className="header">
        <ul className="navbar-menu">
          {NAV_ITEMS.map((item) => (
            <li key={item.target}>
              <button
                className={`nav-pill-btn ${activeSection === item.target ? "is-active" : ""}`}
                onClick={() => scrollToSection(item.target)}
                data-cursor="disable"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={`mobile-nav-toggle ${mobileMenuOpen ? "is-open" : ""}`}
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`mobile-menu-panel ${mobileMenuOpen ? "is-open" : ""}`} aria-hidden={!mobileMenuOpen}>
        <div className="mobile-menu-header">
          <span>Menu</span>
          <button type="button" className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            ×
          </button>
        </div>
        <nav className="mobile-menu-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.target}
              type="button"
              className={`mobile-menu-link ${activeSection === item.target ? "is-active" : ""}`}
              onClick={() => scrollToSection(item.target)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;

