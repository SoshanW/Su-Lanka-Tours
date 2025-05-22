import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionTitle from './ui/SectionTitle';
import Button from './ui/Button';
import { MapPin } from 'lucide-react';

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
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  
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
  
  // Device detection with window resize listener
  useEffect(() => {
    const checkDevice = () => {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      
      setIsIOS(iOS);
      setIsMobile(mobile);
    };
    
    // Initial check
    checkDevice();
    
    // Add resize listener to update on screen size change
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);
  
  // Set up refs for carousel items
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, GALLERY_IMAGES.length);
  }, []);
  
  // Add initial animation on mount
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
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
  
  // Event handlers - Enhanced for mobile/iOS with original drag behavior
  const handleWheel = (e) => {
    if (isMobile) return; // Disable wheel events on mobile
    e.preventDefault();
    const wheelProgress = e.deltaY * speedWheel;
    setProgress(prev => prev + wheelProgress);
  };
  
  const handleMouseMove = (e) => {
    // Update cursor position for desktop
    if (!isMobile) {
      setCursorPos({ x: e.clientX, y: e.clientY });
    }
    
    if (!isDown) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
    const mouseProgress = (clientX - startX) * speedDrag;
    
    setProgress(prev => prev + mouseProgress);
    setStartX(clientX);
  };
  
  const handleMouseDown = (e) => {
    setIsDown(true);
    const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || 0;
    setStartX(clientX);
    setStartY(clientY);
  };
  
  const handleMouseUp = () => {
    setIsDown(false);
  };
  
  // Handle click on items
  const handleItemClick = (i) => {
    setProgress((i/(GALLERY_IMAGES.length-1)) * 100);
  };
  
  // Add event listeners - Original drag behavior
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    // Desktop events
    carousel.addEventListener('wheel', handleWheel, { passive: false });
    carousel.addEventListener('mousedown', handleMouseDown);
    carousel.addEventListener('mousemove', handleMouseMove);
    carousel.addEventListener('mouseup', handleMouseUp);
    carousel.addEventListener('mouseleave', handleMouseUp);
    
    // Mobile/Touch events
    carousel.addEventListener('touchstart', handleMouseDown, { passive: false });
    carousel.addEventListener('touchmove', handleMouseMove, { passive: false });
    carousel.addEventListener('touchend', handleMouseUp, { passive: false });
    
    return () => {
      if (carousel) {
        carousel.removeEventListener('wheel', handleWheel);
        carousel.removeEventListener('mousedown', handleMouseDown);
        carousel.removeEventListener('mousemove', handleMouseMove);
        carousel.removeEventListener('mouseup', handleMouseUp);
        carousel.removeEventListener('mouseleave', handleMouseUp);
        carousel.removeEventListener('touchstart', handleMouseDown);
        carousel.removeEventListener('touchmove', handleMouseMove);
        carousel.removeEventListener('touchend', handleMouseUp);
      }
    };
  }, []);
  
  // Global document event listeners for mouse up (in case mouse leaves carousel)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDown(false);
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);
  
  // Get prev, current, and next indices
  const prevIndex = (active - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  const nextIndex = (active + 1) % GALLERY_IMAGES.length;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
  
  const slideVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const handleViewFullGallery = () => {
    window.open('https://www.tripadvisor.com/Attraction_Review-g293962-d11639139-Reviews-Su_Lanka_Tours-Colombo_Western_Province.html#/media-atf/11639139/?albumid=-160&type=0&category=-160', '_blank', 'noopener,noreferrer');
  };
  
  return (
    <section id="gallery" className="section bg-gray-50 py-20 overflow-hidden" ref={ref}>
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
          className={`gallery-carousel relative mt-12 overflow-hidden ${
            isMobile ? 'h-[60vh] md:h-[70vh]' : 'h-[70vh]'
          } user-select-none bg-gradient-to-br from-primary/5 to-secondary/10 rounded-xl`}
          style={{ 
            perspective: isMobile || isIOS ? 'none' : '1000px',
            transformStyle: isMobile || isIOS ? 'flat' : 'preserve-3d'
          }}
          variants={slideVariants}
        >
          {/* Instruction text - Updated with correct messages that respond to screen size */}
          <motion.div 
            className="absolute top-8 left-8 text-primary/80 text-base md:text-lg font-light z-10"
            variants={slideVariants}
            key={isMobile ? 'mobile' : 'desktop'} // Force re-render when device changes
          >
            <span className="font-medium">
              {isMobile ? 'Tap' : 'Click'}
            </span> or <span className="font-medium">
              {isMobile ? 'slide' : 'scroll'}
            </span> to explore
          </motion.div>
          
          {GALLERY_IMAGES.map((image, index) => {
            // Calculate styles based on active index
            const zIndex = getZindex(active)[index];
            const activeOffset = (index-active)/GALLERY_IMAGES.length;
            
            // Calculate transforms - Enhanced for mobile
            const x = activeOffset * (isMobile ? 600 : 800);
            const y = activeOffset * (isMobile ? 150 : 200);
            const rot = activeOffset * (isMobile ? 80 : 120);
            const opacity = zIndex / GALLERY_IMAGES.length * 3 - 2;
            
            // Mobile-specific sizing
            const cardWidth = isMobile ? 'clamp(200px, 45vw, 350px)' : 'clamp(150px, 30vw, 300px)';
            const cardHeight = isMobile ? 'clamp(280px, 55vw, 450px)' : 'clamp(200px, 40vw, 400px)';
            
            return (
              <motion.div 
                key={image.id}
                ref={el => itemsRef.current[index] = el}
                className="carousel-item absolute rounded-lg overflow-hidden cursor-pointer"
                style={{
                  zIndex: zIndex + 10,
                  width: cardWidth,
                  height: cardHeight,
                  top: '50%',
                  left: '50%',
                  margin: `calc(${cardHeight} * -0.5) 0 0 calc(${cardWidth} * -0.5)`,
                  boxShadow: isMobile || isIOS ? '0 5px 25px 5px rgba(0, 0, 0, .3)' : '0 10px 50px 10px rgba(0, 0, 0, .5)',
                  background: 'black',
                  transformOrigin: '0% 100%',
                  transform: isMobile || isIOS ? 
                    `translate(${x}%, ${y}%)` : 
                    `translate(${x}%, ${y}%) rotate(${rot}deg)`,
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
                      fontSize: isMobile ? 'clamp(16px, 4vw, 24px)' : 'clamp(20px, 3vw, 30px)',
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
                      fontSize: isMobile ? 'clamp(24px, 8vw, 48px)' : 'clamp(20px, 10vw, 80px)',
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
          variants={containerVariants}
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
      
      {/* Enhanced CSS for mobile and iOS */}
      <style>{`
        .gallery-carousel {
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          padding: 20px 0;
          /* iOS Safari optimizations */
          -webkit-overflow-scrolling: touch;
          touch-action: none;
        }
        
        .carousel-item {
          /* Ensure better performance on iOS */
          -webkit-transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          -webkit-perspective: 1000;
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
        
        /* iOS specific optimizations */
        @supports (-webkit-touch-callout: none) {
          .gallery-carousel {
            transform-style: flat !important;
            perspective: none !important;
          }
          
          .carousel-item {
            transform-style: flat !important;
            -webkit-transform-style: flat !important;
          }
        }
        
        /* Mobile specific styles */
        @media (max-width: 768px) {
          .gallery-carousel {
            padding: 15px 0;
          }
          
          .carousel-item {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .carousel-item {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AnimatedImmersiveGallery;