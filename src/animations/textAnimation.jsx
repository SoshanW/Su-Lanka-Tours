import { motion } from 'framer-motion';
import anime from 'animejs/lib/anime.es.js';
import { useEffect, useRef } from 'react';

/**
 * AnimatedText component that splits text into characters or words for animation
 * @param {Object} props - Component props
 * @param {string} props.text - Text to animate
 * @param {string} props.type - Type of text splitting ('chars' or 'words')
 * @param {number} props.delay - Animation delay in seconds
 */
export const AnimatedText = ({
  text,
  type = 'chars',
  delay = 0,
  className = '',
  once = true,
  ...props
}) => {
  // Split text into characters or words
  const items = type === 'chars'
    ? text.split('')
    : text.split(' ');
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay * i,
      },
    }),
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };
  
  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      {...props}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          className={type === 'chars' ? 'inline-block' : 'inline-block mr-1'}
        >
          {item === ' ' ? '\u00A0' : item}
        </motion.span>
      ))}
    </motion.div>
  );
};

/**
 * TextReveal component that reveals text with a sliding animation
 * @param {Object} props - Component props
 * @param {string} props.text - Text to animate
 * @param {number} props.delay - Animation delay in seconds
 */
export const TextReveal = ({
  text,
  delay = 0,
  className = '',
  ...props
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: 0.08,
      },
    },
  };
  
  const childVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };
  
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      {...props}
    >
      <motion.div variants={childVariants}>
        {text}
      </motion.div>
    </motion.div>
  );
};

/**
 * TypewriterText component using AnimeJS
 * @param {Object} props - Component props
 * @param {string} props.text - Text to animate
 * @param {number} props.delay - Animation delay in seconds
 */
export const TypewriterText = ({
  text,
  delay = 0,
  speed = 50,
  className = '',
  ...props
}) => {
  const textRef = useRef(null);
  
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    
    // Create a wrapper with a cursor
    el.innerHTML = `<span class="typewriter-text"></span><span class="typewriter-cursor">|</span>`;
    const textElement = el.querySelector('.typewriter-text');
    const cursorElement = el.querySelector('.typewriter-cursor');
    
    // Set up the typewriter animation
    const typewriter = {
      text: '',
      index: 0,
      speed: speed,
      init: function() {
        this.typing();
      },
      typing: function() {
        if (this.index < text.length) {
          this.text += text.charAt(this.index);
          textElement.textContent = this.text;
          this.index++;
          setTimeout(() => this.typing(), this.speed);
        } else {
          // Animation for cursor after typing is complete
          anime({
            targets: cursorElement,
            opacity: [1, 0],
            duration: 800,
            easing: 'easeInOutQuad',
            loop: true
          });
        }
      }
    };
    
    // Start after delay
    setTimeout(() => typewriter.init(), delay * 1000);
    
    return () => {
      // Clean up any running animations
    };
  }, [text, delay, speed]);
  
  return (
    <div 
      ref={textRef} 
      className={className}
      {...props}
    ></div>
  );
};

export default {
  AnimatedText,
  TextReveal,
  TypewriterText
};