import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { NAVIGATION_LINKS } from '../utils/constants';
import { scrollToElement } from '../utils/helpers';
import { Heart, ChevronUp, Mail, Phone, MapPin } from 'lucide-react';

const EnhancedFooter = () => {
  const currentYear = new Date().getFullYear();
  const [hoverState, setHoverState] = useState({
    links: Array(NAVIGATION_LINKS.length).fill(false),
    socials: Array(4).fill(false),
    destinations: Array(6).fill(false),
  });
  
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const controls = useAnimation();
  
  // Intersection observer
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  // Setup scroll-driven animations
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.5, 1, 1]);
  const y1 = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);
  
  // Handle navigation links
  const handleNavLinkClick = (e, sectionId) => {
    e.preventDefault();
    scrollToElement(sectionId);
  };
  
  // Hover state handlers
  const handleMouseEnter = (section, index) => {
    setHoverState(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? true : item)
    }));
  };
  
  const handleMouseLeave = (section, index) => {
    setHoverState(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? false : item)
    }));
  };
  
  // Scroll to top button
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
  
  // Destinations for the footer
  const destinations = [
    "Colombo",
    "Kandy",
    "Sigiriya",
    "Ella",
    "Mirissa",
    "Galle"
  ];
  
  return (
    <footer className="relative overflow-hidden" ref={ref}>
      {/* 3D Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-full h-full bg-dark transform-gpu"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Background Gradient Orbs */}
        <motion.div 
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-30 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'mirror'
          }}
        ></motion.div>
        
        <motion.div 
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-secondary/20 to-transparent opacity-20 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -15, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'mirror',
            delay: 2
          }}
        ></motion.div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 w-full z-10 overflow-hidden leading-0">
        <svg 
          className="relative block w-full h-12 md:h-24" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          fill="#0a4c8c"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          ></path>
        </svg>
      </div>
      
      {/* Main Footer Content */}
      <div className="relative bg-dark text-white pt-24 pb-8 z-20" ref={footerRef}>
        <motion.div 
          className="container mx-auto relative z-10"
          style={{ opacity, scale, y: y1 }}
        >
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {/* Company Info */}
            <motion.div variants={itemVariants}>
              <Link to="/" className="inline-block mb-6" ref={logoRef}>
                <motion.img 
                  src="/images/logo.png" 
                  alt="Su Lanka Tours" 
                  className="h-14 transform-gpu"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                />
              </Link>
              
              <motion.p 
                className="text-gray-300 mb-8 max-w-xs"
                variants={itemVariants}
              >
                Discover the beauty of Sri Lanka with our expert-guided tours and personalized travel experiences.
              </motion.p>
              
              {/* Contact Info With Icons - Now More Interactive */}
              <motion.div 
                className="space-y-6 mb-8"
                variants={itemVariants}
              >
                <motion.a 
                  href="tel:+94774469122" 
                  className="flex items-start group hover:bg-white/10 p-3 rounded-lg transition-all duration-300" 
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-secondary p-3 rounded-full mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white/80 text-xs mb-1">Call Us</h4>
                    <p className="text-white group-hover:text-secondary transition-colors text-lg font-medium">
                      +94 77 446 9122
                    </p>
                    <p className="text-white/60 text-xs mt-1">Available 24/7 for your queries</p>
                  </div>
                </motion.a>
                
                <motion.a 
                  href="mailto:sulankatours@gmail.com" 
                  className="flex items-start group hover:bg-white/10 p-3 rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-secondary p-3 rounded-full mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <Mail size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white/80 text-xs mb-1">Email Us</h4>
                    <p className="text-white group-hover:text-secondary transition-colors break-all text-lg font-medium">
                      sulankatours@gmail.com
                    </p>
                    <p className="text-white/60 text-xs mt-1">We'll respond within 24 hours</p>
                  </div>
                </motion.a>
                
                <div className="flex items-start">
                  <div className="bg-secondary p-3 rounded-full mr-4 mt-1">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white/80 text-xs mb-1">Location</h4>
                    <p className="text-white text-lg font-medium">
                      Sadasiripura, Oruwala,<br />
                      Athurugiriya, Sri Lanka
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Social Links */}
              <motion.div 
                className="flex space-x-3"
                variants={itemVariants}
              >
                {['facebook', 'instagram', 'twitter', 'linkedin'].map((platform, index) => (
                  <motion.a
                    key={platform}
                    href="#"
                    className="relative bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden group"
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
                    }}
                    onMouseEnter={() => handleMouseEnter('socials', index)}
                    onMouseLeave={() => handleMouseLeave('socials', index)}
                  >
                    <svg className="w-5 h-5 text-white group-hover:text-secondary transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {platform === 'facebook' && <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />}
                      {platform === 'instagram' && <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />}
                      {platform === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                      {platform === 'linkedin' && <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />}
                    </svg>
                    
                    {/* Animated ripple effect */}
                    <span className={`absolute inset-0 rounded-full animate-ping-slow opacity-40 bg-secondary ${hoverState.socials[index] ? 'block' : 'hidden'}`}></span>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-6 relative inline-block">
                Quick Links
                <span className="absolute -bottom-1 left-0 w-12 h-1 bg-secondary rounded-full"></span>
              </h3>
              
              <ul className="space-y-4">
                {NAVIGATION_LINKS.map((link, index) => (
                  <motion.li key={link.name}>
                    <motion.a
                      href={link.to}
                      onClick={(e) => handleNavLinkClick(e, link.to.substring(1))}
                      className="text-gray-300 hover:text-white transition-colors group flex items-center"
                      whileHover={{ x: 5 }}
                      onMouseEnter={() => handleMouseEnter('links', index)}
                      onMouseLeave={() => handleMouseLeave('links', index)}
                    >
                      <span className={`inline-block w-0 h-0.5 bg-secondary mr-0 group-hover:w-5 group-hover:mr-2 transition-all duration-300 ${hoverState.links[index] ? 'w-5 mr-2' : ''}`}></span>
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Destinations */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-6 relative inline-block">
                Popular Destinations
                <span className="absolute -bottom-1 left-0 w-12 h-1 bg-secondary rounded-full"></span>
              </h3>
              
              <ul className="space-y-4">
                {destinations.map((destination, index) => (
                  <motion.li key={destination}>
                    <motion.a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors group flex items-center"
                      whileHover={{ x: 5 }}
                      onMouseEnter={() => handleMouseEnter('destinations', index)}
                      onMouseLeave={() => handleMouseLeave('destinations', index)}
                    >
                      <span className={`inline-block w-0 h-0.5 bg-secondary mr-0 group-hover:w-5 group-hover:mr-2 transition-all duration-300 ${hoverState.destinations[index] ? 'w-5 mr-2' : ''}`}></span>
                      {destination}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
          
          {/* Animated Divider */}
          <motion.div 
            className="border-t border-gray-700 mt-16 pt-8 overflow-hidden relative"
            style={{ y: y2 }}
          >
            <motion.div 
              className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-secondary to-transparent"
              animate={{ 
                x: ['-100%', '100%'],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "linear"
              }}
            ></motion.div>
            
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.p 
                className="text-gray-400 text-sm text-center md:text-left"
                variants={itemVariants}
              >
                &copy; {currentYear} Su Lanka Tours. All rights reserved.
              </motion.p>
              
              <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-400">
                <motion.a 
                  href="#" 
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ y: -2, color: '#fff' }}
                  variants={itemVariants}
                >
                  Privacy Policy
                </motion.a>
                <motion.a 
                  href="#" 
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ y: -2, color: '#fff' }}
                  variants={itemVariants}
                >
                  Terms of Service
                </motion.a>
                <motion.a 
                  href="#" 
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ y: -2, color: '#fff' }}
                  variants={itemVariants}
                >
                  Sitemap
                </motion.a>
              </div>
            </div>
            
            {/* Made with love */}
            <motion.div 
              className="mt-6 text-center text-gray-500 text-sm"
              variants={itemVariants}
            >
              <motion.p 
                className="flex items-center justify-center"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                Made with 
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                  className="mx-1 text-red-500"
                >
                  <Heart size={14} fill="currentColor" />
                </motion.span> 
                in Sri Lanka
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-30 hover:bg-secondary transition-colors duration-300"
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronUp size={24} />
        <span className="absolute inset-0 rounded-full bg-primary animate-ping-slow opacity-30"></span>
      </motion.button>
      
      {/* CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Background grid pattern */
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          transform: perspective(1000px) rotateX(60deg) scale(3) translateY(10%);
          transform-origin: center top;
        }
        
        /* Ripple animation */
        @keyframes ping-slow {
          0% { transform: scale(0.2); opacity: 0.6; }
          70%, 100% { transform: scale(2); opacity: 0; }
        }
        
        .animate-ping-slow {
          animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        /* Ensure items are visible on fallback */
        @media (prefers-reduced-motion: reduce) {
          .animate-ping-slow {
            animation: none !important;
            transition: none !important;
          }
        }
      `}}></style>
    </footer>
  );
};

export default EnhancedFooter;