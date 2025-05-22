/**
 * Smooth scroll to an element
 * @param {string} elementId - The ID of the element to scroll to
 */
export const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Account for header height
        behavior: 'smooth',
      });
    }
  };
  
  /**
   * Format a date to a readable string
   * @param {Date} date - The date to format
   * @returns {string} Formatted date string
   */
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  /**
   * Truncate text to a certain length with ellipsis
   * @param {string} text - The text to truncate
   * @param {number} length - Maximum length before truncation
   * @returns {string} Truncated text
   */
  export const truncateText = (text, length = 100) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
  };
  
  /**
   * Check if an element is in viewport
   * @param {HTMLElement} element - The element to check
   * @param {number} offset - Optional offset
   * @returns {boolean} Whether the element is in viewport
   */
  export const isInViewport = (element, offset = 0) => {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.bottom >= 0
    );
  };
  
  /**
   * Debounce function for performance optimization
   * @param {Function} func - The function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait = 100) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // helpers.js - add this function to the existing helpers.js file

/**
 * Conditionally join classNames together
 * @param {string} classes - Class names to join
 * @returns {string} Joined class names
 */
export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };