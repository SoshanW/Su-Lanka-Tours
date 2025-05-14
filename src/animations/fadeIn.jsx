// fadeIn.js
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';

/**
 * FadeIn animation component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.direction - Animation direction ('up', 'down', 'left', 'right')
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.duration - Animation duration in seconds
 */
export const FadeIn = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.5,
  className = '',
  ...props 
}) => {
  const controls = useAnimation();
  const ref = useInView({ 
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // Generate transition values based on direction
  const getDirectionValues = () => {
    switch (direction) {
      case 'up':
        return { y: 40, opacity: 0 };
      case 'down':
        return { y: -40, opacity: 0 };
      case 'left':
        return { x: 40, opacity: 0 };
      case 'right':
        return { x: -40, opacity: 0 };
      default:
        return { y: 40, opacity: 0 };
    }
  };
  
  const hidden = getDirectionValues();
  
  useEffect(() => {
    if (ref.inView) {
      controls.start({ 
        x: 0, 
        y: 0, 
        opacity: 1, 
        transition: { 
          duration: duration,
          delay: delay,
          ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for natural motion
        } 
      });
    }
  }, [controls, ref.inView, delay, duration]);
  
  return (
    <motion.div
      ref={ref.ref}
      initial={hidden}
      animate={controls}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;