import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
// Important: Use react-intersection-observer instead of framer-motion's useInView
import { useInView } from 'react-intersection-observer';
import SectionTitle from './ui/SectionTitle';
import { Star } from 'lucide-react';

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

const Testimonials = () => {
  const controls = useAnimation();
  // Use react-intersection-observer instead of framer-motion's useInView
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Set up animation when section comes into view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
      
      // Initialize the testimonial cards with class-based animation
      const cards = document.querySelectorAll('.testimonial-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('appear');
        }, 200 * index);
      });
      
      // Set up testimonial rotation
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [controls, inView]);
  
  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i < rating ? 'text-secondary fill-secondary' : 'text-gray-300'}
        />
      );
    }
    return stars;
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  return (
    <section id="testimonials" className="section bg-white" ref={ref}>
      <div className="container">
        <SectionTitle 
          title="What Our Travelers Say" 
          subtitle="Hear from those who have experienced the magic of Sri Lanka with us" 
        />
        
        <motion.div 
          className="mt-12"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Simple testimonial carousel */}
          <div className="relative mx-auto max-w-4xl px-6">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${activeIndex * 100}%)`,
                  width: `${TESTIMONIALS.length * 100}%`,
                  display: 'flex',
                }}
              >
                {TESTIMONIALS.map((testimonial, index) => (
                  <div 
                    key={testimonial.id} 
                    className="w-full flex-shrink-0 px-4"
                    style={{ width: `${100 / TESTIMONIALS.length}%` }}
                  >
                    <div 
                      className="testimonial-card bg-gray-50 p-6 rounded-lg shadow-md h-full flex flex-col opacity-0 transform translate-y-8 transition-all duration-500 ease-out"
                    >
                      <div className="flex flex-col sm:flex-row items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-4">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://via.placeholder.com/150x150?text=${testimonial.name.charAt(0)}`;
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-dark">{testimonial.name}</h3>
                          <p className="text-gray-600">{testimonial.country}</p>
                          <div className="flex mt-1">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                      </div>
                      
                      <blockquote className="mt-4 text-gray-600 italic flex-grow">
                        "{testimonial.testimonial}"
                      </blockquote>
                      
                      {/* Decorative quotation mark */}
                      <div className="absolute top-4 right-4 text-6xl leading-none text-primary/10 font-serif">
                        "
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Navigation arrows */}
            <button 
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md z-10"
              onClick={() => setActiveIndex((prevIndex) => (prevIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md z-10"
              onClick={() => setActiveIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length)}
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-primary/5 p-6 rounded-lg max-w-3xl mx-auto">
            <p className="text-primary font-medium text-lg mb-2">Join our satisfied travelers</p>
            <p className="text-gray-600">
              Ready to create your own Sri Lankan memories? Reach out to us and start planning your journey today.
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* CSS Fallbacks to ensure content visibility */}
      <style jsx>{`
        /* Ensure testimonial cards are visible even if animations fail */
        .testimonial-card.appear {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        /* Fallback for no JavaScript or when animations don't run */
        @media (prefers-reduced-motion: reduce) {
          .testimonial-card {
            opacity: 1 !important;
            transform: none !important;
          }
        }
        
        /* Fix for testimonial carousel on mobile */
        @media (max-width: 640px) {
          .testimonial-card {
            min-height: 320px;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;