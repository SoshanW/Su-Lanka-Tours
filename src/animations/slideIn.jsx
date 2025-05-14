// slideIn.js
import { motion } from 'framer-motion';

/**
 * SlideIn animation component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.direction - Animation direction ('left', 'right', 'up', 'down')
 * @param {number} props.delay - Animation delay in seconds
 * @param {boolean} props.staggerChildren - Whether to stagger children animations
 */
export const SlideIn = ({
  children,
  direction = 'right',
  delay = 0,
  staggerChildren = false,
  className = '',
  ...props
}) => {
  // Generate initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'left':
        return { x: '-100%', opacity: 0 };
      case 'right':
        return { x: '100%', opacity: 0 };
      case 'up':
        return { y: '100%', opacity: 0 };
      case 'down':
        return { y: '-100%', opacity: 0 };
      default:
        return { x: '100%', opacity: 0 };
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: getInitialPosition(),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 100,
        delay: delay,
        when: 'beforeChildren',
        staggerChildren: staggerChildren ? 0.1 : 0,
      },
    },
  };
  
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Child item variant for staggered animations
export const SlideInItem = ({ children, className = '', ...props }) => {
  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 100,
      },
    },
  };
  
  return (
    <motion.div
      className={className}
      variants={itemVariant}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;