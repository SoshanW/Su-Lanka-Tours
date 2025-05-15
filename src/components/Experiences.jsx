import React, { useState, useEffect, useRef } from 'react';
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

const SimpleExperienceSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState(null);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  
  // Set up autoplay
  useEffect(() => {
    startAutoplay();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Restart autoplay after sliding completes
  useEffect(() => {
    if (!sliding) {
      startAutoplay();
    }
  }, [sliding]);
  
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
    }, 500);
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
  
  return (
    <section id="experiences" className="section bg-white overflow-hidden">
      <div className="container">
        <SectionTitle 
          title="Experiences in Sri Lanka" 
          subtitle="Discover the diversity of Sri Lanka through our curated experiences that showcase the country's natural beauty, rich culture, and unique heritage" 
        />
        
        <div className="mt-12 relative" ref={containerRef}>
          {/* Slider Container */}
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl shadow-xl">
            {/* Slider Items */}
            <div className="relative h-[500px]">
              {EXPERIENCES.map((experience, index) => {
                // Determine the slide's position and visibility
                let position = '';
                let opacity = 0;
                let zIndex = 0;
                let transform = 'scale(0.8)';
                
                if (index === activeIndex) {
                  position = 'active';
                  opacity = 1;
                  zIndex = 3;
                  transform = 'scale(1)';
                } else if (index === prevIndex) {
                  position = 'prev';
                  opacity = 0;
                  zIndex = 1;
                  transform = 'translateX(-100%)';
                } else if (index === nextIndex) {
                  position = 'next';
                  opacity = 0;
                  zIndex = 2;
                  transform = 'translateX(100%)';
                }
                
                return (
                  <div 
                    key={experience.id}
                    className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out ${position}`}
                    style={{ 
                      opacity,
                      zIndex,
                      transform,
                    }}
                  >
                    {/* Image and Content */}
                    <div className="relative h-full overflow-hidden group">
                      <img
                        src={experience.image}
                        alt={experience.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/800x500?text=${experience.title.replace(/ /g, '+')}`;
                        }}
                      />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6">
                        <div className="flex items-center text-white text-sm mb-2">
                          <MapPin size={16} className="mr-1" />
                          <span>{experience.location}</span>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{experience.title}</h3>
                        
                        <p className="text-white/90 mb-4">{experience.description}</p>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full max-w-xs justify-center text-white border-white hover:bg-white hover:text-primary self-start"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Navigation Arrows */}
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-md"
              onClick={goToPrev}
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-md"
              onClick={goToNext}
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {EXPERIENCES.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-primary w-6' : 'bg-gray-300'
                }`}
                onClick={() => goToSlide(index, index < activeIndex ? 'prev' : 'next')}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            These are just a few highlights of what Sri Lanka has to offer. Our team can help you discover even more unique experiences tailored to your interests.
          </p>
          <Button variant="primary" size="lg">
            View All Experiences
          </Button>
        </div>
      </div>
      
      {/* Essential styles for the slider */}
      <style jsx>{`
        /* Base styles for all slides */
        .prev, .active, .next {
          transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
        }
        
        /* Slide transitions */
        .prev {
          transform: translateX(-100%);
          opacity: 0;
        }
        
        .active {
          transform: translateX(0);
          opacity: 1;
        }
        
        .next {
          transform: translateX(100%);
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default SimpleExperienceSlider;