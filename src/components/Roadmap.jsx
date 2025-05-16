import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
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

const EnhancedRoadmap = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  
  const roadmapRef = useRef(null);
  const stepRefs = useRef([]);
  const pathRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Initialize refs for each step
  if (stepRefs.current.length !== ROADMAP_STEPS.length) {
    stepRefs.current = Array(ROADMAP_STEPS.length).fill().map((_, i) => stepRefs.current[i] || React.createRef());
  }
  
  // Setup scroll-driven animations
  const { scrollYProgress } = useScroll({
    target: roadmapRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [5, -5]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  
  useEffect(() => {
    // Track mouse movement for global 3D effect with debouncing
    let timeoutId;
    const handleMouseMove = (e) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        setMousePosition({
          x: (clientX - centerX) / centerX,
          y: (clientY - centerY) / centerY
        });
      }, 10); // Small debounce to prevent rapid updates
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
      
      // Animate the connecting SVG path
      if (pathRef.current) {
        anime({
          targets: pathRef.current,
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInOutSine',
          duration: 2000,
          delay: 200,
        });
      }
      
      // Add simplified 3D hover effect to step cards
      stepRefs.current.forEach((ref) => {
        if (!ref.current) return;
        
        const card = ref.current;
        
        // Add mouse move event for card tilt with reduced movement
        const handleCardMouseMove = (e) => {
          const rect = card.getBoundingClientRect();
          const cardCenterX = rect.left + rect.width / 2;
          const cardCenterY = rect.top + rect.height / 2;
          
          // Calculate distance from center (normalized between -1 and 1)
          const rotateY = ((e.clientX - cardCenterX) / (rect.width / 2)) * 2;
          const rotateX = ((e.clientY - cardCenterY) / (rect.height / 2)) * -2;
          
          // Apply with reduced intensity and smoothing
          card.style.transform = `perspective(1000px) rotateX(${rotateX * 2}deg) rotateY(${rotateY * 2}deg)`;
        };
        
        const handleCardMouseLeave = () => {
          // Smooth transition back to normal
          card.style.transition = 'transform 0.5s ease-out';
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
          setTimeout(() => {
            card.style.transition = '';
          }, 500);
        };
        
        card.addEventListener('mousemove', handleCardMouseMove);
        card.addEventListener('mouseleave', handleCardMouseLeave);
        
        return () => {
          card.removeEventListener('mousemove', handleCardMouseMove);
          card.removeEventListener('mouseleave', handleCardMouseLeave);
        };
      });
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
        // Replace PalmTree with Leaf
        return <Leaf {...iconProps} />;
      case 'camera':
        return <Camera {...iconProps} />;
      default:
        return <Map {...iconProps} />;
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };
  
  return (
    <section id="roadmap" className="section relative py-16 overflow-hidden bg-gray-50" ref={ref}>
      {/* 3D Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full z-0"
          style={{ y: y1, rotateZ: rotate1 }}
        />
        <motion.div 
          className="absolute top-1/3 -right-20 w-32 h-32 bg-secondary/10 rounded-full z-0"
          style={{ y: y2, rotateZ: rotate2 }}
        />
        
        {/* 3D Grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      </div>
      
      <div className="container relative z-10" ref={roadmapRef}>
        <SectionTitle 
          title="Our Journey Together" 
          subtitle="From planning to unforgettable memories, here's how we craft your perfect Sri Lankan adventure" 
        />
        
        {/* 3D Roadmap Container - More compact */}
        <motion.div 
          className="relative mt-12 perspective"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Curved SVG Path - Fixed visibility */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full z-10">
            {/* Line path container */}
            <div 
              className="absolute left-1/2 top-0 h-full w-1 bg-primary/30"
              style={{ transform: 'translateX(-50%)' }}
            ></div>
            
            {/* Decorative curved path overlay */}
            <svg 
              width="10" 
              height="100%" 
              viewBox="0 0 10 100" 
              preserveAspectRatio="none"
              style={{ 
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                overflow: 'visible',
              }}
            >
              <path
                ref={pathRef}
                d="M5,0 C8,25 2,50 5,75 C8,100 5,100 5,100"
                stroke="#0a4c8c"
                strokeWidth="3"
                fill="none"
                strokeDasharray="200"
                strokeDashoffset="200"
                strokeLinecap="round"
                className="path-animation"
              />
            </svg>
            
            {/* Decorative circles along path */}
            {[0, 25, 50, 75, 100].map((pos, index) => (
              <div 
                key={index}
                className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary z-20"
                style={{ 
                  top: `${pos}%`, 
                  boxShadow: '0 0 15px rgba(10, 76, 140, 0.4)',
                }}
              />
            ))}
          </div>
          
          {/* Timeline steps with simplified effects */}
          <div className="relative z-20">
            {ROADMAP_STEPS.map((step, index) => (
              <motion.div
                key={index}
                ref={stepRefs.current[index]}
                className={`flex flex-col md:flex-row items-center md:items-start gap-4 mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={controls}
              >
                {/* Mobile step number */}
                <div className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white text-lg font-bold shadow-md z-20">
                  {index + 1}
                </div>
                
                {/* Content Card with simplified effect */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <motion.div 
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform relative overflow-hidden group roadmap-card"
                    initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20, y: 20 }}
                    animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: index % 2 === 0 ? 20 : -20, y: 20 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                    
                    <div className={`flex items-center mb-4 ${index % 2 === 0 ? 'md:justify-end' : 'justify-start'} flex-col md:flex-row gap-3 relative z-20`}>
                      {/* Icon with simplified floating effect */}
                      <motion.div 
                        className="bg-primary/10 p-3 rounded-full transform transition-transform group-hover:scale-105 group-hover:bg-primary/20 relative"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                      >
                        {getIcon(step.icon)}
                      </motion.div>
                      
                      {/* Step title */}
                      <h3 className="text-xl font-bold text-primary">
                        {step.title}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 relative z-20 text-sm">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
                
                {/* Center circle with number - Fixed display */}
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-lg font-bold shadow-md z-20">
                  <span>{index + 1}</span>
                </div>
                
                {/* Empty space for alternating layout */}
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Final destination marker with simplified effects */}
        <motion.div 
          id="final-marker"
          className="w-16 h-16 mx-auto mt-4 mb-8 relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ delay: 1, duration: 0.6 }}
          whileHover={{ scale: 1.1 }}
        >
          {/* Simplified glowing marker */}
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping-slow"></div>
          <div className="absolute inset-2 bg-primary/30 rounded-full animate-ping-slow animation-delay-300"></div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center text-primary">
            <Map size={32} />
          </div>
          
          {/* Text label */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-primary font-medium text-sm">
            Your Adventure Awaits
          </div>
        </motion.div>
      </div>
      
      {/* CSS for simplified effects */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .perspective {
          perspective: 1000px;
        }
        
        .roadmap-card {
          backface-visibility: hidden;
          transform-origin: center center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        /* Background grid pattern */
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(10,76,140,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(10,76,140,0.1) 1px, transparent 1px);
          background-size: 30px 30px;
          transform: perspective(1000px) rotateX(60deg) scale(2.5) translateY(-10%);
          transform-origin: center center;
        }
        
        /* Path animation */
        .path-animation {
          animation: dash 2s ease-in-out forwards;
          animation-delay: 0.3s;
        }
        
        @keyframes dash {
          from {
            stroke-dashoffset: 200;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        
        /* Ping animations */
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          70%, 100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        /* Ensure elements are visible even with animations disabled */
        @media (prefers-reduced-motion: reduce) {
          .roadmap-card {
            transform: none !important;
          }
          
          .path-animation {
            stroke-dashoffset: 0 !important;
          }
          
          .animate-ping-slow {
            animation: none !important;
          }
        }
      `}}></style>
    </section>
  );
};

export default EnhancedRoadmap;