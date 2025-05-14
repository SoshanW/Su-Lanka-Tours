// Gallery.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import anime from 'animejs/lib/anime.es.js';
import SectionTitle from './ui/SectionTitle';
import { FadeIn } from '../animations/fadeIn';
import Button from './ui/Button';
import { GALLERY_IMAGES } from '../utils/constants';

const Gallery = () => {
  const galleryRef = useRef(null);
  const imageRefs = useRef([]);
  
  useEffect(() => {
    if (galleryRef.current) {
      // Staggered animation for gallery images
      const animateImages = () => {
        anime({
          targets: imageRefs.current,
          opacity: [0, 1],
          translateY: [60, 0],
          scale: [0.9, 1],
          easing: 'easeOutExpo',
          duration: 1000,
          delay: anime.stagger(150, {start: 300}),
        });
      };
      
      // Setup intersection observer for gallery
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateImages();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      
      observer.observe(galleryRef.current);
      
      return () => {
        if (galleryRef.current) {
          observer.unobserve(galleryRef.current);
        }
      };
    }
  }, []);
  
  // Add hover animation for images
  const handleImageHover = (index) => {
    anime({
      targets: imageRefs.current[index],
      scale: 1.05,
      duration: 400,
      easing: 'easeOutQuad',
    });
  };
  
  const handleImageLeave = (index) => {
    anime({
      targets: imageRefs.current[index],
      scale: 1,
      duration: 400,
      easing: 'easeOutQuad',
    });
  };
  
  return (
    <section id="gallery" className="section bg-gray-50" ref={galleryRef}>
      <div className="container">
        <SectionTitle 
          title="Gallery" 
          subtitle="A glimpse of the breathtaking sights and experiences awaiting you in Sri Lanka" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {GALLERY_IMAGES.slice(0, 3).map((image, index) => (
            <div 
              key={image.id}
              className="overflow-hidden rounded-lg shadow-md bg-white"
              ref={(el) => (imageRefs.current[index] = el)}
              onMouseEnter={() => handleImageHover(index)}
              onMouseLeave={() => handleImageLeave(index)}
              style={{ opacity: 0 }}
            >
              <div className="relative overflow-hidden group h-64">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">{image.alt}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary">{image.alt}</h3>
                <p className="text-gray-600 text-sm mt-1">Category: {image.category}</p>
              </div>
            </div>
          ))}
        </div>
        
        <FadeIn direction="up" delay={0.5} className="mt-12 text-center">
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            These are just a few highlights from our gallery. Visit our full gallery to see more stunning images from across Sri Lanka.
          </p>
          <Link to="/gallery">
            <Button variant="primary" size="lg">
              View Full Gallery
            </Button>
          </Link>
        </FadeIn>
        
        {/* Decorative elements */}
        <motion.div
          className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary/5 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        />
      </div>
    </section>
  );
};

export default Gallery;