// Experiences.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import SectionTitle from './ui/SectionTitle';
import { FadeIn } from '../animations/fadeIn';
import Button from './ui/Button';
import { EXPERIENCES } from '../utils/constants';
import { MapPin } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Experiences = () => {
  const sectionRef = useRef(null);
  
  useEffect(() => {
    // Initialize anime.js animations
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animations when section is in view
          const cards = document.querySelectorAll('.experience-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('appear');
            }, 200 * index);
          });
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.2,
    });
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section id="experiences" className="section bg-white" ref={sectionRef}>
      <div className="container">
        <SectionTitle 
          title="Experiences in Sri Lanka" 
          subtitle="Discover the diversity of Sri Lanka through our curated experiences that showcase the country's natural beauty, rich culture, and unique heritage" 
        />
        
        <FadeIn direction="up" delay={0.4} className="mt-12">
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            initialSlide={2}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="experiences-swiper"
          >
            {EXPERIENCES.map((experience) => (
              <SwiperSlide key={experience.id} className="experience-slide">
                <div className="experience-card fade-in bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center text-white text-sm">
                        <MapPin size={16} className="mr-1" />
                        <span>{experience.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-3">{experience.title}</h3>
                    <p className="text-gray-600 mb-4">{experience.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-center"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </FadeIn>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            These are just a few highlights of what Sri Lanka has to offer. Our team can help you discover even more unique experiences tailored to your interests.
          </p>
          <Button variant="primary" size="lg">
            View All Experiences
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Experiences;