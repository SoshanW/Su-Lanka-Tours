import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionTitle from './ui/SectionTitle';

const About = () => {
  // Use react-intersection-observer for detecting when section is in view
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  
  const controls = useAnimation();
  const imageRef = useRef(null);
  const statCounters = useRef([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Add layoutEffect: false to fix the hydration warning
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
    layoutEffect: false
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
      
      // Animate stat counters
      statCounters.current.forEach((counter, index) => {
        const targetValue = getTargetValue(index);
        animateCounter(counter, targetValue);
      });
    } else {
      controls.start('hidden');
    }
  }, [inView, controls]);
  
  // Mouse move effect for 3D card tilt
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imageRef.current) return;
      
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      setMousePosition({ x, y });
    };
    
    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };
    
    const element = imageRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);
  
  // Helper function to animate stat counters
  const animateCounter = (element, target) => {
    if (!element) return;
    
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Use easeOutQuad for nicer animation
      const easeOutQuad = progress * (2 - progress);
      const currentValue = Math.floor(easeOutQuad * target);
      
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };
    
    requestAnimationFrame(updateCounter);
  };
  
  const getTargetValue = (index) => {
    switch (index) {
      case 0: return 10;  // Years of experience
      case 1: return 1000; // Satisfied travelers
      case 2: return 25;  // Unique destinations
      case 3: return 100; // Local expertise
      default: return 0;
    }
  };
  
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
  };
  
  // Calculate 3D transform based on mouse position
  const getImageTransform = () => {
    const { x, y } = mousePosition;
    const tiltMax = 10; // Maximum tilt in degrees
    
    const tiltX = (y / 100) * tiltMax;
    const tiltY = (x / 100) * -tiltMax;
    
    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`,
      transition: x === 0 && y === 0 ? "transform 0.6s ease-out" : "none"
    };
  };
  
  return (
    <section id="about" className="section relative bg-white overflow-hidden py-20" ref={ref}>
      {/* 3D Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute -top-20 -left-20 w-60 h-60 bg-primary/5 rounded-full z-0"
          style={{ y: y1, rotate, scale }}
        />
        <motion.div 
          className="absolute top-40 -right-20 w-40 h-40 bg-secondary/10 rounded-full z-0"
          style={{ y: y2, rotate: useTransform(scrollYProgress, [0, 1], [0, -5]) }}
        />
        <motion.div 
          className="absolute -bottom-10 left-1/4 w-32 h-32 bg-primary/10 rounded-full z-0"
          style={{ y: useTransform(scrollYProgress, [0, 1], [50, -20]) }}
        />
        
        {/* 3D grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-grid-pattern"></div>
        </div>
      </div>
      
      <div className="container relative z-10">
        <SectionTitle 
          title="About Su Lanka Tours" 
          subtitle="Discover our mission and the passion that drives us to showcase the best of Sri Lanka" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center mt-16">
          {/* 3D Interactive Image */}
          <motion.div 
            ref={imageRef}
            className="relative order-2 md:order-1 w-64 sm:w-80 md:w-full mx-auto"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ 
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <motion.div 
              className="relative z-10 rounded-xl overflow-hidden shadow-2xl"
              style={getImageTransform()}
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative overflow-hidden">
                {/* Interactive glow effect on hover */}
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-50 
                  hover:opacity-70 transition-opacity duration-300"
                ></div>
                
                {/* Added fallback for missing image */}
                <img
                  src="/images/founder.jpg"
                  alt="Founder of Su Lanka Tours"
                  className="w-full h-auto transform transition-transform"
                  style={{ filter: "saturate(1.1)" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x400?text=Founder+Image";
                  }}
                />
                
                {/* Interactive overlay mask that follows mouse position */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 
                  hover:opacity-100 transition-opacity duration-300"
                  style={{
                    backgroundPosition: `${50 + mousePosition.x / 20}% ${50 + mousePosition.y / 20}%`,
                  }}
                ></div>
                
                {/* Fixed SVG border with proper React props */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <motion.rect
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-secondary"
                    strokeDasharray="400"
                    initial={{ strokeDashoffset: 400 }}
                    animate={inView ? { strokeDashoffset: 0 } : { strokeDashoffset: 400 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            </motion.div>
            
            {/* 3D decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 bg-primary/10 rounded-lg -z-10 transform -rotate-3"></div>
            <div className="absolute -top-6 -left-6 w-1/2 h-1/2 bg-secondary/10 rounded-lg -z-10 transform rotate-6"></div>
            
            {/* Floating detail card */}
            <motion.div
              className="absolute -bottom-10 -right-10 bg-white p-4 rounded-lg shadow-xl z-20 w-32 md:w-40"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
              transition={{ delay: 1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 30px rgba(0, 0, 0, 0.15)",
                rotate: -2
              }}
            >
              <p className="text-primary text-sm font-medium">Established</p>
              <p className="text-2xl font-bold">2014</p>
              <div className="h-1 w-10 bg-secondary mt-1"></div>
            </motion.div>
          </motion.div>
          
          {/* Content */}
          <motion.div
            className="order-1 md:order-2"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.h3 
              variants={itemVariants}
              className="text-3xl font-bold text-primary mb-4 leading-tight"
            >
              Our Mission
            </motion.h3>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-700 mb-6 leading-relaxed"
            >
              Su Lanka Tours was founded with a simple yet profound mission: to share the authentic beauty and rich cultural heritage of Sri Lanka with travelers from around the world. As a locally-owned travel agency, we combine our intimate knowledge of the island with professional service to create unforgettable experiences.
            </motion.p>
            
            <motion.h3 
              variants={itemVariants}
              className="text-3xl font-bold text-primary mb-4 leading-tight"
            >
              The Su Lanka Experience
            </motion.h3>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-700 mb-8 leading-relaxed"
            >
              What sets us apart is our attention to detail and personalized service. We believe that travel should be transformative, not transactional. With Su Lanka Tours, you'll discover not just the popular attractions but also the hidden gems that make Sri Lanka truly special.
            </motion.p>
            
            {/* 3D Stat cards */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 mt-8"
            >
              {[
                { label: "Years of Experience", value: 10 },
                { label: "Satisfied Travelers", value: 1000 },
                { label: "Unique Destinations", value: 25 },
                { label: "Local Expertise", value: 100 }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="relative bg-gray-50 p-5 rounded-lg overflow-hidden group"
                  whileHover={{ 
                    y: -5, 
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  
                  <div 
                    className="text-primary text-3xl font-bold mb-2 flex items-end"
                    ref={el => statCounters.current[index] = el}
                  >
                    0
                    {stat.label === "Local Expertise" && <span className="ml-1">%</span>}
                    {stat.label === "Satisfied Travelers" && <span className="ml-1">+</span>}
                  </div>
                  <div className="text-gray-700 text-sm">{stat.label}</div>
                  
                  {/* Decorative background element */}
                  <div className="absolute -right-2 -bottom-2 w-12 h-12 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300"></div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Call to action button */}
            <motion.button
              variants={itemVariants}
              className="mt-8 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg 
                shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                flex items-center group"
              whileTap={{ scale: 0.95 }}
            >
              Learn More About Us
              <svg 
                className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
      
      {/* Additional styles for 3D effects */}
      <style dangerouslySetInnerHTML={{
        __html:`
        /* 3D grid pattern for background */
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(10,76,140,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(10,76,140,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          transform: perspective(1000px) rotateX(60deg) scale(2.5) translateY(-10%);
          transform-origin: center center;
        }
        
        /* Ensure items are visible on fallback */
        @media (prefers-reduced-motion: reduce) {
          .transform, .transition-all, .transition-opacity, .transition-transform {
            transition: none !important;
            transform: none !important;
          }
        }
      `}}></style>
    </section>
  );
};

export default About;