// AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Wait for initial load
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    // Handle scroll for animations and active section
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check which section is in view
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          setActiveSection(section.getAttribute('id'));
        }
      });
    };
    
    // Initialize scroll observer for fade-in animations
    const initScrollObserver = () => {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      // Observe all elements with animation classes
      const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
      animatedElements.forEach(element => observer.observe(element));
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initialize animations after a slight delay to ensure DOM is ready
    setTimeout(() => {
      initScrollObserver();
    }, 1000);
    
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