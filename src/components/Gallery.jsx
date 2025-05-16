import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
    src: "/images/gallery/gallery1.jpg", // Reusing images for demo
    alt: "Polonnaruwa ancient city ruins",
    category: "heritage",
    title: "Polonnaruwa",
    num: "04"
  },
  {
    id: 5,
    src: "/images/gallery/gallery2.jpg", // Reusing images for demo
    alt: "Stilt fishermen at sunset",
    category: "culture",
    title: "Stilt Fishing",
    num: "05"
  },
  {
    id: 6,
    src: "/images/gallery/gallery3.jpg", // Reusing images for demo
    alt: "Tropical rainforest waterfall",
    category: "nature",
    title: "Waterfall",
    num: "06"
  },
  {
    id: 7,
    src: "/images/gallery/gallery1.jpg", // Reusing images for demo
    alt: "Traditional Sri Lankan food",
    category: "cuisine",
    title: "Sri Lankan Cuisine",
    num: "07"
  },
  {
    id: 8,
    src: "/images/gallery/gallery2.jpg", // Reusing images for demo
    alt: "Train journey through tea plantations",
    category: "travel",
    title: "Ella Train",
    num: "08"
  },
  {
    id: 9,
    src: "/images/gallery/gallery3.jpg", // Reusing images for demo
    alt: "Whale watching in Mirissa",
    category: "wildlife",
    title: "Whale Watching",
    num: "09"
  },
  {
    id: 10,
    src: "/images/gallery/gallery1.jpg", // Reusing images for demo
    alt: "Sigiriya Rock Fortress",
    category: "heritage",
    title: "Sigiriya",
    num: "10"
  }
];

const ImmersiveGallery = () => {
  const [progress, setProgress] = useState(50);
  const [active, setActive] = useState(0);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  const carouselRef = useRef(null);
  const itemsRef = useRef([]);
  
  // Constants
  const speedWheel = 0.02;
  const speedDrag = -0.1;
  
  // Set up refs for carousel items
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, GALLERY_IMAGES.length);
  }, []);
  
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
  
  // Update when progress changes
  useEffect(() => {
    animate();
  }, [progress]);
  
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
    setProgress((i/GALLERY_IMAGES.length) * 100 + 10);
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

  return (
    <section id="gallery" className="section bg-gray-50">
      <div className="container">
        <SectionTitle 
          title="Gallery" 
          subtitle="A glimpse of the breathtaking sights and experiences awaiting you in Sri Lanka" 
        />
        
        <div 
          ref={carouselRef}
          className="gallery-carousel relative mt-12 overflow-hidden h-[70vh] user-select-none"
          style={{ 
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
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
              <div 
                key={image.id}
                ref={el => itemsRef.current[index] = el}
                className="carousel-item absolute rounded-lg overflow-hidden cursor-pointer"
                style={{
                  zIndex,
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
              </div>
            );
          })}
          
          {/* Layout box with decorative elements */}
          <div className="layout absolute z-0 inset-0 pointer-events-none">
            <div className="box absolute bottom-8 left-8 text-white transform-origin-top-left -rotate-90 text-sm uppercase opacity-40 leading-tight">
              High-end, authentic<br />visual experiences<br />of beautiful Sri Lanka.
            </div>
          </div>
          
          {/* Custom cursor */}
          <div 
            className="cursor fixed rounded-full border border-white/20 pointer-events-none hidden md:block"
            style={{
              width: '40px',
              height: '40px',
              top: cursorPos.y,
              left: cursorPos.x,
              marginLeft: '-20px',
              marginTop: '-20px',
              transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
              transition: 'transform 0.85s cubic-bezier(0, 0.02, 0, 1)',
              zIndex: 1000
            }}
          ></div>
          <div 
            className="cursor cursor2 fixed rounded-full pointer-events-none hidden md:block"
            style={{
              width: '2px',
              height: '2px',
              top: cursorPos.y,
              left: cursorPos.x,
              marginLeft: '-1px',
              marginTop: '-1px',
              transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
              transition: 'transform 0.7s cubic-bezier(0, 0.02, 0, 1)',
              background: 'white',
              zIndex: 1000
            }}
          ></div>
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            These are just a few highlights from our gallery. Visit our full gallery to see more stunning images from across Sri Lanka.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleViewFullGallery}
          >
            View Full Gallery
          </Button>
        </motion.div>
      </div>
      
      {/* Necessary CSS for the carousel */}
      <style jsx>{`
        .gallery-carousel {
          background: linear-gradient(135deg, rgba(10, 76, 140, 0.05), rgba(10, 76, 140, 0.2));
          border-radius: 20px;
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

export default ImmersiveGallery;