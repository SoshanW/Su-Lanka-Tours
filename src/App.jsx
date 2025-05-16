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
  const { isLoaded } = useAppContext();
  
  // Prevent scrolling during video and preload key images
  useEffect(() => {
    // Lock scrolling when video is playing
    if (!videoEnded) {
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when video ends
      document.body.style.overflow = '';
    }
    
    // Pre-load key images for better performance after video ends
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
    
    // Call preload function
    preloadImages();
    
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [videoEnded]);

  return (
    <>
      <Helmet>
        <title>Su Lanka Tours | Discover the Pearl of the Indian Ocean</title>
        <meta name="description" content="Experience the beauty of Sri Lanka with Su Lanka Tours. Discover ancient temples, pristine beaches, wildlife, and more with our expert local guides." />
      </Helmet>
      
      {!videoEnded && <IntroVideo onVideoEnd={() => setVideoEnded(true)} />}
      
      <div className={`app-container ${videoEnded && isLoaded ? 'opacity-100' : 'opacity-0'}`} 
        style={{ transition: 'opacity 1s ease-in-out' }}>
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