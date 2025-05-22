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
  const y1 = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const y2 = useTransform(scrollYProgress, [0, 1], [25, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
  
  // Destinations for the footer
  const destinations = [
    "Colombo", "Kandy", "Sigiriya", 
    "Ella", "Mirissa", "Galle"
  ];
  
  return (
    <footer className="relative overflow-hidden" ref={ref}>
      {/* 3D Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-full h-full bg-dark transform-gpu"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Background Gradient Orbs */}
        <motion.div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-30 blur-xl"
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
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-tr from-secondary/20 to-transparent opacity-20 blur-xl"
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
          className="relative block w-full h-8 md:h-16" 
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
      <div className="relative bg-dark text-white pt-16 pb-6 z-20" ref={footerRef}>
        <motion.div 
          className="container mx-auto relative z-10"
          style={{ opacity, scale, y: y1 }}
        >
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {/* Company Info */}
            <motion.div variants={itemVariants}>
              <Link to="/" className="inline-block mb-4" ref={logoRef}>
                <motion.img 
                  src="/images/logo.png" 
                  alt="Su Lanka Tours" 
                  className="h-16 transform-gpu"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                />
              </Link>
              
              <motion.p 
                className="text-gray-300 mb-4 max-w-xs text-sm"
                variants={itemVariants}
              >
                Discover the beauty of Sri Lanka with our expert-guided tours and personalized travel experiences.
              </motion.p>
              
              {/* Contact Info With Icons - More Compact */}
              <motion.div 
                className="space-y-3 mb-4"
                variants={itemVariants}
              >
                <motion.a 
                  href="tel:+94773559810" 
                  className="flex items-start group hover:bg-white/10 p-2 rounded-lg transition-all duration-300" 
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-secondary p-2 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300">
                    <Phone size={14} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white/80 text-xs mb-0.5">Call Us</h4>
                    <p className="text-white group-hover:text-secondary transition-colors text-base font-medium">
                      +94 77 355 9810
                    </p>
                  </div>
                </motion.a>
                
                <motion.a 
                  href="tel:+94774469122" 
                  className="flex items-start group hover:bg-white/10 p-2 rounded-lg transition-all duration-300" 
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-secondary p-2 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300">
                    <Phone size={14} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white/80 text-xs mb-0.5">Call Us</h4>
                    <p className="text-white group-hover:text-secondary transition-colors text-base font-medium">
                      +94 77 446 9122
                    </p>
                  </div>
                </motion.a>
                
                <motion.a 
                  href="mailto:sulankatours@gmail.com" 
                  className="flex items-start group hover:bg-white/10 p-2 rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-secondary p-2 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300">
                    <Mail size={14} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white/80 text-xs mb-0.5">Email Us</h4>
                    <p className="text-white group-hover:text-secondary transition-colors break-all text-base font-medium">
                      sulankatours@gmail.com
                    </p>
                  </div>
                </motion.a>
                
                <div className="flex items-start group p-2">
                  <div className="bg-secondary p-2 rounded-full mr-3">
                    <MapPin size={14} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white/80 text-xs mb-0.5">Location</h4>
                    <p className="text-white text-base font-medium">
                      232, Sadasiripura, Oruwala,<br />
                      Athurugiriya, Sri Lanka
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Social Links */}
              <motion.div 
                className="flex space-x-2"
                variants={itemVariants}
              >
                {[
                  { platform: 'facebook', url: 'https://www.facebook.com/sulankatours' },
                  { platform: 'instagram', url: 'https://www.instagram.com/sulankatours/' },
                  { platform: 'whatsapp', url: 'https://wa.me/94773559810' }
                ].map(({ platform, url }, index) => (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden group"
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 0 12px rgba(245, 158, 11, 0.5)'
                    }}
                    onMouseEnter={() => handleMouseEnter('socials', index)}
                    onMouseLeave={() => handleMouseLeave('socials', index)}
                  >
                    <svg className="w-4 h-4 text-white group-hover:text-secondary transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {platform === 'facebook' && <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />}
                      {platform === 'instagram' && <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />}
                      {platform === 'whatsapp' && <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />}
                    </svg>
                    
                    {/* Animated ripple effect */}
                    <span className={`absolute inset-0 rounded-full animate-ping-slow opacity-40 bg-secondary ${hoverState.socials[index] ? 'block' : 'hidden'}`}></span>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-base font-bold mb-4 relative inline-block">
                Quick Links
                <span className="absolute -bottom-1 left-0 w-10 h-1 bg-secondary rounded-full"></span>
              </h3>
              
              <ul className="space-y-2 text-sm">
                {NAVIGATION_LINKS.map((link, index) => (
                  <motion.li key={link.name}>
                    <motion.a
                      href={link.to}
                      onClick={(e) => handleNavLinkClick(e, link.to.substring(1))}
                      className="text-gray-300 hover:text-white transition-colors group flex items-center"
                      whileHover={{ x: 3 }}
                      onMouseEnter={() => handleMouseEnter('links', index)}
                      onMouseLeave={() => handleMouseLeave('links', index)}
                    >
                      <span className={`inline-block w-0 h-0.5 bg-secondary mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300 ${hoverState.links[index] ? 'w-4 mr-2' : ''}`}></span>
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Destinations */}
            <motion.div variants={itemVariants}>
              <h3 className="text-base font-bold mb-4 relative inline-block">
                Popular Destinations
                <span className="absolute -bottom-1 left-0 w-10 h-1 bg-secondary rounded-full"></span>
              </h3>
              
              <ul className="space-y-2 text-sm">
                {destinations.map((destination, index) => (
                  <motion.li key={destination}>
                    <motion.a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors group flex items-center"
                      whileHover={{ x: 3 }}
                      onMouseEnter={() => handleMouseEnter('destinations', index)}
                      onMouseLeave={() => handleMouseLeave('destinations', index)}
                    >
                      <span className={`inline-block w-0 h-0.5 bg-secondary mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300 ${hoverState.destinations[index] ? 'w-4 mr-2' : ''}`}></span>
                      {destination}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
          
          {/* Animated Divider */}
          <motion.div 
            className="border-t border-gray-700 mt-8 pt-4 overflow-hidden relative"
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
                className="text-gray-400 text-xs text-center md:text-left"
                variants={itemVariants}
              >
                &copy; {currentYear} Su Lanka Tours. All rights reserved.
              </motion.p>
              
              <div className="mt-2 md:mt-0 flex space-x-4 text-xs text-gray-400">
                <motion.a 
                  href="#" 
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ y: -1, color: '#fff' }}
                  variants={itemVariants}
                >
                  Privacy Policy
                </motion.a>
                <motion.a 
                  href="#" 
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ y: -1, color: '#fff' }}
                  variants={itemVariants}
                >
                  Terms of Service
                </motion.a>
                <motion.a 
                  href="#" 
                  className="hover:text-white transition-colors duration-300"
                  whileHover={{ y: -1, color: '#fff' }}
                  variants={itemVariants}
                >
                  Sitemap
                </motion.a>
              </div>
            </div>
            
            {/* Made with love */}
            <motion.div 
              className="mt-3 text-center text-gray-500 text-xs"
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
                  <Heart size={12} fill="currentColor" />
                </motion.span> 
                in Sri Lanka
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-30 hover:bg-secondary transition-colors duration-300"
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronUp size={20} />
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
          background-size: 30px 30px;
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