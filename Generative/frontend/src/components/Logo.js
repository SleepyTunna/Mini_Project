import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Logo = ({ size = 'default', showText = true, animated = true }) => {
  const { isDarkMode } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [glowEffect, setGlowEffect] = useState(false);

  // Size variants
  const sizeClasses = {
    small: {
      container: 'w-8 h-8',
      text: 'text-lg',
      icon: 'text-sm'
    },
    default: {
      container: 'w-10 h-10',
      text: 'text-xl',
      icon: 'text-base'
    },
    large: {
      container: 'w-16 h-16',
      text: 'text-3xl',
      icon: 'text-xl'
    },
    hero: {
      container: 'w-20 h-20',
      text: 'text-4xl',
      icon: 'text-2xl'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.default;

  // Periodic glow effect
  useEffect(() => {
    if (animated) {
      const glowInterval = setInterval(() => {
        setGlowEffect(true);
        setTimeout(() => setGlowEffect(false), 1000);
      }, 5000);

      return () => clearInterval(glowInterval);
    }
  }, [animated]);

  // Loading animation on click
  const handleClick = (e) => {
    if (animated) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  // Dynamic gradient based on theme and state
  const getGradientClasses = () => {
    if (isLoading) {
      return 'from-gray-400 to-gray-600 animate-pulse';
    }
    
    if (isDarkMode) {
      if (isHovered || glowEffect) {
        return 'from-indigo-400 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/50';
      }
      return 'from-indigo-500 to-purple-600';
    } else {
      if (isHovered || glowEffect) {
        return 'from-indigo-600 via-purple-600 to-pink-600 shadow-lg shadow-indigo-500/30';
      }
      return 'from-indigo-600 to-purple-600';
    }
  };

  // Icon rotation animation
  const getIconClasses = () => {
    let classes = `fas fa-rocket text-white transition-all duration-500 ${currentSize.icon}`;
    
    if (isLoading) {
      classes += ' animate-spin';
    } else if (isHovered && animated) {
      classes += ' transform rotate-12 scale-110';
    } else if (glowEffect && animated) {
      classes += ' animate-bounce';
    }
    
    return classes;
  };

  // Text animation classes
  const getTextClasses = () => {
    let classes = `font-bold transition-all duration-300 ${currentSize.text} ${
      isDarkMode ? 'text-white' : 'text-gray-800'
    }`;
    
    if (isHovered && animated) {
      classes += ' transform scale-105';
    }
    
    return classes;
  };

  // Brand text with gradient effect
  const getBrandSpanClasses = () => {
    let classes = 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-extrabold';
    
    if (isHovered && animated) {
      classes += ' animate-pulse';
    }
    
    return classes;
  };

  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Logo Icon Container */}
      <div 
        className={`
          ${currentSize.container} 
          bg-gradient-to-r 
          ${getGradientClasses()}
          rounded-lg 
          flex 
          items-center 
          justify-center 
          transition-all 
          duration-500 
          transform
          ${isHovered && animated ? 'rotate-6 scale-110' : ''}
          ${glowEffect && animated ? 'animate-pulse' : ''}
          relative
          overflow-hidden
        `}
      >
        {/* Background shine effect */}
        {animated && (
          <div 
            className={`
              absolute inset-0 
              bg-gradient-to-r 
              from-transparent 
              via-white/20 
              to-transparent 
              transform 
              -skew-x-12 
              transition-transform 
              duration-1000
              ${isHovered ? 'translate-x-full' : '-translate-x-full'}
            `}
          />
        )}
        
        {/* Arrow Icon */}
        <svg className={`text-white transition-all duration-500 ${currentSize.icon} ${isLoading ? 'animate-spin' : isHovered && animated ? 'transform rotate-12 scale-110' : glowEffect && animated ? 'animate-bounce' : ''}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
        </svg>
        
        {/* Loading spinner overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={getTextClasses()}>
            MARGDARSHAN
            <span className={getBrandSpanClasses()}></span>
          </span>
          
          {/* Tagline for larger sizes */}
          {(size === 'large' || size === 'hero') && (
            <span className={`
              text-xs 
              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} 
              font-medium 
              transition-opacity 
              duration-300
              ${isHovered ? 'opacity-100' : 'opacity-75'}
            `}>
              Your Career Guide
            </span>
          )}
        </div>
      )}

      {/* Floating particles effect for hero size */}
      {size === 'hero' && animated && (
        <div className="absolute -top-2 -right-2 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute 
                w-1 
                h-1 
                bg-indigo-400 
                rounded-full 
                animate-ping
                ${i === 0 ? 'top-0 right-0 animation-delay-0' : ''}
                ${i === 1 ? 'top-1 right-2 animation-delay-200' : ''}
                ${i === 2 ? 'top-2 right-1 animation-delay-400' : ''}
              `}
              style={{
                animationDelay: `${i * 200}ms`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
    </Link>
  );
};

export default Logo;