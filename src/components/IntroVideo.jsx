import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import anime from 'animejs/lib/anime.es.js';

const IntroVideo = ({ onVideoEnd }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVideoEnding, setIsVideoEnding] = useState(false);
  const [isVideoComplete, setIsVideoComplete] = useState(false);
  
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) return;
    
    // Start video playback when component mounts
    videoElement.play().catch(error => {
      console.error('Video playback failed:', error);
    });
    
    // Event listener for when the video is near its end
    const handleTimeUpdate = () => {
      // Start fade out animation when video is 80% complete
      if (videoElement.currentTime > (videoElement.duration * 0.8) && !isVideoEnding) {
        setIsVideoEnding(true);
      }
    };
    
    // Event listener for when the video ends
    const handleVideoEnd = () => {
      setIsVideoComplete(true);
      // Let App component know that the video has ended
      onVideoEnd && onVideoEnd();
    };
    
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleVideoEnd);
    
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, [onVideoEnd, isVideoEnding]);
  
  // Handle fade out animation when video is ending
  useEffect(() => {
    if (isVideoEnding && containerRef.current) {
      // Create the fade out animation using Anime.js
      anime({
        targets: containerRef.current,
        opacity: [1, 0],
        duration: 1500,
        easing: 'easeInOutQuad',
        complete: () => {
          setIsVideoComplete(true);
          onVideoEnd && onVideoEnd();
        }
      });
    }
  }, [isVideoEnding, onVideoEnd]);
  
  return (
    <AnimatePresence>
      {!isVideoComplete && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 w-full h-full bg-black z-50 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              className="absolute w-full h-full object-cover"
              src="/videos/intro-video.mp4"
              muted
              playsInline
              preload="auto"
            ></video>
            
            {/* Overlay with logo that fades in at the end */}
            {isVideoEnding && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <img src="/images/logo.png" alt="Su Lanka Tours" className="w-48 md:w-64" />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroVideo;