import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUp, Code, User, MapPin } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import ThemeToggle from '@/components/ThemeToggle';
import ScrollProgress from '@/components/ScrollProgress';
import FloatingElements from '@/components/FloatingElements';
import ParticleBackground from '@/components/ParticleBackground';

const Index = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  
  // Enhanced scroll-based animations for different sections
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.8]);
  const heroY = useTransform(scrollY, [0, 400], [0, -200]);
  
  const aboutY = useTransform(scrollY, [200, 800], [100, -100]);
  const aboutOpacity = useTransform(scrollY, [200, 600], [0, 1]);
  const aboutScale = useTransform(scrollY, [200, 600], [0.9, 1]);
  
  const skillsY = useTransform(scrollY, [600, 1200], [80, -80]);
  const skillsOpacity = useTransform(scrollY, [600, 1000], [0, 1]);
  
  const projectsY = useTransform(scrollY, [1000, 1600], [80, -80]);
  const projectsOpacity = useTransform(scrollY, [1000, 1400], [0, 1]);
  const projectsScale = useTransform(scrollY, [1000, 1400], [0.9, 1]);
  
  const contactY = useTransform(scrollY, [1400, 1800], [80, -40]);
  const contactOpacity = useTransform(scrollY, [1400, 1800], [0, 1]);
  
  const backgroundY = useTransform(scrollY, [0, 2000], [0, -800]);
  const parallaxY = useTransform(scrollY, [0, 2000], [0, -400]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden w-full">
      {/* Enhanced Particle Background with Parallax */}
      <motion.div style={{ y: backgroundY }} className="fixed inset-0 z-0">
        <ParticleBackground />
      </motion.div>
      
      {/* Floating Elements with Parallax */}
      <motion.div style={{ y: parallaxY }} className="fixed inset-0 z-0">
        <FloatingElements />
      </motion.div>
      
      {/* Fixed Elements */}
      <ScrollProgress />
      <ThemeToggle />
      
      {/* Main Content with Enhanced Scroll Effects */}
      <main className="relative z-10 w-full">
        {/* Hero Section with Advanced Scroll Effects */}
        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}>
          <HeroSection />
        </motion.div>

        {/* About Section with Flying Animation */}
        <motion.div
          style={{ 
            y: aboutY, 
            opacity: aboutOpacity, 
            scale: aboutScale 
          }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 200, rotateX: 45 }}
            whileInView={{ 
              opacity: 1, 
              y: 0, 
              rotateX: 0,
              transition: {
                duration: 1.2,
                ease: "easeOut",
                type: "spring",
                stiffness: 100
              }
            }}
            viewport={{ once: true, margin: "-150px" }}
          >
            <AboutSection />
          </motion.div>
        </motion.div>

        {/* Skills Section - Removed rotation effect */}
        <motion.div
          style={{ 
            y: skillsY, 
            opacity: skillsOpacity
          }}
          className="relative mb-[-3rem]"
        >
          <motion.div
            initial={{ opacity: 0, x: -200, scale: 0.5 }}
            whileInView={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              transition: {
                duration: 1.4,
                ease: "easeOut",
                type: "spring",
                stiffness: 80
              }
            }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <SkillsSection />
          </motion.div>
        </motion.div>

        {/* Projects Section with Scale and Flying Animation */}
        <motion.div
          style={{ 
            y: projectsY, 
            opacity: projectsOpacity, 
            scale: projectsScale 
          }}
          className="relative mb-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 300, rotateY: 30 }}
            whileInView={{ 
              opacity: 1, 
              y: 0, 
              rotateY: 0,
              transition: {
                duration: 1.6,
                ease: "easeOut",
                type: "spring",
                stiffness: 60
              }
            }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <ProjectsSection />
          </motion.div>
        </motion.div>

        {/* Contact Section with Final Flying Effect */}
        <motion.div
          style={{ 
            y: contactY, 
            opacity: contactOpacity 
          }}
          className="relative mt-8"
        >
          <motion.div
            initial={{ opacity: 0, x: 200, scale: 0.7 }}
            whileInView={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              transition: {
                duration: 1.8,
                ease: "easeOut",
                type: "spring",
                stiffness: 70
              }
            }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <ContactSection />
          </motion.div>
        </motion.div>
      </main>

      {/* Footer - Directly attached to the Contact section */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 py-5 bg-gradient-to-t from-black to-[#1d1a15]/80 border-t border-[#d4af75]/30 mt-[-2px]"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <motion.div 
                className="text-lg font-medium text-white flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Code className="w-5 h-5 mr-2 text-[#d4af75]" />
                <span>Ayaz Ahmad</span>
              </motion.div>
              <p className="text-sm text-gray-400 mt-1">
                Founder • Designer • Builder • &copy; {new Date().getFullYear()}
              </p>
            </div>
            
            <div className="flex items-center space-x-8">
              <motion.a
                href="https://github.com/TheRustamDev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <img src="/social-icons/github-contact.svg" alt="GitHub" className="w-5 h-5 mr-1.5" />
                <span className="text-sm">GitHub</span>
              </motion.a>
              
              <motion.a
                href="mailto:hello@arisone.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <img src="/social-icons/email-contact.svg" alt="Email" className="w-5 h-5 mr-1.5" />
                <span className="text-sm">Email</span>
              </motion.a>
              
              <motion.a
                href="https://www.linkedin.com/in/rustam-parvez-5668ab32a?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <img src="/social-icons/linkedin-contact.svg" alt="LinkedIn" className="w-5 h-5 mr-1.5" />
                <span className="text-sm">LinkedIn</span>
              </motion.a>
              
              {/* Removed the location part that was taking you to localhost */}
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Enhanced Back to Top Button with Cursor Effect */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0,
          rotate: showBackToTop ? 360 : 0
        }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#b88938] to-[#d4af75] hover:from-[#d4af75] hover:to-[#b88938] text-[#120d09] p-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,117,0.45)] cursor-hover"
        whileHover={{ 
          scale: 1.3, 
          rotate: 360,
          boxShadow: "0 0 30px rgba(212, 175, 117, 0.5)"
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>

      {/* Enhanced Scroll-triggered Background Color Changes */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: useTransform(
            scrollYProgress,
            [0, 0.2, 0.4, 0.6, 0.8, 1],
            [
              "linear-gradient(180deg, #050505 0%, #14100c 100%)",
              "linear-gradient(180deg, #14100c 0%, #20180f 100%)",
              "linear-gradient(180deg, #20180f 0%, #2d2217 100%)",
              "linear-gradient(180deg, #2d2217 0%, #3a2b1e 100%)",
              "linear-gradient(180deg, #3a2b1e 0%, #5a4023 100%)",
              "linear-gradient(180deg, #5a4023 0%, #050505 100%)"
            ]
          )
        }}
      />
    </div>
  );
};

export default Index;
