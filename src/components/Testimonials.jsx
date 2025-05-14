// Testimonials.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import SectionTitle from './ui/SectionTitle';
import { FadeIn } from '../animations/fadeIn';
import { TESTIMONIALS } from '../utils/constants';
import { Star } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Testimonials = () => {
  const testimonialRef = useRef(null);
  
  useEffect(() => {
    // Add animations when section comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = document.querySelectorAll('.testimonial-card');
            elements.forEach((element, index) => {
              setTimeout(() => {
                element.classList.add('appear');
              }, index * 200);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    if (testimonialRef.current) {
      observer.observe(testimonialRef.current);
    }
    
    return () => {
      if (testimonialRef.current) {
        observer.unobserve(testimonialRef.current);
      }
    };
  }, []);
  
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
  
  return (
    <section id="testimonials" className="section bg-white" ref={testimonialRef}>
      <div className="container">
        <SectionTitle 
          title="What Our Travelers Say" 
          subtitle="Hear from those who have experienced the magic of Sri Lanka with us" 
        />
        
        <FadeIn direction="up" delay={0.3} className="mt-12">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={true}
            modules={[Pagination, Navigation, Autoplay]}
            className="testimonials-swiper"
          >
            {TESTIMONIALS.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="testimonial-card fade-in bg-gray-50 p-6 rounded-lg shadow-md h-full flex flex-col">
                  <div className="flex flex-col sm:flex-row items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
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
              </SwiperSlide>
            ))}
          </Swiper>
        </FadeIn>
        
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
    </section>
  );
};

export default Testimonials;