import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';

const Hero = () => {
  useEffect(() => {
    // Create background parallax effect on scroll
    const handleParallax = () => {
      const heroSection = document.querySelector('#home');
      if (!heroSection) return;
      
      const scrollPosition = window.scrollY;
      const backgroundPosition = `50% ${50 + scrollPosition * 0.1}%`;
      heroSection.style.backgroundPosition = backgroundPosition;
    };
    
    window.addEventListener('scroll', handleParallax);
    
    return () => {
      window.removeEventListener('scroll', handleParallax);
    };
  }, []);
  
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden"
      style={{
        backgroundImage: 'url("/images/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Welcome to Su Lanka Tours
          </motion.h1>
          
          <motion.div 
            className="mb-8 text-xl md:text-2xl text-white font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Discover the Pearl of the Indian Ocean
          </motion.div>
          
          <motion.p 
            className="text-gray-200 text-lg mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            Experience the beauty, culture, and hospitality of Sri Lanka with our expertly curated tours. From ancient temples to pristine beaches, we'll guide you through an unforgettable journey.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => {
                document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Experiences
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-white border-white hover:text-primary hover:border-white hover:bg-white"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
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
        transition={{ delay: 2.5, duration: 1 }}
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