import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import anime from 'animejs/lib/anime.es.js';
import SectionTitle from './ui/SectionTitle';
import { Map, CalendarCheck, Briefcase, Leaf, Camera } from 'lucide-react';

// Using the constants directly to avoid import issues
const ROADMAP_STEPS = [
  {
    title: "Plan",
    description: "Collaborate with our travel experts to design your perfect Sri Lankan adventure.",
    icon: "map",
  },
  {
    title: "Book",
    description: "Secure your booking with flexible payment options and instant confirmations.",
    icon: "calendar-check",
  },
  {
    title: "Prepare",
    description: "Receive detailed itineraries, travel tips, and cultural insights before your trip.",
    icon: "briefcase",
  },
  {
    title: "Experience",
    description: "Enjoy immersive experiences with expert local guides and personalized service.",
    icon: "palm-tree", // This will be replaced with Leaf
  },
  {
    title: "Share",
    description: "Take home unforgettable memories and share your Sri Lankan journey with the world.",
    icon: "camera",
  },
];

const Roadmap = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  const roadmapRef = useRef(null);
  const stepRefs = useRef([]);
  
  // Initialize refs for each step
  if (stepRefs.current.length !== ROADMAP_STEPS.length) {
    stepRefs.current = Array(ROADMAP_STEPS.length).fill().map((_, i) => stepRefs.current[i] || React.createRef());
  }
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
      
      // Animate the connecting line
      anime({
        targets: '.roadmap-line',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 2000,
      });
      
      // Animate step numbers with 3D effect
      anime({
        targets: '.step-number',
        scale: [0, 1],
        rotateY: [90, 0],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .6)',
        duration: 1500,
        delay: anime.stagger(300, {start: 500}),
      });
      
      // Add parallax effect on scroll
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const roadmapElement = roadmapRef.current;
        
        if (!roadmapElement) return;
        
        // Get the roadmap section's position relative to viewport
        const rect = roadmapElement.getBoundingClientRect();
        
        // Only apply parallax if the roadmap is in view
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const scrollFactor = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          
          // Apply different parallax rates to each step
          stepRefs.current.forEach((stepRef, index) => {
            if (stepRef.current) {
              const direction = index % 2 === 0 ? 1 : -1;
              const translateY = 20 * scrollFactor * direction;
              const rotateZ = 2 * scrollFactor * direction;
              const scale = 1 + 0.05 * scrollFactor;
              
              anime.set(stepRef.current, {
                translateY: translateY,
                rotateZ: rotateZ,
                scale: scale,
              });
            }
          });
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      
      // Run once on load
      handleScroll();
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [controls, inView]);
  
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
      <div className="container relative" ref={roadmapRef}>
        <SectionTitle 
          title="Our Journey Together" 
          subtitle="From planning to unforgettable memories, here's how we craft your perfect Sri Lankan adventure" 
        />
        
        {/* 3D Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full transform rotate-12 opacity-40"></div>
        <div className="absolute top-40 -right-10 w-20 h-20 bg-secondary/10 rounded-full transform -rotate-12 opacity-50"></div>
        <div className="absolute bottom-20 -left-10 w-32 h-32 bg-secondary/10 rounded-full transform rotate-45 opacity-40"></div>
        
        <div className="relative mt-16 md:mt-24 perspective-1000">
          {/* Connecting line with 3D depth */}
          <div className="hidden md:block absolute top-0 left-1/2 w-1 md:w-3 h-full bg-gradient-to-b from-gray-200 to-primary/20 transform -translate-x-1/2 shadow-lg rounded-full" style={{ transform: 'translateZ(-10px)' }}>
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
                ref={stepRefs.current[index]}
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
                <div className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white text-lg font-bold shadow-lg transform transition-transform hover:scale-110 step-number">
                  {index + 1}
                </div>
                
                {/* Content */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <motion.div 
                    className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 roadmap-card relative overflow-hidden group"
                    initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30, y: 30 }}
                    animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: index % 2 === 0 ? 30 : -30, y: 30 }}
                    transition={{ delay: index * 0.2 + 0.2, duration: 0.6 }}
                    style={{
                      transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'}) rotateX(2deg)`,
                    }}
                  >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className={`flex items-center mb-4 ${index % 2 === 0 ? 'md:justify-end' : 'justify-start'} flex-col md:flex-row gap-4 relative z-10`}>
                      <div className="bg-primary/10 p-3 rounded-full transform group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/20">
                        {getIcon(step.icon)}
                      </div>
                      <h3 className="text-xl font-bold text-primary">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 relative z-10">{step.description}</p>
                    
                    {/* 3D hover effect */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                      style={{
                        boxShadow: 'inset 0 0 20px rgba(10, 92, 54, 0.1)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(10, 92, 54, 0.05) 100%)',
                      }}
                    ></div>
                  </motion.div>
                </div>
                
                {/* Center circle with number - 3D styled */}
                <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white text-xl font-bold shadow-lg transform transition-transform hover:scale-110 step-number">
                  {index + 1}
                </div>
                
                {/* Empty space for alternating layout */}
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Final destination marker */}
        <motion.div 
          className="w-20 h-20 mx-auto mt-8 mb-12 relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
          <div className="absolute inset-2 bg-primary/30 rounded-full animate-ping animation-delay-300"></div>
          <div className="absolute inset-4 bg-primary/40 rounded-full animate-ping animation-delay-600"></div>
          <div className="absolute inset-0 flex items-center justify-center text-primary">
            <Map size={32} />
          </div>
        </motion.div>
      </div>
      
      {/* Add inline styles for 3D perspective */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .roadmap-card {
          backface-visibility: hidden;
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }
        
        .roadmap-card:hover {
          transform: perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.03) !important;
          z-index: 10;
        }
        
        .step-number {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        
        @keyframes ping {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70%, 100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        /* Make sure elements are visible even if animations don't work */
        @media (prefers-reduced-motion: reduce) {
          .roadmap-line {
            stroke-dashoffset: 0 !important;
          }
          
          .step-number {
            opacity: 1 !important;
            transform: none !important;
          }
          
          .roadmap-card {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Roadmap;