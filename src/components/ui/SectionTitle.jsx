// SectionTitle.jsx
import React from 'react';
import { TextReveal } from '../../animations/textAnimation';
import { FadeIn } from '../../animations/fadeIn';

/**
 * SectionTitle Component
 * @param {Object} props - Component props
 * @param {string} props.title - Main title text
 * @param {string} props.subtitle - Subtitle text
 * @param {string} props.align - Text alignment ('left', 'center', 'right')
 * @param {string} props.color - Text color ('dark', 'light')
 */
const SectionTitle = ({
  title,
  subtitle,
  align = 'center',
  color = 'dark',
  className = '',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  const colorClasses = {
    dark: 'text-dark',
    light: 'text-white',
    primary: 'text-primary',
  };
  
  const subtitleColorClasses = {
    dark: 'text-gray-600',
    light: 'text-gray-300',
    primary: 'text-primary/80',
  };
  
  return (
    <div className={`mb-12 ${alignmentClasses[align]} ${className}`}>
      <TextReveal 
        text={
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${colorClasses[color]}`}>
            {title}
          </h2>
        }
      />
      
      {subtitle && (
        <FadeIn delay={0.2}>
          <p className={`mt-4 text-lg max-w-3xl mx-auto ${subtitleColorClasses[color]}`}>
            {subtitle}
          </p>
        </FadeIn>
      )}
      
      <div className={`mt-6 flex ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
        <div className={`h-1 w-20 bg-secondary rounded`}></div>
      </div>
    </div>
  );
};

export default SectionTitle;