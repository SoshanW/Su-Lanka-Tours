import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  
  // Scroll-based animation
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityTitle = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  
  // Subtitle for typewriter effect
  const fullText = "Discover the Pearl of the Indian Ocean";
  
  useEffect(() => {
    // Set loaded state after a brief timeout for entrance animation
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    // Trigger typewriter effect after title animation
    const typewriterTimeout = setTimeout(() => {
      runTypewriter();
    }, 2000); // Start after title animation completes
    
    // Setup cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530); // Blink rate
    
    // Create background parallax effect on mouse movement (excluding title)
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      setMousePosition({ x, y });
    };
    
    // Set up scroll-based parallax effect
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollPosition = window.scrollY;
      const opacity = 1 - Math.min(1, scrollPosition / 700);
      
      if (titleRef.current) {
        titleRef.current.style.transform = `translateY(${scrollPosition * 0.2}px)`;
        titleRef.current.style.opacity = opacity;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timeout);
      clearTimeout(typewriterTimeout);
      clearInterval(cursorInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Typewriter effect function
  const runTypewriter = () => {
    let currentIndex = 0;
    let isErasing = false;
    let pauseTimer = null;
    
    const typingInterval = setInterval(() => {
      // Typing forward
      if (!isErasing && currentIndex <= fullText.length) {
        setTypedText(fullText.substring(0, currentIndex));
        currentIndex++;
        
        // When finished typing, set pause before erasing
        if (currentIndex > fullText.length) {
          isErasing = false;
          pauseTimer = setTimeout(() => {
            isErasing = true;
          }, 2000); // 2 second pause when fully typed
        }
      } 
      // Erasing
      else if (isErasing && currentIndex >= 0) {
        setTypedText(fullText.substring(0, currentIndex));
        currentIndex--;
        
        // When finished erasing, start typing again
        if (currentIndex === 0) {
          isErasing = false;
          clearTimeout(pauseTimer);
        }
      }
    }, isErasing ? 50 : 100); // Faster erasing than typing
    
    return () => {
      clearInterval(typingInterval);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  };
  
  // Calculate parallax effect based on mouse position (for elements other than title)
  const getParallaxTransform = (depth = 30) => {
    const { x, y } = mousePosition;
    const moveX = (x / 100) * depth;
    const moveY = (y / 100) * depth;
    return {
      transform: `translate(${moveX}px, ${moveY}px)`,
      transition: x === 0 && y === 0 ? 'transform 0.6s ease-out' : 'none'
    };
  };
  
  // Text animation variants
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.03,
        delayChildren: 0.3
      }
    }
  };
  
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: 90
    },
    visible: (custom) => ({ 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        delay: custom * 0.03
      }
    })
  };
  
  const textRevealVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.8
      }
    }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10,
        delay: 1.0
      }
    }
  };
  
  return (
    <motion.section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden"
      style={{
        background: "linear-gradient(rgba(255, 255, 255, 0.16), rgba(0, 0, 0, 0.7))"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background image with parallax effect */}
      <motion.div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/images/hero-bg.jpg")',
          y: yBg,
          scale: scale,
        }}
      />
      
      {/* 3D overlay for depth */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>
      
      {/* Light rays effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="light-rays"></div>
      </div>
      
      {/* Content with 3D parallax layers */}
      <div className="container relative z-10" ref={titleRef}>
        <div className="max-w-3xl mx-auto text-center">
          {/* 3D title with enhanced letter animation (NO PARALLAX) */}
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 perspective-text"
            variants={titleVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            {/* Split text for individual letter animation */}
            <div className="overflow-hidden mb-2">
              {Array.from("Welcome to").map((letter, index) => (
                <motion.span 
                  key={`welcome-${index}`}
                  className="inline-block"
                  custom={index}
                  variants={letterVariants}
                  style={{ 
                    textShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
                    display: 'inline-block',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>
            
            <div className="overflow-hidden">
              {Array.from("Su Lanka Tours").map((letter, index) => (
                <motion.span 
                  key={`sulanka-${index}`}
                  className="inline-block"
                  custom={index + 10} // Offset to stagger after "Welcome to"
                  variants={letterVariants}
                  style={{ 
                    textShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
                    display: 'inline-block',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>
          </motion.h1>
          
          {/* Subtitle with Typewriter Effect (NO PARALLAX) */}
          <div className="mb-8 text-xl md:text-2xl text-white font-light backdrop-blur-sm bg-white/5 inline-block px-6 py-2 rounded-full">
            <span>{typedText}</span>
            <span className={`inline-block w-0.5 h-5 bg-white ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
          </div>
          
          {/* Description with reveal animation */}
          <motion.div 
            className="overflow-hidden mb-10"
            variants={textRevealVariant}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            style={getParallaxTransform(25)}
          >
            <p className="text-gray-200 text-lg max-w-2xl mx-auto">
              Experience the beauty, culture, and hospitality of Sri Lanka with our expertly curated tours. From ancient temples to pristine beaches, we'll guide you through an unforgettable journey.
            </p>
          </motion.div>
          
          {/* 3D buttons with hover effects */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={buttonVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            style={getParallaxTransform(30)}
          >
            <Button 
              variant="primary" 
              size="lg" 
              className="relative overflow-hidden group transform transition hover:scale-105 hover:shadow-glow"
              onClick={() => {
                document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10">Explore Experiences</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-secondary/70 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-white border-white hover:text-primary hover:border-white hover:bg-white transform transition hover:scale-105 backdrop-blur-sm"
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center relative">
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
            
            {/* Pulsing circle effect */}
            <div className="absolute -bottom-8 w-12 h-12 flex items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Custom CSS for special effects */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .perspective {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        
        .perspective-text {
          transform-style: preserve-3d;
          text-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }
        
        /* Light rays effect */
        .light-rays {
          position: absolute;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
          background-size: 100% 100%;
          background-position: center center;
          transform: rotate(45deg);
          pointer-events: none;
          opacity: 0.7;
        }
        
        /* Glow effect for buttons */
        .hover\\:shadow-glow:hover {
          box-shadow: 0 0 15px #0a4c8c, 0 0 30px rgba(10, 76, 140, 0.3);
        }
        
        /* Ensure items are visible on fallback */
        @media (prefers-reduced-motion: reduce) {
          .perspective-text {
            text-shadow: 0 5px 10px rgba(0, 0, 0, 0.5) !important;
            transform: none !important;
          }
        }
      `}}></style>
    </motion.section>
  );
};

export default Hero;