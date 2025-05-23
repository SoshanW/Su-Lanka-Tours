// FastAutoplaySlider.jsx - Fast autoplay image slider with minimal 3D effect
import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionTitle from './ui/SectionTitle';

const FastAutoplaySlider = () => {
  // State to track current slide
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const autoplayIntervalRef = useRef(null);
  const sliderRef = useRef(null);
  
  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      
      setIsIOS(iOS);
      setIsMobile(mobile);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Animation controls for scroll-based animations
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false
  });
  
  // Start/stop animations based on view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);
  
  // Slide data
  const slides = [
    {
      id: 1,
      title: ['Discover', 'Sri Lanka'],
      image: '/images/slider/slider-1.jpg',
    },
    {
      id: 2,
      title: ['Experience', 'Local Culture'],
      image: '/images/slider/slider-2.jpg',
    },
    {
      id: 3,
      title: ['Explore', 'Natural Wonders'],
      image: '/images/slider/slider-3.jpg',
    },
    {
      id: 4,
      title: ['Unforgettable', 'Memories'],
      image: '/images/slider/slider-4.jpg',
    }
  ];
  
  // Handle slide transition with optimized timing for mobile
  const goToSlide = (index, dir) => {
    if (isSliding) return;
    
    stopAutoplay();
    setIsSliding(true);
    setCurrentSlideIndex(index);
    
    // Faster transition for mobile devices
    setTimeout(() => {
      setIsSliding(false);
      startAutoplay();
    }, isMobile ? 250 : 350);
  };
  
  // Navigate to next slide
  const nextSlide = () => {
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    goToSlide(nextIndex, 'next');
  };
  
  // Navigate to previous slide
  const prevSlide = () => {
    const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex, 'prev');
  };
  
  // Autoplay setup - start immediately on component mount and when in view
  useEffect(() => {
    // Only start autoplay when in view
    if (inView) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
    
    return () => {
      stopAutoplay();
    };
  }, [inView]);
  
  // Restart autoplay after sliding completes
  useEffect(() => {
    if (!isSliding && inView) {
      startAutoplay();
    }
  }, [isSliding, inView]);
  
  // Optimized autoplay timing for mobile
  const startAutoplay = () => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
    
    // Slower autoplay on mobile for better performance
    const interval = isMobile ? 3000 : 1800;
    
    autoplayIntervalRef.current = setInterval(() => {
      nextSlide();
    }, interval);
  };
  
  // Stop autoplay timer
  const stopAutoplay = () => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  };
  
  // Handle key press events for keyboard navigation
  useEffect(() => {
    const handleKeyUp = (e) => {
      // Left or up arrows
      if ((e.which === 37) || (e.which === 38)) {
        prevSlide();
      }
      // Down or right arrows
      if ((e.which === 39) || (e.which === 40)) {
        nextSlide();
      }
    };
    
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const headerVariants = {
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
  
  const sliderVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.3 // Delay slider appearance until after the title
      }
    }
  };
  
  const navVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.6 // Appear last
      }
    }
  };
  
  // Touch event handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50; // Minimum distance for swipe
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swipe left - go to next
        nextSlide();
      } else {
        // Swipe right - go to previous
        prevSlide();
      }
    }
    
    // Reset touch values
    setTouchStartX(0);
    setTouchEndX(0);
  };
  
  return (
    <section 
      ref={ref}
      id="immersive-slider" 
      className="relative py-16 overflow-hidden"
    >
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <motion.div
            key={`bg-${slide.id}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentSlideIndex ? 1 : 0,
              transition: { duration: 0.5 }
            }}
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${slide.backgroundImage})`,
                filter: 'brightness(0.7)'
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Title appears first, separate from other components */}
      <motion.div 
        className="container mb-12"
        variants={headerVariants}
        initial="hidden"
        animate={controls}
      >
        <SectionTitle 
          title="Journey Through Sri Lanka" 
          subtitle="Experience the beauty and diversity of Sri Lanka through our immersive visual journey"
        />
      </motion.div>
      
      {/* Slider and navigation appear after title */}
      <motion.div 
        className={`slides ${isSliding ? 'is-sliding' : ''}`}
        variants={sliderVariants}
        initial="hidden"
        animate={controls}
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Only show navigation buttons on desktop */}
        {!isMobile && (
          <motion.section 
            className="slides-nav"
            variants={navVariants}
            initial="hidden"
            animate={controls}
          >
            <nav className="slides-nav__nav">
              <button className="slides-nav__prev js-prev" onClick={prevSlide}>Prev</button>
              <button className="slides-nav__next js-next" onClick={nextSlide}>Next</button>
            </nav>
          </motion.section>
        )}

        {/* Mobile swipe indicator */}
        {isMobile && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 text-white/80 text-sm z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Swipe to explore</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce-x-reverse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}

        {slides.map((slide, index) => (
          <section 
            key={slide.id}
            className={`slide ${index === currentSlideIndex ? 'is-active' : ''} ${index === (currentSlideIndex - 1 + slides.length) % slides.length ? 'is-prev' : ''} ${index === (currentSlideIndex + 1) % slides.length ? 'is-next' : ''}`}
          >
            <div className="slide__content">
              <figure className="slide__figure">
                <div className="slide__img" style={{ backgroundImage: `url(${slide.image})` }}></div>
              </figure>
              <header className="slide__header">
                <h2 className="slide__title">
                  <span className="title-line"><span>{slide.title[0]}</span></span>
                  <span className="title-line"><span>{slide.title[1]}</span></span>
                </h2>
              </header>
            </div>
          </section>
        ))}
      </motion.div>
      
      {/* Slider-specific styles */}
      <style>{`
        /* Slides Nav */
        .slides-nav {
          z-index: 99;
          position: fixed;
          right: -5%;
          display: flex;
          align-items: center;
          height: 100%;
          color: #111;
        }
        
        @media (min-width: 54em) {
          .slides-nav {
            right: 2%;
          }
        }
        
        .slides-nav__nav {
          position: relative;
          right: 0;
          display: block;
          font-size: 1em;
          transform: rotate(90deg);
          transform-origin: center;
        }
        
        .slides-nav button {
          position: relative;
          display: inline-block;
          padding: 0.35em;
          margin: 0;
          font-family: "Space Mono", monospace;
          appearance: none;
          background: transparent;
          border: 0;
          overflow-x: hidden;
          transition: color 0.3s ease;
        }
        
        .slides-nav button:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          height: 1px;
          width: 0;
          background: #111;
          transition: width 0.3s ease;
        }
        
        .slides-nav button:hover {
          cursor: pointer;
          color: rgba(17, 17, 17, 0.75);
          transition: color 0.3s ease;
        }
        
        .slides-nav button:hover:after {
          width: 100%;
          transition: width 0.3s ease;
        }
        
        .slides-nav button:focus {
          outline: 0;
        }
        
        .is-sliding .slides-nav {
          pointer-events: none;
        }
        
        /* Slides - Optimized for mobile */
        .slides {
          position: relative;
          display: block;
          height: 70vh;
          width: 100%;
          max-width: 90%;
          margin: 0 auto;
          background: #fff;
          transform: translateZ(0);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          transition: background 0.3s cubic-bezier(.99, 1, .92, 1);
          will-change: transform;
          -webkit-overflow-scrolling: touch;
        }
        
        .is-sliding .slides {
          background: #ededed;
          transition: background 0.3s cubic-bezier(.99, 1, .92, 1);
        }
        
        /* Single Slide - Optimized transitions */
        .slide {
          z-index: -1;
          padding: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          transition: z-index 0.3s ease;
          will-change: transform, opacity;
        }
        
        .slide.is-active {
          z-index: 19;
          transition: z-index 0.3s ease;
        }
        
        .slide__content {
          position: relative;
          margin: 0 auto;
          height: 95%;
          width: 95%;
          top: 2.5%;
          transform: translateZ(0);
        }
        
        @media (min-width: 54em) {
          .slide__content {
            height: 80%;
            width: 80%;
            top: 10%;
          }
        }
        
        .slide__header {
          z-index: 99;
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          overflow-y: hidden;
          transform: translateX(5%);
          will-change: transform;
        }
        
        @media (min-width: 54em) {
          .slide__header {
            transform: translateX(-5%);
          }
        }
        
        .slide__title {
          font-family: Montserrat, helvetica;
          font-size: 2.5em;
          font-weight: 700;
          color: #ffffff;
          overflow-y: hidden;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          will-change: transform, opacity;
          position: relative;
          z-index: 99;
        }
        
        @media (min-width: 54em) {
          .slide__title {
            font-size: 5em;
            text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.6);
          }
        }
        
        .title-line {
          display: block;
          overflow-y: hidden;
          position: relative;
          z-index: 99;
        }
        
        .title-line span {
          display: inline-block;
          transform: translate3d(0, 140%, 0);
          opacity: 0;
          transition: transform 0.2s ease, opacity 0.2s ease;
          will-change: transform, opacity;
          position: relative;
          z-index: 99;
        }
        
        .title-line:nth-child(1) span {
          transition-delay: 0.1s;
        }
        
        .title-line:nth-child(2) span {
          transition-delay: 0.15s;
        }
        
        .is-active .title-line span {
          transform: translate3d(0, 0%, 0);
          opacity: 1;
          transition: transform 0.3s cubic-bezier(.77, 0, .175, 1), opacity 0.2s ease;
        }
        
        .is-active .title-line:nth-of-type(2n) span {
          transition-delay: 0.15s;
        }
        
        .slide__figure {
          z-index: 1;
          position: absolute;
          left: 0;
          right: 0;
          margin: 0 auto;
          height: 100%;
          width: 100%;
          transition: transform 0.25s cubic-bezier(.19, 1, .22, 1);
          will-change: transform;
        }
        
        .is-sliding .slide__figure {
          transform: scale(0.8);
          transition: transform 0.25s cubic-bezier(.19, 1, .22, 1);
        }
        
        .slide__img {
          position: relative;
          display: block;
          background-size: cover;
          background-position: 50%;
          -webkit-backface-visibility: hidden;
          height: 0%;
          width: 100%;
          filter: grayscale(0%);
          transition: height 0.4s cubic-bezier(.19, 1, .22, 1), filter 0.2s ease;
          will-change: height, filter;
          transform: translateZ(0);
        }
        
        .is-active .slide__img {
          height: 100%;
          opacity: 1;
          transition: height 0.3s cubic-bezier(.77, 0, .175, 1), filter 0.2s ease;
        }
        
        .is-sliding .slide__img {
          filter: grayscale(80%);
        }

        /* Touch swipe animations */
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
        }
        
        @keyframes bounce-x-reverse {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
        
        .animate-bounce-x-reverse {
          animation: bounce-x-reverse 1s infinite;
        }

        /* Mobile and iOS optimizations */
        @media (max-width: 768px) {
          .slides {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            touch-action: pan-y pinch-zoom;
          }
          
          .slide__title {
            font-size: 2em;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
          }
          
          .slide__img {
            transition: height 0.3s cubic-bezier(.77, 0, .175, 1);
          }

          /* Hide navigation on mobile */
          .slides-nav {
            display: none;
          }
        }

        /* iOS specific optimizations */
        @supports (-webkit-touch-callout: none) {
          .slides {
            -webkit-transform: translateZ(0);
            -webkit-backface-visibility: hidden;
            -webkit-perspective: 1000;
            touch-action: pan-y pinch-zoom;
          }
          
          .slide__img {
            -webkit-transform: translateZ(0);
            -webkit-backface-visibility: hidden;
          }
          
          .slide__title {
            -webkit-transform: translateZ(0);
            -webkit-backface-visibility: hidden;
          }

          /* Hide navigation on iOS */
          .slides-nav {
            display: none;
          }
        }

        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .slide,
          .slide__img,
          .slide__title,
          .title-line span {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FastAutoplaySlider;