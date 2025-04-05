'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextConfig } from '../types';
import { getEffectClass, getTextStyle } from '../utils/effects';

interface TextDisplayProps {
  config: TextConfig;
  fullscreen?: boolean;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ 
  config,
  fullscreen = false
}) => {
  const {
    text, 
    effect, 
    color, 
    fontSize, 
    fontFamily, 
    spacing, 
    repeat,
    // Formatting flags
    isBold,
    isItalic,
    isStrikethrough,
  } = config;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Update container size and detect mobile screens
  useEffect(() => {
    // Initial check for mobile screen
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Standard mobile breakpoint
    };
    
    checkMobile(); // Check on mount
    
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setContainerSize({ width: offsetWidth, height: offsetHeight });

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
        }
        checkMobile(); // Also check mobile on resize
      });
      
      resizeObserver.observe(containerRef.current);
      
      // Add window resize listener as a backup
      window.addEventListener('resize', checkMobile);
      
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, []); // Only run once on mount

  // Generate 9 equally distributed text elements
  const textElements = Array.from({ length: 9 }, (_, index) => {
    const effectClass = getEffectClass(effect);
    
    // Adjust font size for mobile
    let sizePx = typeof fontSize === 'string' ? parseInt(fontSize) : fontSize;
    
    // For mobile, reduce size by 40% but ensure minimum of 10px
    if (isMobile) {
      sizePx = Math.max(Math.floor(sizePx * 0.6), 10);
    }
    
    const baseTextStyle = getTextStyle(color, sizePx, fontFamily, spacing);
    
    // Apply formatting classes
    const formattingClasses = [
      isBold ? 'font-bold' : '',
      isItalic ? 'italic' : '',
      isStrikethrough ? 'line-through' : '',
    ].filter(Boolean).join(' ');

    // Position each element
    let position;
    
    // Determine the position for each index
    // 0: center
    // 1: top-left, 2: top-center, 3: top-right
    // 4: middle-left, 5: middle-right
    // 6: bottom-left, 7: bottom-center, 8: bottom-right
    switch (index) {
      case 0: // Center
        position = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
        break;
      case 1: // Top-left
        position = "absolute top-[20%] left-[20%] transform -translate-x-1/2 -translate-y-1/2";
        break;
      case 2: // Top-center
        position = "absolute top-[20%] left-1/2 transform -translate-x-1/2 -translate-y-1/2";
        break;
      case 3: // Top-right
        position = "absolute top-[20%] right-[20%] transform translate-x-1/2 -translate-y-1/2";
        break;
      case 4: // Middle-left
        position = "absolute top-1/2 left-[20%] transform -translate-x-1/2 -translate-y-1/2";
        break;
      case 5: // Middle-right
        position = "absolute top-1/2 right-[20%] transform translate-x-1/2 -translate-y-1/2";
        break;
      case 6: // Bottom-left
        position = "absolute bottom-[20%] left-[20%] transform -translate-x-1/2 translate-y-1/2";
        break;
      case 7: // Bottom-center
        position = "absolute bottom-[20%] left-1/2 transform -translate-x-1/2 translate-y-1/2";
        break;
      case 8: // Bottom-right
        position = "absolute bottom-[20%] right-[20%] transform translate-x-1/2 translate-y-1/2";
        break;
      default:
        position = "";
    }
    
    // Create unique animation properties for each position
    // Using different ranges for x/y and different durations for more natural motion
    const floatingAnimation = {
      y: [0, index % 3 === 0 ? -10 : (index % 3 === 1 ? 8 : -6)],
      x: [0, index % 3 === 0 ? 5 : (index % 3 === 1 ? -8 : 6)]
    };
    
    // Different durations for each instance based on position
    const duration = 4 + (index * 0.5);
    
    // Slightly offset each animation
    const delay = index * 0.2;

    return (
      <motion.div 
        key={index}
        className={position}
        animate={floatingAnimation}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: duration,
          delay: delay,
          ease: "easeInOut"
        }}
      >
        <div
          className={`effect-text ${effectClass} ${formattingClasses} max-w-[80vw] overflow-hidden text-ellipsis text-center`}
          style={baseTextStyle}
        >
          {text}
        </div>
      </motion.div>
    );
  });

  // Base classes for the container
  const baseClasses = "relative overflow-hidden";

  // Conditional classes based on fullscreen prop
  const conditionalClasses = fullscreen 
    ? "w-full h-full" // Fill parent
    : "min-h-[300px] border border-gray-200 rounded-md bg-white"; // Non-fullscreen view

  return (
    <div 
      ref={containerRef} 
      className={`${baseClasses} ${conditionalClasses}`}
    >
      {text && containerSize.width > 0 ? (
        <>{textElements}</>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 italic">
          {fullscreen ? 'Loading content...' : 'Enter some text to see the effect'}
        </div>
      )}
    </div>
  );
};

export default TextDisplay; 