import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

// Updated navigation links to include immersive-slider
const NAVIGATION_LINKS = [
  { name: "Home", to: "#home" },
  { name: "About", to: "#about" },
  { name: "Roadmap", to: "#roadmap" }, // Added Roadmap to navigation
  { name: "Journey", to: "#immersive-slider" }, // Added new Journey section
  { name: "Experiences", to: "#experiences" },
  { name: "Gallery", to: "#gallery" },
  { name: "Testimonials", to: "#testimonials" },
  { name: "Contact", to: "#contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeSection, setActiveSection } = useAppContext();
  
  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleNavLinkClick = (e, sectionId) => {
    e.preventDefault();
    setActiveSection(sectionId);
    
    // Scroll to element
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    setIsMobileMenuOpen(false);
  };
  
  // Navbar variants for animation
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  
  // Mobile menu animation variants
  const menuVariants = {
    closed: { opacity: 0, x: '100%' },
    open: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };
  
  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/images/logo.png" 
            alt="Su Lanka Tours" 
            className="h-10 md:h-12" 
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {NAVIGATION_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.to}
              onClick={(e) => handleNavLinkClick(e, link.to.substring(1))}
              className={`text-sm font-medium transition-colors hover:text-secondary ${
                activeSection === link.to.substring(1)
                  ? 'text-primary font-semibold'
                  : isScrolled
                  ? 'text-dark'
                  : 'text-white'
              }`}
            >
              {link.name}
              {activeSection === link.to.substring(1) && (
                <motion.div
                  className="h-0.5 bg-secondary mt-0.5"
                  layoutId="activeSection"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-dark p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} className={isScrolled ? 'text-dark' : 'text-white'} />
          ) : (
            <Menu size={24} className={isScrolled ? 'text-dark' : 'text-white'} />
          )}
        </button>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-white z-50 pt-20"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <div className="container mx-auto px-4">
                <nav className="flex flex-col space-y-6 py-8">
                  {NAVIGATION_LINKS.map((link) => (
                    <a
                      key={link.name}
                      href={link.to}
                      onClick={(e) => handleNavLinkClick(e, link.to.substring(1))}
                      className={`text-xl font-medium transition-colors hover:text-secondary ${
                        activeSection === link.to.substring(1)
                          ? 'text-primary font-semibold'
                          : 'text-dark'
                      }`}
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;