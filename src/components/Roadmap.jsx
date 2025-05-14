// Roadmap.jsx
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import anime from 'animejs/lib/anime.es.js';
import SectionTitle from './ui/SectionTitle';
import { FadeIn } from '../animations/fadeIn';
import { ROADMAP_STEPS } from '../utils/constants';
// Replace PalmTree with alternatives that exist in the Lucide library
import { Camera, Map, CalendarCheck, Briefcase, Leaf } from 'lucide-react';

const Roadmap = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView({
    root: ref,
    threshold: 0.2,
    triggerOnce: true,
  });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      
      // Animate the connecting line
      anime({
        targets: '.roadmap-line',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 2000,
      });
    }
  }, [isInView, controls]);
  
  // Icon mapping - Updated to use available icons
  const getIcon = (iconName) => {
    const iconProps = { size: 24, className: "text-primary" };
    
    switch (iconName) {
      case 'map':
        return <Map {...iconProps} />;
      case 'calendar-check':
        return <CalendarCheck {...iconProps} />;
      case 'briefcase':
        return <Briefcase {...iconProps} />;
      case 'palm-tree':
        // Replace PalmTree with Leaf (or another available icon)
        return <Leaf {...iconProps} />;
      case 'camera':
        return <Camera {...iconProps} />;
      default:
        return <Map {...iconProps} />;
    }
  };
  
  return (
    <section id="roadmap" className="section bg-gray-50 overflow-hidden" ref={ref}>
      <div className="container">
        <SectionTitle 
          title="Our Journey Together" 
          subtitle="From planning to unforgettable memories, here's how we craft your perfect Sri Lankan adventure" 
        />
        
        <div className="relative mt-16 md:mt-24">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-0 left-1/2 w-0.5 h-full bg-gray-200 transform -translate-x-1/2">
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 2 100"
            >
              <line
                className="roadmap-line"
                x1="1"
                y1="0"
                x2="1"
                y2="100"
                stroke="#0a5c36"
                strokeWidth="2"
                strokeDasharray="6,6"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          
          {/* Timeline steps */}
          <div className="relative z-10">
            {ROADMAP_STEPS.map((step, index) => (
              <motion.div
                key={index}
                className={`flex flex-col md:flex-row items-center md:items-start gap-6 mb-16 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      delay: index * 0.2,
                    },
                  },
                }}
              >
                {/* Mobile step number */}
                <div className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-lg font-bold">
                  {index + 1}
                </div>
                
                {/* Content */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <FadeIn 
                    direction={index % 2 === 0 ? 'right' : 'left'}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="flex items-center mb-4 justify-center md:justify-start flex-col md:flex-row gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        {getIcon(step.icon)}
                      </div>
                      <h3 className="text-xl font-bold text-primary">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </FadeIn>
                </div>
                
                {/* Center circle with number */}
                <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white text-xl font-bold">
                  {index + 1}
                </div>
                
                {/* Empty space for alternating layout */}
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;