import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';

// Extended gallery images - we'll use the same structure as in the existing site
const GALLERY_IMAGES = [
  {
    id: 1,
    src: "/images/gallery/gallery1.jpg",
    alt: "Beach sunset in Mirissa",
    category: "beaches",
    title: "Mirissa Beach",
    num: "01"
  },
  {
    id: 2,
    src: "/images/gallery/gallery2.jpg",
    alt: "Tea plantations in Nuwara Eliya",
    category: "nature",
    title: "Nuwara Eliya",
    num: "02"
  },
  {
    id: 3,
    src: "/images/gallery/gallery3.jpg",
    alt: "Traditional Sri Lankan dance performance",
    category: "culture",
    title: "Kandyan Dance",
    num: "03"
  },
  {
    id: 4,
    src: "/images/gallery/gallery4.jpg", 
    alt: "Polonnaruwa ancient city ruins",
    category: "heritage",
    title: "Polonnaruwa",
    num: "04"
  },
  {
    id: 5,
    src: "/images/gallery/gallery5.jpg", 
    alt: "Stilt fishermen at sunset",
    category: "culture",
    title: "Stilt Fishing",
    num: "05"
  },
  {
    id: 6,
    src: "/images/gallery/gallery6.jpg", 
    alt: "Tropical rainforest waterfall",
    category: "nature",
    title: "Waterfall",
    num: "06"
  },
  {
    id: 7,
    src: "/images/gallery/gallery7.jpg", 
    alt: "Traditional Sri Lankan food",
    category: "cuisine",
    title: "Sri Lankan Cuisine",
    num: "07"
  },
  {
    id: 8,
    src: "/images/gallery/gallery8.jpg", 
    alt: "Train journey through tea plantations",
    category: "travel",
    title: "Ella Train",
    num: "08"
  },
  {
    id: 9,
    src: "/images/gallery/gallery9.jpg", 
    alt: "Whale watching in Mirissa",
    category: "wildlife",
    title: "Whale Watching",
    num: "09"
  },
  {
    id: 10,
    src: "/images/gallery/gallery10.jpg", 
    alt: "Sigiriya Rock Fortress",
    category: "heritage",
    title: "Sigiriya",
    num: "10"
  }
];

const AnimatedImmersiveGallery = () => {
  const [progress, setProgress] = useState(0); // Start from first image (0)
  const [active, setActive] = useState(0);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  const carouselRef = useRef(null);
  const itemsRef = useRef([]);
  
  // Animation controls
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false
  });
  
  // Constants
  const speedWheel = 0.02;
  const speedDrag = -0.1;
  
  // Set up refs for carousel items
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, GALLERY_IMAGES.length);
  }, []);
  
  // Add initial animation on mount
  useEffect(() => {
    if (inView) {
      // Set a small delay to ensure the gallery is visible first
      const timer = setTimeout(() => {
        // Animate to the first position slowly
        setProgress(0);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [inView]);
  
  // Calculate z-index for items
  const getZindex = (index) => {
    return GALLERY_IMAGES.map((_, i) => 
      (index === i) ? GALLERY_IMAGES.length : GALLERY_IMAGES.length - Math.abs(index - i)
    );
  };
  
  // Animation function
  const animate = () => {
    const clampedProgress = Math.max(0, Math.min(progress, 100));
    const newActive = Math.floor(clampedProgress/100*(GALLERY_IMAGES.length-1));
    
    setProgress(clampedProgress);
    setActive(newActive);
  };
  
  // Update when progress changes or when component initializes
  useEffect(() => {
    animate();
  }, [progress]);
  
  // Start/stop animations based on view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);
  
  // Event handlers
  const handleWheel = (e) => {
    e.preventDefault();
    const wheelProgress = e.deltaY * speedWheel;
    setProgress(prev => prev + wheelProgress);
  };
  
  const handleMouseMove = (e) => {
    // Update cursor position
    setCursorPos({ x: e.clientX, y: e.clientY });
    
    if (!isDown) return;
    
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const mouseProgress = (x - startX) * speedDrag;
    
    setProgress(prev => prev + mouseProgress);
    setStartX(x);
  };
  
  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.clientX || (e.touches && e.touches[0].clientX) || 0);
  };
  
  const handleMouseUp = () => {
    setIsDown(false);
  };
  
  // Handle click on items
  const handleItemClick = (i) => {
    setProgress((i/(GALLERY_IMAGES.length-1)) * 100);
  };
  
  // Add event listeners
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    carousel.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      carousel.removeEventListener('wheel', handleWheel);
    };
  }, []);
  
  // Add touch event listeners for mobile
  useEffect(() => {
    const handleTouchStart = (e) => handleMouseDown(e.touches[0]);
    const handleTouchMove = (e) => handleMouseMove(e.touches[0]);
    const handleTouchEnd = () => handleMouseUp();
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDown, startX]);

  const handleViewFullGallery = () => {
    // Navigate to gallery page
    window.location.href = '/gallery';
  };
  
  // Animation variants for scroll animations
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3
      }
    }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section ref={ref} id="gallery" className="section bg-gray-50 py-20 overflow-hidden">
      <motion.div 
        className="container"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <SectionTitle 
          title="Gallery" 
          subtitle="A glimpse of the breathtaking sights and experiences awaiting you in Sri Lanka" 
        />
        
        <motion.div 
          ref={carouselRef}
          className="gallery-carousel relative mt-12 overflow-hidden h-[70vh] user-select-none bg-gradient-to-br from-primary/5 to-secondary/10 rounded-xl"
          style={{ 
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          variants={itemVariants}
        >
          {/* Instruction text is now moved BEFORE the cards to ensure it appears behind them */}
          <motion.div 
            className="absolute top-8 left-8 text-primary/80 text-lg font-light"
            style={{ zIndex: 1 }} // Lower z-index ensures it appears behind cards
            variants={textVariants}
          >
            <span className="font-medium">Scroll</span> or <span className="font-medium">drag</span> to explore
          </motion.div>
          
          {GALLERY_IMAGES.map((image, index) => {
            // Calculate styles based on active index
            const zIndex = getZindex(active)[index];
            const activeOffset = (index-active)/GALLERY_IMAGES.length;
            
            // Calculate transforms
            const x = activeOffset * 800;
            const y = activeOffset * 200;
            const rot = activeOffset * 120;
            const opacity = zIndex / GALLERY_IMAGES.length * 3 - 2;
            
            return (
              <motion.div 
                key={image.id}
                ref={el => itemsRef.current[index] = el}
                className="carousel-item absolute rounded-lg overflow-hidden cursor-pointer"
                style={{
                  zIndex: zIndex + 10, // Increased z-index to ensure cards appear above instruction text
                  width: 'clamp(150px, 30vw, 300px)',
                  height: 'clamp(200px, 40vw, 400px)',
                  top: '50%',
                  left: '50%',
                  margin: 'calc(clamp(200px, 40vw, 400px) * -0.5) 0 0 calc(clamp(150px, 30vw, 300px) * -0.5)',
                  boxShadow: '0 10px 50px 10px rgba(0, 0, 0, .5)',
                  background: 'black',
                  transformOrigin: '0% 100%',
                  transform: `translate(${x}%, ${y}%) rotate(${rot}deg)`,
                  transition: 'transform 0.8s cubic-bezier(0, 0.02, 0, 1)'
                }}
                onClick={() => handleItemClick(index)}
              >
                <div 
                  className="carousel-box absolute inset-0 w-full h-full"
                  style={{
                    opacity,
                    transition: 'opacity 0.8s cubic-bezier(0, 0.02, 0, 1)',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  {/* Overlay gradient */}
                  <div 
                    className="absolute inset-0 z-10"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, .5))'
                    }}
                  ></div>
                  
                  {/* Category tag */}
                  <div 
                    className="absolute z-10 text-white top-3 right-3 bg-black/30 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {image.category}
                  </div>
                  
                  {/* Title */}
                  <div 
                    className="absolute z-10 text-white bottom-5 left-5"
                    style={{
                      fontSize: 'clamp(20px, 3vw, 30px)',
                      fontWeight: 'bold',
                      textShadow: '0 4px 4px rgba(0, 0, 0, 0.1)',
                      transition: 'opacity 0.8s cubic-bezier(0, 0.02, 0, 1)'
                    }}
                  >
                    {image.title}
                  </div>
                  
                  {/* Number */}
                  <div 
                    className="absolute z-10 text-white top-2 left-5"
                    style={{
                      fontSize: 'clamp(20px, 10vw, 80px)',
                      transition: 'opacity 0.8s cubic-bezier(0, 0.02, 0, 1)'
                    }}
                  >
                    {image.num}
                  </div>
                  
                  {/* Image */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover pointer-events-none"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/800x500?text=${image.title.replace(/ /g, '+')}`;
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          variants={buttonVariants}
        >
          <motion.p 
            className="text-gray-600 mb-6 max-w-2xl mx-auto"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          >
            These are just a few highlights from our gallery. Visit our full gallery to see more stunning images from across Sri Lanka.
          </motion.p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleViewFullGallery}
            className="transform transition-transform hover:scale-105 hover:shadow-glow relative overflow-hidden group"
          >
            <span className="relative z-10">View Full Gallery</span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-secondary/70 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-60 z-0"></span>
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Necessary CSS for the carousel */}
      <style>{`
        .gallery-carousel {
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          padding: 20px 0;
        }
        
        .layout::before {
          content: '';
          position: absolute;
          z-index: 1;
          top: 0;
          left: 90px;
          width: 10px;
          height: 100%;
          border: 1px solid #fff;
          border-top: none;
          border-bottom: none;
          opacity: .15;
        }
        
        .hover\\:shadow-glow:hover {
          box-shadow: 0 0 15px #0a4c8c, 0 0 30px rgba(10, 76, 140, 0.3);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .carousel-item {
            transition: none !important;
          }
          
          .cursor, .cursor2 {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AnimatedImmersiveGallery;