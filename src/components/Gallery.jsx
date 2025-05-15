import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';

// Using the constants directly to avoid import issues
const GALLERY_IMAGES = [
  {
    id: 1,
    src: "/images/gallery/gallery1.jpg",
    alt: "Beach sunset in Mirissa",
    category: "beaches",
  },
  {
    id: 2,
    src: "/images/gallery/gallery2.jpg",
    alt: "Tea plantations in Nuwara Eliya",
    category: "nature",
  },
  {
    id: 3,
    src: "/images/gallery/gallery3.jpg",
    alt: "Traditional Sri Lankan dance performance",
    category: "culture",
  },
];

const Gallery = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  return (
    <section id="gallery" className="section bg-gray-50" ref={ref}>
      <div className="container">
        <SectionTitle 
          title="Gallery" 
          subtitle="A glimpse of the breathtaking sights and experiences awaiting you in Sri Lanka" 
        />
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {GALLERY_IMAGES.map((image) => (
            <motion.div 
              key={image.id}
              className="overflow-hidden rounded-lg shadow-md bg-white"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative overflow-hidden group h-64">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/600x400?text=${image.alt.replace(/ /g, '+')}`;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">{image.alt}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary">{image.alt}</h3>
                <p className="text-gray-600 text-sm mt-1">Category: {image.category}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            These are just a few highlights from our gallery. Visit our full gallery to see more stunning images from across Sri Lanka.
          </p>
          <Link to="/gallery">
            <Button variant="primary" size="lg">
              View Full Gallery
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
