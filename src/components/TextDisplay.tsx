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

  // Predefined position classes for 20 elements
  const positions = [
    // Center
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    
    // Top row
    "absolute top-[15%] left-[15%] -translate-x-1/2 -translate-y-1/2",
    "absolute top-[15%] left-[35%] -translate-x-1/2 -translate-y-1/2",
    "absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2",
    "absolute top-[15%] left-[65%] -translate-x-1/2 -translate-y-1/2",
    "absolute top-[15%] left-[85%] -translate-x-1/2 -translate-y-1/2",
    
    // Second row
    "absolute top-[35%] left-[20%] -translate-x-1/2 -translate-y-1/2",
    "absolute top-[35%] left-[40%] -translate-x-1/2 -translate-y-1/2",
    "absolute top-[35%] left-[60%] -translate-x-1/2 -translate-y-1/2",
    "absolute top-[35%] left-[80%] -translate-x-1/2 -translate-y-1/2",
    
    // Third row
    "absolute top-[65%] left-[25%] -translate-x-1/2 -translate-y-1/2",
    "absolute top-[65%] left-[50%] -translate-x-1/2 -translate-y-1/2",
    "absolute top-[65%] left-[75%] -translate-x-1/2 -translate-y-1/2",
    
    // Bottom row
    "absolute top-[85%] left-[15%] -translate-x-1/2 -translate-y-1/2",
    "absolute top-[85%] left-[35%] -translate-x-1/2 -translate-y-1/2",
    "absolute top-[85%] left-1/2 -translate-x-1/2 -translate-y-1/2",
    "absolute top-[85%] left-[65%] -translate-x-1/2 -translate-y-1/2",
    "absolute top-[85%] left-[85%] -translate-x-1/2 -translate-y-1/2",
    
    // Extra positions for corners
    "absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2",
    "absolute top-[75%] left-[75%] -translate-x-1/2 -translate-y-1/2"
  ];

  // Generate 20 text elements
  const textElements = Array.from({ length: 20 }, (_, index) => {
    const effectClass = getEffectClass(effect);
    
    // Adjust font size for mobile
    let sizePx = typeof fontSize === 'string' ? parseInt(fontSize) : fontSize;
    
    // For mobile, reduce size by 15% but ensure minimum of 14px
    if (isMobile) {
      sizePx = Math.max(Math.floor(sizePx * 0.85), 14);
    }
    
    const baseTextStyle = getTextStyle(color, sizePx, fontFamily, spacing);
    
    // Apply formatting classes
    const formattingClasses = [
      isBold ? 'font-bold' : '',
      isItalic ? 'italic' : '',
      isStrikethrough ? 'line-through' : '',
    ].filter(Boolean).join(' ');

    // Position based on predefined array
    const position = positions[index % positions.length];
    
    // Create more dramatic size variation between instances
    // Define specific indices that will have larger sizes for visual focus
    const largeIndices = [0, 3, 11, 18]; // Center, top-right, middle, bottom
    const mediumIndices = [1, 7, 13, 16]; // Evenly distributed secondary focus
    
    let sizeMultiplier;
    if (largeIndices.includes(index)) {
      // Large focal points (120-150% of original size)
      sizeMultiplier = 1.2 + (index % 4) * 0.1;
    } else if (mediumIndices.includes(index)) {
      // Medium elements (90-110% of original size)
      sizeMultiplier = 0.9 + (index % 3) * 0.1;
    } else {
      // Smaller background elements (50-85% of original size)
      sizeMultiplier = 0.5 + (index % 8) * 0.05;
    }
    
    const adjustedTextStyle = {
      ...baseTextStyle,
      fontSize: `${parseInt(baseTextStyle.fontSize as string) * sizeMultiplier}px`
    };
    
    // Create unique animation properties for each position
    const floatingAnimation = {
      // Create a more complex multi-point path instead of just start-to-end
      y: [0, ((index % 3) - 1) * 12, ((index % 2) - 0.5) * 15, ((index % 3) - 1) * 10, 0],  
      x: [0, ((index % 4) - 1.5) * 10, ((index % 5) - 2) * 12, ((index % 3) - 1) * 8, 0]
    };
    
    // Different durations for each instance - increase overall duration to make movement smoother
    const duration = 6 + (index % 7);
    
    // Slightly offset each animation
    const delay = index * 0.3;

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
          className={`effect-text ${effectClass} ${formattingClasses} max-w-[50vw] md:max-w-[30vw] whitespace-nowrap overflow-hidden text-ellipsis text-center`}
          style={adjustedTextStyle}
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