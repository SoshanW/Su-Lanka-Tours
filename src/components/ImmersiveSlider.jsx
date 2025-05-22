// FastAutoplaySlider.jsx - Fast autoplay image slider with minimal 3D effect
import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionTitle from './ui/SectionTitle';

const FastAutoplaySlider = () => {
  // State to track current slide
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const autoplayIntervalRef = useRef(null);
  const sliderRef = useRef(null);
  
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
  
  // Handle slide transition
  const goToSlide = (index, dir) => {
    if (isSliding) return;
    
    // Stop autoplay during transition
    stopAutoplay();
    
    setIsSliding(true);
    setCurrentSlideIndex(index);
    
    // Reset sliding state after animation completes
    setTimeout(() => {
      setIsSliding(false);
      startAutoplay(); // Restart autoplay after transition
    }, 350); // Faster animation time
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
  
  // Start autoplay timer - fast speed
  const startAutoplay = () => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
    
    autoplayIntervalRef.current = setInterval(() => {
      nextSlide();
    }, 1800); // Faster autoplay - every 1.8 seconds
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
      >
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
        
        /* Slides - Added 3D pop effect */
        .slides {
          position: relative;
          display: block;
          height: 70vh;
          width: 100%;
          max-width: 90%;
          margin: 0 auto;
          background: #fff;
          transform: translateZ(0);
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.15), 
            0 15px 35px rgba(0, 0, 0, 0.1);
          transition: background 0.3s cubic-bezier(.99, 1, .92, 1);
        }
        
        .is-sliding .slides {
          background: #ededed;
          transition: background 0.3s cubic-bezier(.99, 1, .92, 1);
        }
        
        /* Single Slide */
        .slide {
          z-index: -1;
          padding: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          transition: z-index 0.4s ease; /* Faster transition */
        }
        
        .slide.is-active {
          z-index: 19;
          transition: z-index 0.4s ease; /* Faster transition */
        }
        
        .slide__content {
          position: relative;
          margin: 0 auto;
          height: 95%;
          width: 95%;
          top: 2.5%;
        }
        
        @media (min-width: 54em) {
          .slide__content {
            height: 80%;
            width: 80%;
            top: 10%;
          }
        }
        
        .slide__header {
          z-index: 9;
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          overflow-y: hidden;
          transform: translateX(5%);
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
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5),
                       -2px -2px 4px rgba(0, 0, 0, 0.5);
        }
        
        @media (min-width: 54em) {
          .slide__title {
            font-size: 5em;
            text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.6),
                         -3px -3px 6px rgba(0, 0, 0, 0.6);
          }
        }
        
        .title-line {
          display: block;
          overflow-y: hidden;
        }
        
        .title-line span {
          display: inline-block;
          transform: translate3d(0, 140%, 0);
          opacity: 0;
          transition: transform 0.2s ease, opacity 0.3s ease; /* Faster transition */
        }
        
        .title-line:nth-child(1) span {
          transition-delay: 0.1s; /* Faster transition */
        }
        
        .title-line:nth-child(2) span {
          transition-delay: 0.15s; /* Faster transition */
        }
        
        .is-active .title-line span {
          transform: translate3d(0, 0%, 0);
          opacity: 1;
          transition: transform 0.3s cubic-bezier(.77, 0, .175, 1), opacity 0.1s ease; /* Faster transition */
        }
        
        .is-active .title-line:nth-of-type(2n) span {
          transition-delay: 0.15s; /* Faster transition */
        }
        
        .slide__figure {
          z-index: 7;
          position: absolute;
          left: 0;
          right: 0;
          margin: 0 auto;
          height: 100%;
          width: 100%;
          transition: transform 0.25s cubic-bezier(.19, 1, .22, 1); /* Faster transition */
        }
        
        .is-sliding .slide__figure {
          transform: scale(0.8);
          transition: transform 0.25s cubic-bezier(.19, 1, .22, 1); /* Faster transition */
        }
        
        .slide__img {
          position: relative;
          display: block;
          background-size: cover;
          background-attachment: fixed;
          background-position: 50%;
          -webkit-backface-visibility: hidden;
          height: 0%;
          width: 100%;
          filter: grayscale(0%);
          transition: height 0.4s 0.5s cubic-bezier(.19, 1, .22, 1), filter 0.2s ease; /* Faster transition */
        }
        
        .is-active .slide__img {
          height: 100%;
          opacity: 1;
          transition: height 0.3s 0.1s cubic-bezier(.77, 0, .175, 1), filter 0.2s ease; /* Faster transition */
        }
        
        .is-sliding .slide__img {
          filter: grayscale(80%);
        }
      `}</style>
    </section>
  );
};

export default FastAutoplaySlider;