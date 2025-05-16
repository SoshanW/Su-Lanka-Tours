import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionTitle from './ui/SectionTitle';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Using the constants directly to avoid import issues
const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Thompson",
    country: "United Kingdom",
    image: "/images/testimonials/person1.jpg",
    testimonial: "Our trip with Su Lanka Tours exceeded all expectations. The personalized itinerary allowed us to experience both popular attractions and hidden gems. Our guide was knowledgeable and friendly, making our journey truly memorable.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    country: "Singapore",
    image: "/images/testimonials/person2.jpg",
    testimonial: "From the ancient cities to pristine beaches, our Sri Lankan adventure was perfectly organized. The attention to detail and the authentic cultural experiences made this trip special. Highly recommended!",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Johnson",
    country: "Australia",
    image: "/images/testimonials/person3.jpg",
    testimonial: "Su Lanka Tours crafted the perfect family vacation for us. The wildlife safaris were a hit with the kids, and the accommodations were excellent. The team was responsive and adaptable to our needs throughout.",
    rating: 5,
  },
];

const EnhancedTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const containerRef = useRef(null);
  const testimonialsRef = useRef(null);
  const autoplayRef = useRef(null);
  
  // Intersection observer
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
      startAutoplay();
    } else {
      controls.start('hidden');
      stopAutoplay();
    }
    
    return () => {
      stopAutoplay();
    };
  }, [inView, controls]);
  
  // Handle mouse movement for 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!testimonialsRef.current) return;
      
      const rect = testimonialsRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      setMousePosition({ x, y });
    };
    
    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };
    
    const element = testimonialsRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);
  
  // Start autoplay
  const startAutoplay = () => {
    if (autoplayRef.current) return;
    
    autoplayRef.current = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 6000); // Change slide every 6 seconds
  };
  
  // Stop autoplay
  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };
  
  // Handle navigation
  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection("right");
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };
  
  const handlePrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection("left");
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };
  
  // Handle direct navigation
  const handleDotClick = (index) => {
    if (isAnimating || index === activeIndex) return;
    
    setIsAnimating(true);
    setDirection(index > activeIndex ? "right" : "left");
    setActiveIndex(index);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };
  
  // Calculate 3D transform based on mouse position
  const getPerspectiveStyle = (depth = 5) => {
    const { x, y } = mousePosition;
    const rotateX = -y * 0.01 * depth;
    const rotateY = x * 0.01 * depth;
    
    return {
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.2s ease-out',
    };
  };
  
  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={18}
          className={i < rating ? 'text-secondary fill-secondary' : 'text-gray-300'}
        />
      );
    }
    return stars;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
  
  // Fixed transition duration for consistent animations
  const slideTransition = {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1]
  };
  
  // Simplified slide variants for more reliable animations
  const slideVariants = {
    enter: (direction) => ({
      x: direction === 'right' ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: slideTransition
    },
    exit: (direction) => ({
      x: direction === 'right' ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      transition: slideTransition
    })
  };
  
  // Animation sequence for content elements
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
      }
    }
  };
  
  return (
    <section id="testimonials" ref={ref} className="section relative py-20 overflow-hidden bg-white">
      {/* 3D Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-full opacity-[0.03]">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full"></div>
          <div className="absolute top-1/4 -right-20 w-40 h-40 bg-secondary/30 rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-primary/10 rounded-full"></div>
        </div>
        
        {/* Background pattern with 3D effect */}
        <div className="absolute inset-0 bg-pattern opacity-[0.03]"></div>
      </div>
      
      <div className="container relative z-10" ref={containerRef}>
        <SectionTitle 
          title="What Our Travelers Say" 
          subtitle="Hear from those who have experienced the magic of Sri Lanka with us" 
        />
        
        <motion.div 
          className="relative max-w-5xl mx-auto mt-16 transform-style-3d perspective"
          ref={testimonialsRef}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          style={getPerspectiveStyle()}
        >
          {/* Floating Quote Icons */}
          <motion.div 
            className="absolute -top-10 -left-10 text-6xl text-primary/10 transform-style-3d"
            animate={{ 
              y: [0, -10, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}
          >
            <Quote size={80} strokeWidth={1} />
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-10 -right-10 text-6xl text-primary/10 transform-style-3d"
            animate={{ 
              y: [0, -10, 0],
              rotate: [5, -5, 5]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px) rotate(180deg)' }}
          >
            <Quote size={80} strokeWidth={1} />
          </motion.div>
          
          {/* 3D Card Container */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl transform-style-3d bg-gradient-to-br from-white to-gray-50">
            {/* 3D Animated Testimonial Carousel */}
            <div className="relative h-[450px] md:h-[400px] overflow-hidden transform-style-3d">
              <AnimatePresence initial={false} mode="wait" custom={direction}>
                <motion.div 
                  key={TESTIMONIALS[activeIndex].id}
                  className="absolute inset-0 p-8 flex flex-col md:flex-row items-center transform-style-3d"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {/* Profile Image with 3D Effect */}
                  <motion.div 
                    className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative transform-style-3d"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(20px)'
                    }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10">
                      <img
                        src={TESTIMONIALS[activeIndex].image}
                        alt={TESTIMONIALS[activeIndex].name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/150x150?text=${TESTIMONIALS[activeIndex].name.charAt(0)}`;
                        }}
                      />
                    </div>
                    
                    {/* Decorative rings */}
                    <div className="absolute inset-0 w-full h-full rounded-full border-4 border-primary/20 transform-style-3d" style={{ transform: 'translateZ(-10px) scale(1.2)' }}></div>
                    <div className="absolute inset-0 w-full h-full rounded-full border-4 border-secondary/20 transform-style-3d" style={{ transform: 'translateZ(-20px) scale(1.4)' }}></div>
                    
                    {/* Country badge */}
                    <div 
                      className="absolute -bottom-2 -right-2 bg-white py-1 px-3 rounded-full text-xs font-medium shadow-md text-primary transform-style-3d"
                      style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}
                    >
                      {TESTIMONIALS[activeIndex].country}
                    </div>
                  </motion.div>
                  
                  {/* Testimonial Content with 3D Effect */}
                  <div className="flex-grow transform-style-3d">
                    {/* Name and Rating with Sequential Animation */}
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      className="mb-4 transform-style-3d"
                      style={{ transformStyle: 'preserve-3d', transform: 'translateZ(15px)' }}
                    >
                      <h3 className="text-xl font-bold text-primary mb-2">{TESTIMONIALS[activeIndex].name}</h3>
                      <div className="flex">
                        {renderStars(TESTIMONIALS[activeIndex].rating)}
                      </div>
                    </motion.div>
                    
                    {/* Testimonial Text with Fade-in Effect */}
                    <motion.blockquote 
                      className="text-gray-700 italic relative transform-style-3d"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}
                    >
                      <div className="relative overflow-hidden">
                        <p>"{TESTIMONIALS[activeIndex].testimonial}"</p>
                      </div>
                    </motion.blockquote>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* 3D Navigation Controls */}
            <motion.div 
              className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-4 z-20 transform-style-3d"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(40px)' }}
            >
              <motion.button
                className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm shadow-lg flex items-center justify-center text-primary hover:bg-white hover:shadow-xl transition-all duration-300"
                onClick={handlePrev}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isAnimating}
              >
                <ChevronLeft size={20} />
              </motion.button>
              
              <motion.button
                className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm shadow-lg flex items-center justify-center text-primary hover:bg-white hover:shadow-xl transition-all duration-300"
                onClick={handleNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isAnimating}
              >
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>
            
            {/* 3D Progress Indicator */}
            <div 
              className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 transform-style-3d"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}
            >
              {TESTIMONIALS.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index === activeIndex ? 'bg-primary w-8' : 'bg-gray-300'
                  }`}
                  onClick={() => handleDotClick(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isAnimating}
                />
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* 3D Call to Action Box */}
        <motion.div 
          className="mt-20 text-center transform-style-3d"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div 
            className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-xl relative overflow-hidden transform-style-3d"
            whileHover={{ scale: 1.02 }}
            style={{ 
              transformStyle: 'preserve-3d',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* 3D Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full transform rotate-12 opacity-60"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-secondary/10 rounded-full transform -rotate-12 opacity-60"></div>
            
            <motion.div 
              className="relative z-10 transform-style-3d"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: 'translateZ(20px)'
              }}
            >
              <motion.p 
                className="text-primary font-medium text-xl mb-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              >
                Join our satisfied travelers
              </motion.p>
              
              <p className="text-gray-600 mb-8">
                Ready to create your own Sri Lankan memories? Reach out to us and start planning your journey today.
              </p>
              
              <motion.button
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Start Planning Now</span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-secondary/70 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-60 z-0"></span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* CSS for 3D effects */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .perspective {
          perspective: 2000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        
        /* Dot pattern background */
        .bg-pattern {
          background-image: radial-gradient(rgba(10, 76, 140, 0.2) 1px, transparent 1px);
          background-size: 30px 30px;
          transform: perspective(1000px) rotateX(60deg) scale(3);
          transform-origin: center center;
        }
        
        /* Glow effect for button */
        .hover\\:shadow-glow:hover {
          box-shadow: 0 0 15px #0a4c8c, 0 0 30px rgba(10, 76, 140, 0.3);
        }
        
        /* Ensure items are visible on fallback */
        @media (prefers-reduced-motion: reduce) {
          .transform-style-3d {
            transform-style: flat !important;
            transform: none !important;
          }
        }
      `}}></style>
    </section>
  );
};

export default EnhancedTestimonials;