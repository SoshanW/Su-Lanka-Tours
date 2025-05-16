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
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [10, -10]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  
  useEffect(() => {
    // Track mouse movement for global 3D effect
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      setMousePosition({
        x: (clientX - centerX) / centerX,
        y: (clientY - centerY) / centerY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
        });
      }
      
      // Add 3D hover effect to step cards
      stepRefs.current.forEach((ref) => {
        if (!ref.current) return;
        
        const card = ref.current;
        
        // Add mouse move event for card tilt
        const handleCardMouseMove = (e) => {
          const rect = card.getBoundingClientRect();
          const cardX = e.clientX - rect.left - rect.width / 2;
          const cardY = e.clientY - rect.top - rect.height / 2;
          
          const rotateY = cardX * 0.03;
          const rotateX = -cardY * 0.03;
          
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
          
          // Dynamic lighting effect
          const glare = card.querySelector('.card-glare');
          if (glare) {
            const percentX = (e.clientX - rect.left) / rect.width * 100;
            const percentY = (e.clientY - rect.top) / rect.height * 100;
            glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 80%)`;
            glare.style.opacity = '1';
          }
        };
        
        const handleCardMouseLeave = () => {
          card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
          
          const glare = card.querySelector('.card-glare');
          if (glare) {
            glare.style.opacity = '0';
          }
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
  
  // 3D hover effects for final marker
  useEffect(() => {
    const markerEl = document.getElementById('final-marker');
    if (!markerEl) return;
    
    const handleMarkerMouseMove = (e) => {
      const rect = markerEl.getBoundingClientRect();
      const markerX = e.clientX - rect.left - rect.width / 2;
      const markerY = e.clientY - rect.top - rect.height / 2;
      
      const rotateY = markerX * 0.2;
      const rotateX = -markerY * 0.2;
      
      markerEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.1, 1.1, 1.1)`;
    };
    
    const handleMarkerMouseLeave = () => {
      markerEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };
    
    markerEl.addEventListener('mousemove', handleMarkerMouseMove);
    markerEl.addEventListener('mouseleave', handleMarkerMouseLeave);
    
    return () => {
      markerEl.removeEventListener('mousemove', handleMarkerMouseMove);
      markerEl.removeEventListener('mouseleave', handleMarkerMouseLeave);
    };
  }, [inView]);
  
  // Calculate perspective transform based on mouse position
  const getPerspectiveStyle = (depth = 10) => {
    const { x, y } = mousePosition;
    const rotateX = y * depth; // inverse for natural feel
    const rotateY = -x * depth;
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.5s ease-out',
    };
  };
  
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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: i * 0.2,
        duration: 0.8
      }
    })
  };
  
  return (
    <section id="roadmap" className="section relative py-20 overflow-hidden bg-gray-50" ref={ref}>
      {/* 3D Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute -top-20 -left-20 w-60 h-60 bg-primary/5 rounded-full z-0"
          style={{ y: y1, rotateZ: rotate1 }}
        />
        <motion.div 
          className="absolute top-1/3 -right-20 w-40 h-40 bg-secondary/10 rounded-full z-0"
          style={{ y: y2, rotateZ: rotate2 }}
        />
        
        {/* 3D Grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      </div>
      
      <div className="container relative z-10" ref={roadmapRef} style={{ opacity, scale }}>
        <SectionTitle 
          title="Our Journey Together" 
          subtitle="From planning to unforgettable memories, here's how we craft your perfect Sri Lankan adventure" 
        />
        
        {/* 3D Roadmap Container */}
        <motion.div 
          className="relative mt-20 perspective"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          style={getPerspectiveStyle(5)}
        >
          {/* Curved SVG Path */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full z-10 opacity-70">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: '50%', 
                transform: 'translateX(-50%)',
                width: '5px',
                height: '100%',
              }}
            >
              <path
                ref={pathRef}
                d="M50,0 C60,25 40,50 50,75 C60,100 50,100 50,100"
                stroke="#0a4c8c"
                strokeWidth="5"
                fill="none"
                strokeDasharray="1000"
                strokeDashoffset="1000"
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
                  boxShadow: '0 0 20px rgba(10, 76, 140, 0.5)',
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(5px)'
                }}
              >
                <span 
                  className="absolute inset-0 rounded-full animate-ping opacity-75"
                  style={{ 
                    background: 'rgba(10, 76, 140, 0.5)',
                    animationDelay: `${index * 0.2}s`
                  }}
                ></span>
              </div>
            ))}
          </div>
          
          {/* Timeline steps with 3D effects */}
          <div className="relative z-20">
            {ROADMAP_STEPS.map((step, index) => (
              <motion.div
                key={index}
                ref={stepRefs.current[index]}
                className={`flex flex-col md:flex-row items-center md:items-start gap-8 mb-24 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={controls}
              >
                {/* Mobile step number */}
                <div className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white text-lg font-bold shadow-xl transform transition-transform hover:scale-110 z-20">
                  {index + 1}
                </div>
                
                {/* Content Card with 3D Effect */}
                <div className={`w-full md:w-5/12 transform-style-3d ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <motion.div 
                    className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform relative overflow-hidden group roadmap-card transform-style-3d"
                    initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30, y: 30 }}
                    animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: index % 2 === 0 ? 30 : -30, y: 30 }}
                    transition={{ delay: index * 0.2 + 0.2, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Card glare effect */}
                    <div className="card-glare absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-10"></div>
                    
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                    
                    <div className={`flex items-center mb-6 ${index % 2 === 0 ? 'md:justify-end' : 'justify-start'} flex-col md:flex-row gap-4 relative z-20`}>
                      {/* Icon with 3D floating effect */}
                      <motion.div 
                        className="bg-primary/10 p-4 rounded-full transform transition-transform group-hover:scale-110 group-hover:bg-primary/20 relative"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                        style={{ 
                          transformStyle: 'preserve-3d',
                          transform: 'translateZ(20px)'
                        }}
                      >
                        {getIcon(step.icon)}
                        <div className="absolute inset-0 rounded-full bg-primary opacity-10 group-hover:opacity-20 blur-sm"></div>
                      </motion.div>
                      
                      {/* Step title with 3D depth */}
                      <h3 
                        className="text-2xl font-bold text-primary transform-style-3d"
                        style={{ 
                          transformStyle: 'preserve-3d',
                          transform: 'translateZ(15px)'
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>
                    
                    {/* Description with 3D depth */}
                    <p 
                      className="text-gray-600 relative z-20 transform-style-3d"
                      style={{ 
                        transformStyle: 'preserve-3d',
                        transform: 'translateZ(10px)'
                      }}
                    >
                      {step.description}
                    </p>
                    
                    {/* 3D hover effect overlay */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                      style={{
                        boxShadow: 'inset 0 0 20px rgba(10, 92, 54, 0.1)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(10, 76, 140, 0.05) 100%)',
                      }}
                    ></div>
                    
                    {/* 3D edge effect */}
                    <div 
                      className="absolute -bottom-2 -right-2 w-full h-full rounded-xl border-2 border-primary/10 transform-style-3d"
                      style={{ 
                        transform: 'translateZ(-10px)',
                        opacity: 0.5
                      }}
                    ></div>
                  </motion.div>
                </div>
                
                {/* Center circle with number - 3D styled */}
                <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white text-xl font-bold shadow-2xl transform transition-transform hover:scale-110 hover:shadow-glow z-20 transform-style-3d">
                  <motion.div
                    animate={{ rotateY: [0, 180, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full flex items-center justify-center rounded-full transform-style-3d"
                  >
                    {index + 1}
                  </motion.div>
                </div>
                
                {/* Empty space for alternating layout */}
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Final destination marker with 3D effects */}
        <motion.div 
          id="final-marker"
          className="w-24 h-24 mx-auto mt-8 mb-16 relative transform-style-3d"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          style={{ 
            transformStyle: 'preserve-3d',
            transition: 'transform 0.3s ease-out'
          }}
        >
          {/* Multi-layered glowing marker */}
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping-slow transform-style-3d" style={{ transform: 'translateZ(-10px)' }}></div>
          <div className="absolute inset-2 bg-primary/30 rounded-full animate-ping-slow animation-delay-300 transform-style-3d" style={{ transform: 'translateZ(0px)' }}></div>
          <div className="absolute inset-4 bg-primary/40 rounded-full animate-ping-slow animation-delay-600 transform-style-3d" style={{ transform: 'translateZ(10px)' }}></div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center text-primary transform-style-3d" style={{ transform: 'translateZ(20px)' }}>
            <Map size={36} />
          </div>
          
          {/* Text label */}
          <div 
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-primary font-medium transform-style-3d"
            style={{ transform: 'translateZ(15px)' }}
          >
            Your Adventure Awaits
          </div>
        </motion.div>
      </div>
      
      {/* CSS for 3D effects */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .perspective {
          perspective: 2000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        
        .roadmap-card {
          backface-visibility: hidden;
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }
        
        /* Background 3D grid pattern */
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(10,76,140,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(10,76,140,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          transform: perspective(1000px) rotateX(60deg) scale(3) translateY(-10%);
          transform-origin: center center;
        }
        
        /* Path animation */
        .path-animation {
          animation: dash 2s ease-in-out forwards;
          animation-delay: 0.5s;
        }
        
        @keyframes dash {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        
        /* Ping animations */
        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        /* Glow effect */
        .hover\\:shadow-glow:hover {
          box-shadow: 0 0 15px #0a4c8c, 0 0 30px rgba(10, 76, 140, 0.3);
        }
        
        /* Ensure elements are visible even with animations disabled */
        @media (prefers-reduced-motion: reduce) {
          .roadmap-card, .transform-style-3d {
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