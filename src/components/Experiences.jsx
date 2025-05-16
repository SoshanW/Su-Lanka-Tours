import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
// Import useInView from react-intersection-observer instead of framer-motion
import { useInView } from 'react-intersection-observer';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';
import { MapPin } from 'lucide-react';

// Using the constants directly to avoid import issues
const EXPERIENCES = [
  {
    id: 1,
    title: "Sigiriya Rock Fortress",
    description: "Climb the ancient rock fortress of Sigiriya, a UNESCO World Heritage site with stunning frescoes and panoramic views.",
    image: "/images/attractions/sigiriya.jpg",
    location: "Central Province",
  },
  {
    id: 2,
    title: "Ella Train Journey",
    description: "Experience one of the world's most scenic train rides through the misty mountains and tea plantations of Ella.",
    image: "/images/attractions/ella.jpg",
    location: "Uva Province",
  },
  {
    id: 3,
    title: "Temple of the Sacred Tooth Relic",
    description: "Visit the revered Buddhist temple in Kandy that houses the relic of the tooth of Buddha.",
    image: "/images/attractions/kandy.jpg",
    location: "Central Province",
  },
  {
    id: 4,
    title: "Galle Fort",
    description: "Explore the historic Galle Fort, a colonial-era fortified city with charming streets and ocean views.",
    image: "/images/attractions/galle.jpg",
    location: "Southern Province",
  },
  {
    id: 5,
    title: "Yala National Park",
    description: "Embark on a wildlife safari to spot leopards, elephants, and exotic birds in their natural habitat.",
    image: "/images/attractions/yala.jpg",
    location: "Southern Province",
  },
];

const EnhancedExperienceSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  
  // Fix the useInView hook usage
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  
  const controls = useAnimation();
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
      startAutoplay();
    } else {
      controls.start('hidden');
      stopAutoplay();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [inView, controls]);
  
  // Restart autoplay after sliding completes
  useEffect(() => {
    if (!sliding && inView) {
      startAutoplay();
    }
  }, [sliding, inView]);
  
  // Handle mouse movement for 3D effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setMousePosition({ x, y });
    };
    
    const element = sliderRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);
  
  const startAutoplay = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set new interval
    intervalRef.current = setInterval(() => {
      goToSlide((activeIndex + 1) % EXPERIENCES.length, 'next');
    }, 5000);
  };
  
  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const goToSlide = (index, dir) => {
    if (sliding) return;
    
    // Stop autoplay during transition
    stopAutoplay();
    
    setDirection(dir);
    setSliding(true);
    setActiveIndex(index);
    
    // Reset sliding state after animation completes
    setTimeout(() => {
      setSliding(false);
    }, 600);
  };
  
  const goToNext = () => {
    const nextIndex = (activeIndex + 1) % EXPERIENCES.length;
    goToSlide(nextIndex, 'next');
  };
  
  const goToPrev = () => {
    const prevIndex = (activeIndex - 1 + EXPERIENCES.length) % EXPERIENCES.length;
    goToSlide(prevIndex, 'prev');
  };
  
  // Get prev, current, and next indices
  const prevIndex = (activeIndex - 1 + EXPERIENCES.length) % EXPERIENCES.length;
  const nextIndex = (activeIndex + 1) % EXPERIENCES.length;
  
  // Calculate perspective transform based on mouse position
  const getPerspectiveStyle = (depth = 30) => {
    const { x, y } = mousePosition;
    const rotateX = -y * depth; // inverse for natural feel
    const rotateY = x * depth;
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s ease-out',
    };
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
  
  const slideVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
  
  return (
    <section id="experiences" ref={ref} className="section bg-white overflow-hidden py-20">
      <div className="container">
        <SectionTitle 
          title="Experiences in Sri Lanka" 
          subtitle="Discover the diversity of Sri Lanka through our curated experiences that showcase the country's natural beauty, rich culture, and unique heritage" 
        />
        
        <motion.div 
          className="mt-12 relative" 
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* 3D Slider Container */}
          <div 
            className="relative mx-auto max-w-4xl perspective"
            ref={sliderRef}
            style={getPerspectiveStyle(5)}
          >
            {/* 3D Decorative Background Elements */}
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-primary/5 rounded-full z-0 transform rotate-12 opacity-40"></div>
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-secondary/10 rounded-full z-0 transform -rotate-12 opacity-50"></div>
            
            {/* Slider Container with 3D Shadow */}
            <div className="relative overflow-hidden rounded-xl shadow-2xl bg-white transform-style-3d">
              {/* Slider Items */}
              <div className="relative h-[500px]">
                {EXPERIENCES.map((experience, index) => {
                  // Determine the slide's position and visibility
                  let position = '';
                  let opacity = 0;
                  let zIndex = 0;
                  let transform = 'scale(0.8) translateZ(-50px)';
                  
                  if (index === activeIndex) {
                    position = 'active';
                    opacity = 1;
                    zIndex = 3;
                    transform = 'scale(1) translateZ(0)';
                  } else if (index === prevIndex) {
                    position = 'prev';
                    opacity = 0;
                    zIndex = 1;
                    transform = 'translateX(-100%) translateZ(-100px) rotateY(-10deg)';
                  } else if (index === nextIndex) {
                    position = 'next';
                    opacity = 0;
                    zIndex = 2;
                    transform = 'translateX(100%) translateZ(-100px) rotateY(10deg)';
                  }
                  
                  return (
                    <motion.div 
                      key={experience.id}
                      className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ease-out ${position} transform-style-3d`}
                      style={{ 
                        opacity,
                        zIndex,
                        transform,
                      }}
                      variants={slideVariants}
                      initial="hidden"
                      animate={index === activeIndex ? "visible" : "hidden"}
                    >
                      {/* Image and Content with 3D Effects */}
                      <div className="relative h-full overflow-hidden group transform-style-3d">
                        {/* Image with parallax effect */}
                        <div className="absolute inset-0 w-full h-full transform-style-3d">
                          <div className="relative w-full h-full overflow-hidden">
                            <img
                              src={experience.image}
                              alt={experience.title}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                              style={{
                                transform: index === activeIndex 
                                  ? `scale(1.05) translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)` 
                                  : 'scale(1)',
                                transition: 'transform 0.5s ease-out',
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/800x500?text=${experience.title.replace(/ /g, '+')}`;
                              }}
                            />
                            
                            {/* Animated gradient overlay */}
                            <div 
                              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 group-hover:opacity-90 transition-opacity duration-500"
                              style={{
                                background: index === activeIndex 
                                  ? `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 100%)` 
                                  : 'none',
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Content Overlay with 3D Transform */}
                        <div 
                          className="absolute inset-0 flex flex-col justify-end p-8 transform-style-3d"
                          style={{
                            transform: index === activeIndex 
                              ? `translateZ(20px)` 
                              : 'none',
                            transition: 'transform 0.5s ease-out',
                          }}
                        >
                          {/* Location Badge with Floating Effect */}
                          <motion.div 
                            className="flex items-center text-white text-sm mb-4 w-fit"
                            initial={{ y: 20, opacity: 0 }}
                            animate={index === activeIndex ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          >
                            <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                              <MapPin size={16} className="mr-1 text-secondary" />
                              <span>{experience.location}</span>
                            </div>
                          </motion.div>
                          
                          {/* Title with Split Letter Animation */}
                          <motion.h3 
                            className="text-2xl md:text-3xl font-bold text-white mb-3"
                            initial={{ y: 30, opacity: 0 }}
                            animate={index === activeIndex ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                          >
                            {experience.title.split('').map((letter, i) => (
                              <motion.span
                                key={i}
                                initial={{ y: 20, opacity: 0 }}
                                animate={index === activeIndex ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                                transition={{ delay: 0.5 + (i * 0.03), duration: 0.3 }}
                                className="inline-block"
                              >
                                {letter === ' ' ? '\u00A0' : letter}
                              </motion.span>
                            ))}
                          </motion.h3>
                          
                          {/* Enhanced Description with Additional Context */}
                          <motion.div
                            className="overflow-hidden mb-3"
                            initial={{ height: 0, opacity: 0 }}
                            animate={index === activeIndex ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                            transition={{ delay: 0.6, duration: 0.7 }}
                          >
                            <p className="text-white/90 mb-3">{experience.description}</p>
                            
                            {/* Additional context information */}
                            <div className="flex flex-col space-y-2 mt-3">
                              {experience.id === 1 && (
                                <p className="text-white/80 text-sm">
                                  <span className="text-secondary font-medium">Best time to visit:</span> Early morning (6-8am) to avoid crowds and heat. Allow 2-3 hours for the climb and exploration of the ancient palace ruins at the summit.
                                </p>
                              )}
                              {experience.id === 2 && (
                                <p className="text-white/80 text-sm">
                                  <span className="text-secondary font-medium">Travel tip:</span> The 7-hour journey from Kandy to Ella is most scenic between 9am-2pm. Reserve window seats on the right side of the train for the best mountain views.
                                </p>
                              )}
                              {experience.id === 3 && (
                                <p className="text-white/80 text-sm">
                                  <span className="text-secondary font-medium">Cultural note:</span> This sacred Buddhist site hosts the annual Esala Perahera festival (July/August), featuring elaborately decorated elephants, dancers and drummers in a grand procession.
                                </p>
                              )}
                              {experience.id === 4 && (
                                <p className="text-white/80 text-sm">
                                  <span className="text-secondary font-medium">Historical insight:</span> Built by the Portuguese in the 16th century and later fortified by the Dutch, this UNESCO site blends European architecture with South Asian traditions and ocean views.
                                </p>
                              )}
                              {experience.id === 5 && (
                                <p className="text-white/80 text-sm">
                                  <span className="text-secondary font-medium">Safari details:</span> Morning (6am) and evening (3pm) safaris offer the best wildlife viewing opportunities. The park is home to the highest density of leopards in the world.
                                </p>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* 3D Navigation Arrows with Hover Effects */}
              <button 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                onClick={goToPrev}
                aria-label="Previous slide"
                style={{
                  transform: `translateY(-50%) translateZ(30px)`,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
              </button>
              
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                onClick={goToNext}
                aria-label="Next slide"
                style={{
                  transform: `translateY(-50%) translateZ(30px)`,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
              </button>
            </div>
          </div>
          
          {/* Enhanced Navigation Dots with 3D Effect */}
          <div className="flex justify-center mt-8 gap-3">
            {EXPERIENCES.map((_, index) => (
              <motion.button
                key={index}
                className={`h-3 rounded-full transition-all duration-500 ${
                  index === activeIndex ? 'bg-primary w-10' : 'bg-gray-300 w-3 hover:bg-gray-400'
                }`}
                onClick={() => goToSlide(index, index < activeIndex ? 'prev' : 'next')}
                aria-label={`Go to slide ${index + 1}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  boxShadow: index === activeIndex ? '0 4px 10px rgba(10, 76, 140, 0.3)' : 'none',
                  transform: index === activeIndex ? 'translateZ(5px)' : 'none',
                }}
              />
            ))}
          </div>
          
          {/* Bottom Section with Floating Animation */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.p 
              className="text-gray-600 mb-8 max-w-2xl mx-auto"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              These are just a few highlights of what Sri Lanka has to offer. Our team can help you discover even more unique experiences tailored to your interests.
            </motion.p>
            
            {/* 3D Button with Glow Effect */}
            <Button 
              variant="primary" 
              size="lg"
              className="transform transition-transform hover:scale-105 hover:shadow-glow relative overflow-hidden group"
            >
              <span className="relative z-10">View All Experiences</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-secondary/70 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-60 z-0"></span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Essential styles for 3D effects */}
      <style jsx>{`
        .perspective {
          perspective: 2000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        
        /* Slide transitions with 3D effect */
        .prev {
          transform: translateX(-100%) translateZ(-100px) rotateY(-10deg);
          opacity: 0;
        }
        
        .active {
          transform: translateX(0) translateZ(0) rotateY(0);
          opacity: 1;
        }
        
        .next {
          transform: translateX(100%) translateZ(-100px) rotateY(10deg);
          opacity: 0;
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
      `}</style>
    </section>
  );
};

export default EnhancedExperienceSlider;