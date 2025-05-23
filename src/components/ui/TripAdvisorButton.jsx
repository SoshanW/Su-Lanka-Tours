import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TripAdvisorButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      
      setIsIOS(iOS);
      setIsMobile(mobile);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Show button when page is scrolled up to given distance
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handle TripAdvisor link click
  const handleTripAdvisorClick = (e) => {
    e.preventDefault();
    window.open('https://www.tripadvisor.com/Attraction_Review-g293962-d11639139-Reviews-Su_Lanka_Tours-Colombo_Western_Province.html', '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-5 z-50"
        >
          <div className="flex flex-col items-center space-y-2">
            {/* Sonar Effect Container */}
            <div className="relative">
              {/* Sonar Wave */}
              <motion.div
                className="absolute inset-0 rounded-full bg-[#34E0A1]"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: [1, 1.7],
                  opacity: [0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              {/* TripAdvisor Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 4px 12px rgba(52, 224, 161, 0.3)',
                    '0 4px 20px rgba(52, 224, 161, 0.5)',
                    '0 4px 12px rgba(52, 224, 161, 0.3)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                onClick={handleTripAdvisorClick}
                className="relative bg-[#34E0A1] hover:bg-[#2ECB8F] text-white rounded-full p-2.5 shadow-lg transition-all duration-300"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
              >
                <svg 
                  className="w-7 h-7" 
                  viewBox="0 0 1333.31 1333.31" 
                  shapeRendering="geometricPrecision" 
                  textRendering="geometricPrecision" 
                  imageRendering="optimizeQuality" 
                  fillRule="evenodd" 
                  clipRule="evenodd"
                >
                  <g fillRule="nonzero">
                    <circle cx="666.66" cy="666.66" r="666.66" fill="#34e0a1"/>
                    <path d="M1078.42 536.6l80.45-87.52h-178.4c-89.31-61.01-197.17-96.54-313.81-96.54-116.5 0-224.06 35.61-313.22 96.54H174.6l80.44 87.52c-49.31 44.99-80.22 109.8-80.22 181.75 0 135.79 110.09 245.88 245.88 245.88 64.51 0 123.27-24.88 167.14-65.55l78.81 85.81 78.81-85.73c43.87 40.67 102.57 65.47 167.07 65.47 135.79 0 246.03-110.09 246.03-245.88.07-72.03-30.84-136.83-80.15-181.75zM420.77 884.75c-91.92 0-166.4-74.48-166.4-166.4s74.49-166.4 166.4-166.4c91.92 0 166.4 74.49 166.4 166.4 0 91.91-74.49 166.4-166.4 166.4zm245.96-171.24c0-109.5-79.63-203.5-184.73-243.65 56.84-23.76 119.18-36.94 184.66-36.94 65.47 0 127.89 13.18 184.73 36.94-105.02 40.23-184.65 134.15-184.65 243.65zm245.88 171.24c-91.92 0-166.4-74.48-166.4-166.4s74.49-166.4 166.4-166.4c91.92 0 166.4 74.49 166.4 166.4 0 91.91-74.49 166.4-166.4 166.4zm0-253.7c-48.2 0-87.23 39.03-87.23 87.23 0 48.19 39.03 87.22 87.23 87.22 48.19 0 87.22-39.03 87.22-87.22 0-48.12-39.03-87.23-87.22-87.23zM508 718.35c0 48.19-39.03 87.22-87.23 87.22-48.19 0-87.22-39.03-87.22-87.22 0-48.2 39.03-87.23 87.22-87.23 48.19-.07 87.23 39.03 87.23 87.23z" fill="black"/>
                  </g>
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TripAdvisorButton; 