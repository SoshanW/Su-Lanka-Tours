// About.jsx
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import anime from 'animejs/lib/anime.es.js';
import SectionTitle from './ui/SectionTitle';
import { FadeIn } from '../animations/fadeIn';
import { SlideIn } from '../animations/slideIn';

const About = () => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView({
    root: ref,
    threshold: 0.3,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      
      // Animate the image border
      anime({
        targets: '.image-border',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        delay: 300
      });
    }
  }, [isInView, controls]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };
  
  return (
    <section id="about" className="section bg-white overflow-hidden" ref={ref}>
      <div className="container">
        <SectionTitle 
          title="About Su Lanka Tours" 
          subtitle="Discover our mission and the passion that drives us to showcase the best of Sri Lanka" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image with decorative elements */}
          <FadeIn direction="right" className="relative">
            <div className="relative z-10 overflow-hidden rounded-lg shadow-xl">
              <img
                src="/images/founder.jpg"
                alt="Founder of Su Lanka Tours"
                className="w-full h-auto"
              />
              
              {/* SVG border animation */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <rect
                  className="image-border"
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 bg-primary/10 rounded-lg -z-10"></div>
            <div className="absolute -top-6 -left-6 w-1/3 h-1/3 bg-secondary/20 rounded-lg -z-10"></div>
          </FadeIn>
          
          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.h3 
              variants={itemVariants}
              className="text-2xl font-bold text-primary mb-4"
            >
              Our Mission
            </motion.h3>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-700 mb-6"
            >
              Su Lanka Tours was founded with a simple yet profound mission: to share the authentic beauty and rich cultural heritage of Sri Lanka with travelers from around the world. As a locally-owned travel agency, we combine our intimate knowledge of the island with professional service to create unforgettable experiences.
            </motion.p>
            
            <motion.h3 
              variants={itemVariants}
              className="text-2xl font-bold text-primary mb-4"
            >
              The Su Lanka Experience
            </motion.h3>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-700 mb-6"
            >
              What sets us apart is our attention to detail and personalized service. We believe that travel should be transformative, not transactional. With Su Lanka Tours, you'll discover not just the popular attractions but also the hidden gems that make Sri Lanka truly special.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 mt-8"
            >
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-primary text-3xl font-bold mb-2">10+</div>
                <div className="text-gray-700">Years of Experience</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-primary text-3xl font-bold mb-2">1000+</div>
                <div className="text-gray-700">Satisfied Travelers</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-primary text-3xl font-bold mb-2">25+</div>
                <div className="text-gray-700">Unique Destinations</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-primary text-3xl font-bold mb-2">100%</div>
                <div className="text-gray-700">Local Expertise</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;