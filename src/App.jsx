import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import IntroVideo from './components/IntroVideo';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FullGallery from './pages/FullGallery';
import Footer from './components/Footer';
import { useAppContext } from './contexts/AppContext';

function App() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isLoaded } = useAppContext();
  
  // Detect iOS and mobile devices
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    setIsIOS(iOS);
    setIsMobile(mobile);
    
    // Skip video on iOS and mobile devices
    if (iOS || mobile) {
      setVideoEnded(true);
      document.body.style.overflow = '';
    }
    
    console.log('Device detection:', { iOS, mobile });
  }, []);
  
  // Prevent scrolling during video (only for non-mobile devices)
  useEffect(() => {
    if (!isMobile && !videoEnded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [videoEnded, isMobile]);
  
  // Preload critical images
  useEffect(() => {
    const preloadImages = () => {
      const imagesToPreload = [
        '/images/hero-bg.jpg',
        '/images/logo.png',
        '/images/founder.jpg',
        '/images/attractions/sigiriya.jpg',
      ];
      
      imagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };
    
    preloadImages();
  }, []);

  return (
    <>
      <Helmet>
        <title>Su Lanka Tours | Discover the Pearl of the Indian Ocean</title>
        <meta name="description" content="Experience the beauty of Sri Lanka with Su Lanka Tours. Discover ancient temples, pristine beaches, wildlife, and more with our expert local guides." />
        
        {/* iOS-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Su Lanka Tours" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Performance optimization for mobile */}
        {isMobile && (
          <>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="HandheldFriendly" content="true" />
          </>
        )}
      </Helmet>
      
      {/* Only show intro video on non-mobile devices */}
      {!videoEnded && !isMobile && (
        <IntroVideo onVideoEnd={() => setVideoEnded(true)} />
      )}
      
      <div 
        className={`app-container ${isIOS ? 'ios-mode' : ''} ${isMobile ? 'mobile-mode' : ''} ${videoEnded && isLoaded ? 'opacity-100' : 'opacity-0'}`} 
        style={{ 
          transition: isIOS ? 'opacity 0.3s ease-in-out' : 'opacity 1s ease-in-out',
          minHeight: '100vh'
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<FullGallery />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;