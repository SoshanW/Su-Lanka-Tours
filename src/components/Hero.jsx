  import React, { useEffect, useRef, useState } from 'react';
  import { motion, useScroll, useTransform } from 'framer-motion';
  import Button from './ui/Button';

  const Hero = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isIOS, setIsIOS] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [screenSize, setScreenSize] = useState('lg');
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [typedText, setTypedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    
    // Detect device type and screen size
    useEffect(() => {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setIsIOS(iOS);
      setIsMobile(mobile);
      
      // Detect screen size
      const updateScreenSize = () => {
        const width = window.innerWidth;
        if (width < 640) {
          setScreenSize('sm');
        } else if (width < 768) {
          setScreenSize('md');
        } else if (width < 1024) {
          setScreenSize('lg');
        } else {
          setScreenSize('xl');
        }
      };
      
      updateScreenSize();
      window.addEventListener('resize', updateScreenSize);
      
      console.log('Hero: Device detection', { iOS, mobile });
      
      return () => window.removeEventListener('resize', updateScreenSize);
    }, []);
    
    // Scroll-based animation (disabled on iOS for performance)
    const { scrollYProgress } = useScroll({
      target: heroRef,
      offset: ["start start", "end start"]
    });
    
    const yBg = useTransform(scrollYProgress, [0, 1], [0, isIOS ? 50 : 200]);
    const opacityTitle = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, isIOS ? 0.98 : 0.9]);
    
    // Subtitle for typewriter effect
    const fullText = "Discover the Pearl of the Indian Ocean";
    
    useEffect(() => {
      // Set loaded state after a brief timeout for entrance animation
      const timeout = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      
      // Trigger typewriter effect after title animation (simplified for iOS)
      const typewriterTimeout = setTimeout(() => {
        if (!isIOS) {
          runTypewriter();
        } else {
          // Show full text immediately on iOS
          setTypedText(fullText);
        }
      }, isIOS ? 1000 : 2000);
      
      // Setup cursor blink effect (disabled on iOS)
      let cursorInterval;
      if (!isIOS) {
        cursorInterval = setInterval(() => {
          setShowCursor(prev => !prev);
        }, 530);
      } else {
        setShowCursor(false);
      }
      
      // Create background parallax effect on mouse movement (disabled on mobile)
      const handleMouseMove = (e) => {
        if (isMobile || !heroRef.current) return;
        
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        setMousePosition({ x, y });
      };
      
      // Set up scroll-based parallax effect (simplified for iOS)
      const handleScroll = () => {
        if (!titleRef.current || isIOS) return;
        
        const scrollPosition = window.scrollY;
        const opacity = 1 - Math.min(1, scrollPosition / 700);
        
        titleRef.current.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        titleRef.current.style.opacity = opacity;
      };
      
      if (!isMobile) {
        window.addEventListener('mousemove', handleMouseMove);
      }
      
      if (!isIOS) {
        window.addEventListener('scroll', handleScroll);
      }
      
      return () => {
        clearTimeout(timeout);
        clearTimeout(typewriterTimeout);
        if (cursorInterval) clearInterval(cursorInterval);
        if (!isMobile) {
          window.removeEventListener('mousemove', handleMouseMove);
        }
        if (!isIOS) {
          window.removeEventListener('scroll', handleScroll);
        }
      };
    }, [isIOS, isMobile]);
    
    // Typewriter effect function (disabled on iOS)
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
            }, 2000);
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
      }, isErasing ? 50 : 100);
      
      return () => {
        clearInterval(typingInterval);
        if (pauseTimer) clearTimeout(pauseTimer);
      };
    };
    
    // Calculate parallax effect based on mouse position (disabled on mobile)
    const getParallaxTransform = (depth = 30) => {
      if (isMobile) return {};
      
      const { x, y } = mousePosition;
      const moveX = (x / 100) * depth;
      const moveY = (y / 100) * depth;
      return {
        transform: `translate(${moveX}px, ${moveY}px)`,
        transition: x === 0 && y === 0 ? 'transform 0.6s ease-out' : 'none'
      };
    };
    
    // Get responsive text classes
    const getTitleClasses = () => {
      const baseClasses = "font-bold text-white mb-4 sm:mb-6 leading-tight";
      switch (screenSize) {
        case 'sm':
          return `${baseClasses} text-3xl`;
        case 'md':
          return `${baseClasses} text-4xl`;
        case 'lg':
          return `${baseClasses} text-5xl`;
        default:
          return `${baseClasses} text-4xl md:text-5xl lg:text-6xl`;
      }
    };
    
    const getSubtitleClasses = () => {
      const baseClasses = "text-white font-light backdrop-blur-sm bg-white/5 inline-block px-3 sm:px-4 md:px-6 py-2 rounded-full mb-6 sm:mb-8";
      switch (screenSize) {
        case 'sm':
          return `${baseClasses} text-base`;
        case 'md':
          return `${baseClasses} text-lg`;
        default:
          return `${baseClasses} text-lg md:text-xl lg:text-2xl`;
      }
    };
    
    const getDescriptionClasses = () => {
      const baseClasses = "text-gray-200 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10";
      switch (screenSize) {
        case 'sm':
          return `${baseClasses} text-sm px-4`;
        case 'md':
          return `${baseClasses} text-base px-6`;
        default:
          return `${baseClasses} text-base md:text-lg`;
      }
    };
    
    // Text animation variants (simplified for iOS)
    const titleVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1, 
        transition: { 
          staggerChildren: isIOS ? 0.01 : 0.03,
          delayChildren: 0.3
        }
      }
    };
    
    const letterVariants = {
      hidden: { 
        opacity: 0, 
        y: isIOS ? 20 : 50,
        rotateX: isIOS ? 0 : 90
      },
      visible: (custom) => ({ 
        opacity: 1, 
        y: 0,
        rotateX: 0,
        transition: { 
          type: isIOS ? "tween" : "spring", 
          stiffness: isIOS ? 100 : 100, 
          damping: isIOS ? 20 : 15,
          delay: custom * (isIOS ? 0.01 : 0.03)
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
          type: isIOS ? "tween" : "spring", 
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
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${isIOS ? 'ios-hero' : ''}`}
        style={{
          background: "linear-gradient(rgba(255, 255, 255, 0.16), rgba(0, 0, 0, 0.7))",
          paddingTop: screenSize === 'sm' ? '5rem' : '6rem',
          paddingBottom: screenSize === 'sm' ? '6rem' : '8rem'
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
            y: isIOS ? 0 : yBg,
            scale: isIOS ? 1 : scale,
            filter: 'brightness(0.9)'
          }}
        />
        
        {/* 3D overlay for depth (simplified on iOS) */}
        <div className={`absolute inset-0 z-0 ${isIOS ? 'bg-black bg-opacity-60' : 'bg-gradient-to-b from-black/50 via-black/40 to-black/80'}`}></div>
        
        {/* Light rays effect (disabled on iOS and mobile) */}
        {!isIOS && !isMobile && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="light-rays"></div>
          </div>
        )}
        
        {/* Content with proper centering and responsive layout */}
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8" ref={titleRef}>
          <div className="max-w-4xl mx-auto text-center flex flex-col justify-center min-h-[60vh] sm:min-h-[70vh]">
            {/* Title with enhanced letter animation */}
            <motion.h1 
              className={`${getTitleClasses()} ${!isIOS ? 'perspective-text' : ''}`}
              variants={titleVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            >
              {/* Split text for individual letter animation */}
              <div className="overflow-hidden mb-1 sm:mb-2">
                {Array.from("Welcome to").map((letter, index) => (
                  <motion.span 
                    key={`welcome-${index}`}
                    className="inline-block"
                    custom={index}
                    variants={letterVariants}
                    style={{ 
                      textShadow: screenSize === 'sm' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 5px 15px rgba(0, 0, 0, 0.5)',
                      display: 'inline-block',
                      transformStyle: isIOS ? 'flat' : 'preserve-3d'
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
                    custom={index + 10}
                    variants={letterVariants}
                    style={{ 
                      textShadow: screenSize === 'sm' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 5px 15px rgba(0, 0, 0, 0.5)',
                      display: 'inline-block',
                      transformStyle: isIOS ? 'flat' : 'preserve-3d'
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </div>
            </motion.h1>
            
            {/* Subtitle with Typewriter Effect (simplified on iOS) */}
            <div className={getSubtitleClasses()}>
              <span>{typedText}</span>
              {!isIOS && (
                <span className={`inline-block w-0.5 ${screenSize === 'sm' ? 'h-4' : 'h-5'} bg-white ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
              )}
            </div>
            
            {/* Description with reveal animation */}
            <motion.div 
              className="overflow-hidden"
              variants={textRevealVariant}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              style={isMobile ? {} : getParallaxTransform(25)}
            >
              <p className={getDescriptionClasses()}>
                Experience the beauty, culture, and hospitality of Sri Lanka with our expertly curated tours. From ancient temples to pristine beaches, we'll guide you through an unforgettable journey.
              </p>
            </motion.div>
            
            {/* Buttons with hover effects (simplified on mobile) */}
            <motion.div 
              className={`flex flex-col ${screenSize === 'sm' ? 'gap-3' : 'sm:flex-row gap-4'} justify-center items-center ${screenSize === 'sm' ? 'px-4' : ''}`}
              variants={buttonVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              style={isMobile ? {} : getParallaxTransform(30)}
            >
              <Button 
                variant="primary" 
                size={screenSize === 'sm' ? 'md' : 'lg'}
                className={`relative overflow-hidden group w-full sm:w-auto ${!isMobile ? 'transform transition hover:scale-105 hover:shadow-glow' : ''}`}
                onClick={() => {
                  document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10">Explore Experiences</span>
                {!isMobile && (
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-secondary/70 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size={screenSize === 'sm' ? 'md' : 'lg'}
                className={`relative overflow-hidden group w-full sm:w-auto ${!isMobile ? 'transform transition hover:scale-105' : ''} backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300`}
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10">Contact Us</span>
                {!isMobile && (
                  <span className="absolute inset-0 w-full h-full bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll down indicator (properly positioned and responsive) */}
        {!isIOS && screenSize !== 'sm' && (
          <motion.div 
            className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-white text-xs sm:text-sm mb-2">Scroll Down</span>
              <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-white rounded-full flex justify-center relative">
                <motion.div 
                  className="w-1 h-1.5 sm:h-2 bg-white rounded-full mt-1.5 sm:mt-2"
                  animate={{ 
                    y: [0, 12, 0],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut" 
                  }}
                />
                
                {/* Pulsing circle effect (smaller on tablet) */}
                <div className="absolute -bottom-6 sm:-bottom-8 w-8 sm:w-12 h-8 sm:h-12 flex items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2 sm:h-3 w-2 sm:w-3 bg-white"></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
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
          
          /* Light rays effect (disabled on iOS and mobile) */
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
          
          /* iOS-specific optimizations */
          .ios-hero .perspective-text {
            text-shadow: 0 5px 10px rgba(0, 0, 0, 0.5) !important;
            transform: none !important;
          }
          
          .ios-hero .light-rays {
            display: none !important;
          }
          
          /* Mobile-specific adjustments */
          @media (max-width: 640px) {
            .perspective-text {
              text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
              transform: none !important;
            }
            
            .light-rays {
              display: none !important;
            }
          }
          
          /* Tablet adjustments */
          @media (min-width: 641px) and (max-width: 1024px) {
            .perspective-text {
              text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
            }
          }
          
          /* Ensure proper spacing and prevent overlap */
          @media (max-height: 600px) {
            section[id="home"] {
              padding-top: 3rem !important;
              padding-bottom: 4rem !important;
            }
            
            .min-h-\\[60vh\\] {
              min-height: 50vh !important;
            }
          }
          
          /* Ensure items are visible on fallback */
          @media (prefers-reduced-motion: reduce) {
            .perspective-text {
              text-shadow: 0 5px 10px rgba(0, 0, 0, 0.5) !important;
              transform: none !important;
            }
            
            .light-rays {
              display: none !important;
            }
          }
          
          /* iOS Safari specific fixes */
          @supports (-webkit-touch-callout: none) {
            .ios-hero {
              -webkit-overflow-scrolling: touch;
            }
            
            .ios-hero .perspective-text {
              transform-style: flat !important;
            }
          }
          
          /* Landscape mobile orientation */
          @media (max-height: 500px) and (orientation: landscape) {
            section[id="home"] {
              padding-top: 2rem !important;
              padding-bottom: 3rem !important;
            }
            
            .min-h-\\[60vh\\] {
              min-height: 40vh !important;
            }
            
            h1 {
              font-size: 1.875rem !important;
              margin-bottom: 0.75rem !important;
            }
            
            .scroll-indicator {
              display: none !important;
            }
          }
        `}}></style>
      </motion.section>
    );
  };

  export default Hero;