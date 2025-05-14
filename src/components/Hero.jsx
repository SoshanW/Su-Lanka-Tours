// Hero.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import anime from 'animejs/lib/anime.es.js';
import { TypewriterText } from '../animations/textAnimation';
import Button from './ui/Button';

const Hero = () => {
  const heroRef = useRef(null);
  
  useEffect(() => {
    // Create background parallax effect on scroll
    const handleParallax = () => {
      if (!heroRef.current) return;
      
      const scrollPosition = window.scrollY;
      const backgroundPosition = `50% ${50 + scrollPosition * 0.1}%`;
      heroRef.current.style.backgroundPosition = backgroundPosition;
    };
    
    // Initialize subtle animation for hero elements
    const initAnimations = () => {
      anime({
        targets: '.hero-text-container',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1200,
        easing: 'easeOutQuad',
        delay: 300
      });
      
      // Animated decorative elements
      anime({
        targets: '.hero-decoration',
        opacity: [0, 0.8],
        scale: [0.8, 1],
        duration: 1500,
        easing: 'easeOutElastic(1, .6)',
        delay: anime.stagger(200, {start: 700})
      });
    };
    
    window.addEventListener('scroll', handleParallax);
    initAnimations();
    
    return () => {
      window.removeEventListener('scroll', handleParallax);
    };
  }, []);
  
  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden"
      style={{
        backgroundImage: 'url("/images/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Decorative elements */}
      <div className="hero-decoration absolute top-1/4 right-1/4 w-24 h-24 opacity-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </svg>
      </div>
      <div className="hero-decoration absolute bottom-1/3 left-1/5 w-32 h-32 opacity-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="60" height="60" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </svg>
      </div>
      <div className="hero-decoration absolute top-1/3 left-2/3 w-20 h-20 opacity-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 90,90 10,90" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
        </svg>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 hero-text-container opacity-0">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Welcome to Su Lanka Tours
          </motion.h1>
          
          <div className="mb-8 text-xl md:text-2xl text-white font-light">
            <TypewriterText 
              text="Discover the Pearl of the Indian Ocean" 
              delay={1.2} 
              speed={70}
              className="inline-block"
            />
          </div>
          
          <motion.p 
            className="text-gray-200 text-lg mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.3 }}
          >
            Experience the beauty, culture, and hospitality of Sri Lanka with our expertly curated tours. From ancient temples to pristine beaches, we'll guide you through an unforgettable journey.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.7 }}
          >
            <Button 
              variant="primary" 
              size="lg" 
              href="#experiences"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('experiences').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Experiences
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-white border-white hover:text-primary hover:border-white hover:bg-white"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll down indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-2 bg-white rounded-full mt-2"
              animate={{ 
                y: [0, 15, 0],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut" 
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;