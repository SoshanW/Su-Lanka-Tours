// Button.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/helpers';

/**
 * Button Component
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'outline', 'text')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {boolean} props.isFullWidth - Whether button should be full width
 * @param {React.ReactNode} props.children - Button label/content
 * @param {string} props.to - If provided, button will be a Link
 * @param {string} props.href - If provided, button will be an anchor
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  children,
  className = '',
  to,
  href,
  ...props
}) => {
  // Configure button styling based on variant and size
  const baseStyle = 'inline-flex items-center justify-center font-medium transition-colors duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-primary hover:bg-primary/90 text-white focus:ring-primary/50',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white focus:ring-secondary/50',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary/30',
    text: 'text-primary hover:bg-primary/10 focus:ring-primary/30',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  const fullWidthStyle = isFullWidth ? 'w-full' : '';
  
  const buttonClasses = cn(
    baseStyle,
    variantStyles[variant],
    sizeStyles[size],
    fullWidthStyle,
    className
  );
  
  // Render as Link, anchor, or button based on props
  if (to) {
    return (
      <Link to={to} className={buttonClasses} {...props}>
        {children}
      </Link>
    );
  }
  
  if (href) {
    return (
      <a href={href} className={buttonClasses} {...props}>
        {children}
      </a>
    );
  }
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;