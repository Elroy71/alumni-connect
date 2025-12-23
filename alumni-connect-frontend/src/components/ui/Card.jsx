import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  glass = false,
  gradient = false,
  padding = 'md',
  onClick 
}) => {
  
  const baseStyles = 'rounded-2xl transition-all duration-300';
  
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const hoverStyles = hover ? 'cursor-pointer hover:scale-105 hover:shadow-glow' : '';
  const glassStyles = glass ? 'glass' : 'bg-white shadow-lg border border-dark-100';
  const gradientStyles = gradient ? 'bg-gradient-primary text-white' : '';
  
  const cardClasses = `${baseStyles} ${paddingStyles[padding]} ${hoverStyles} ${glass ? glassStyles : gradient ? gradientStyles : glassStyles} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;