import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

// Updated navigation links to include immersive-slider
const NAVIGATION_LINKS = [
  { name: "Home", to: "#home" },
  { name: "About", to: "#about" },
  { name: "Roadmap", to: "#roadmap" },
  { name: "Journey", to: "#immersive-slider" },
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
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  const handleNavLinkClick = (e, sectionId) => {
    e.preventDefault();
    setActiveSection(sectionId);
    
    // Scroll to element
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Close mobile menu
    setIsMobileMenuOpen(false);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Navbar variants for animation
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  
  // Mobile menu animation variants
  const menuVariants = {
    closed: { 
      opacity: 0, 
      x: '100%',
      transition: { 
        duration: 0.3, 
        ease: [0.22, 1, 0.36, 1] 
      }
    },
    open: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    },
  };
  
  // Mobile menu item variants
  const menuItemVariants = {
    closed: { 
      opacity: 0, 
      x: 50,
      transition: { duration: 0.2 }
    },
    open: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.1 + 0.2,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
  };
  
  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
        }`}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="container mx-auto flex justify-between items-center relative">
          {/* Logo */}
          <Link to="/" className="flex items-center z-50 relative">
            <motion.img 
              src="/images/logo.png" 
              alt="Su Lanka Tours" 
              className="h-10 md:h-12" 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            {/* Text fallback for logo */}
            <div 
              className="text-xl font-bold text-primary hidden"
              style={{ display: 'none' }}
            >
              Su Lanka Tours
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {NAVIGATION_LINKS.map((link) => (
              <motion.a
                key={link.name}
                href={link.to}
                onClick={(e) => handleNavLinkClick(e, link.to.substring(1))}
                className={`relative text-sm font-medium transition-colors hover:text-secondary ${
                  activeSection === link.to.substring(1)
                    ? 'text-primary font-semibold'
                    : isScrolled
                    ? 'text-dark'
                    : 'text-white'
                }`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {link.name}
                {activeSection === link.to.substring(1) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary"
                    layoutId="activeSection"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-dark p-2 z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} className={isScrolled ? 'text-dark' : 'text-white'} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu */}
            <motion.div
              className="mobile-menu-container fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 md:hidden shadow-2xl"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Menu Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-8 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12"></div>
                
                <div className="relative z-10">
                  {/* Close button */}
                  <motion.button
                    onClick={closeMobileMenu}
                    className="absolute top-0 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} />
                  </motion.button>
                  
                  {/* Logo and title */}
                  <div className="flex items-center space-x-3">
                    <img 
                      src="/images/logo.png" 
                      alt="Su Lanka Tours" 
                      className="h-12 w-auto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div>
                      <h2 className="text-white text-xl font-bold">Su Lanka Tours</h2>
                      <p className="text-white/80 text-sm">Explore Sri Lanka</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Menu Content */}
              <div className="px-6 py-6 h-full overflow-y-auto">
                <nav className="space-y-2">
                  {NAVIGATION_LINKS.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.to}
                      onClick={(e) => handleNavLinkClick(e, link.to.substring(1))}
                      className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                        activeSection === link.to.substring(1)
                          ? 'bg-primary text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                      }`}
                      variants={menuItemVariants}
                      custom={index}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Icon indicator */}
                        <div className={`w-2 h-2 rounded-full transition-colors ${
                          activeSection === link.to.substring(1)
                            ? 'bg-white'
                            : 'bg-gray-300 group-hover:bg-primary'
                        }`} />
                        <span className="text-lg font-medium">{link.name}</span>
                      </div>
                      
                      <ChevronRight 
                        size={18} 
                        className={`transform transition-transform group-hover:translate-x-1 ${
                          activeSection === link.to.substring(1)
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-primary'
                        }`}
                      />
                    </motion.a>
                  ))}
                </nav>
                

                
                {/* Social Links */}
                <motion.div 
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  <h3 className="text-primary font-semibold mb-3">Follow Us</h3>
                  <div className="flex space-x-3">
                    {['Facebook', 'Instagram', 'Twitter'].map((platform, index) => (
                      <motion.a
                        key={platform}
                        href="#"
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span className="text-xs font-medium">
                          {platform.charAt(0)}
                        </span>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              {/* Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t">
                <p className="text-center text-xs text-gray-500">
                  © 2024 Su Lanka Tours. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;