// AnimatedText.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedText as AnimatedTextCore, TextReveal, TypewriterText } from '../../animations/textAnimation';

/**
 * AnimatedText Component
 * @param {Object} props - Component props
 * @param {string} props.text - Text to animate
 * @param {string} props.animation - Animation type ('chars', 'words', 'reveal', 'typewriter')
 * @param {string} props.element - HTML element to render ('h1', 'h2', 'p', etc.)
 * @param {number} props.delay - Animation delay in seconds
 */
const AnimatedText = ({
  text,
  animation = 'chars',
  element = 'div',
  delay = 0,
  className = '',
  ...props
}) => {
  // Get the appropriate animation component based on animation type
  const renderAnimatedText = () => {
    switch (animation) {
      case 'chars':
      case 'words':
        return (
          <AnimatedTextCore
            text={text}
            type={animation}
            delay={delay}
            className={className}
            {...props}
          />
        );
      case 'reveal':
        return (
          <TextReveal
            text={text}
            delay={delay}
            className={className}
            {...props}
          />
        );
      case 'typewriter':
        return (
          <TypewriterText
            text={text}
            delay={delay}
            className={className}
            {...props}
          />
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className={className}
          >
            {text}
          </motion.div>
        );
    }
  };
  
  // Render the animated text with the specified HTML element
  const CustomTag = element;
  
  return (
    <CustomTag className={className}>
      {renderAnimatedText()}
    </CustomTag>
  );
};

export default AnimatedText;