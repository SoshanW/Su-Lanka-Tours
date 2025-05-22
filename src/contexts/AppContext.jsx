import React, { createContext, useContext, useState, useEffect } from 'react';

// Simple debounce function
const debounce = (func, wait = 100) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Set loaded state with a shorter timeout
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    // Debounced scroll handler for better performance
    const handleScroll = debounce(() => {
      setScrollY(window.scrollY);
      
      // Section detection
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          setActiveSection(section.getAttribute('id'));
        }
      });
    }, 50); // 50ms debounce
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const value = {
    isLoaded,
    activeSection,
    setActiveSection,
    scrollY,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};