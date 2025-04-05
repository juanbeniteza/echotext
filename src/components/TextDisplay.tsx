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
    
    // Animation timing values
    const duration = 15 + (index % 10); // 15-24 seconds for full cycle
    const delay = index * 0.7; // Larger staggered delay
    
    // Movement patterns - much larger screen-wide movements
    // Instead of fixed positions with small animations, use center positioning 
    // with large animations covering the full screen
    
    // Define animation paths that cover large areas of the screen
    // Create random-like but distinct paths for each element
    // Using modulo operations to create variety based on index
    
    // Create custom path patterns based on element index
    let animationPath;
    
    // Distribute starting positions across the screen based on index
    const getStartPosition = (idx: number) => {
      // Create a grid of initial positions throughout the screen
      const row = Math.floor(idx / 5); // 0-3 for rows
      const col = idx % 5; // 0-4 for columns
      
      // Calculate percentages for initial positions
      const startLeft = 15 + (col * 17.5); // 15%, 32.5%, 50%, 67.5%, 85%
      const startTop = 15 + (row * 23.3); // 15%, 38.3%, 61.6%, 84.9%
      
      return { startLeft, startTop };
    };
    
    // Get starting position for this instance
    const { startLeft, startTop } = getStartPosition(index);
    
    // Calculate scaling values (based on index to create variety)
    // Base scale for each size category
    let baseScale = 1.0;
    if (largeIndices.includes(index)) {
      baseScale = 1.2;
    } else if (mediumIndices.includes(index)) {
      baseScale = 0.9;
    } else {
      baseScale = 0.7;
    }
    
    // Create scale animations that sync with movement paths
    const scaleMin = baseScale * 0.7; // Minimum scale is 70% of the base
    const scaleMax = baseScale * 1.5; // Maximum scale is 150% of the base
    
    // Switch between different motion patterns for variety
    switch (index % 5) {
      case 0: // Diagonal across screen with scaling
        animationPath = {
          left: [`${startLeft}%`, '85%', '15%', `${startLeft}%`],
          top: [`${startTop}%`, '85%', '15%', `${startTop}%`],
          scale: [baseScale, scaleMax, scaleMin, baseScale]
        };
        break;
      case 1: // Horizontal sweep with scaling
        animationPath = {
          left: [`${startLeft}%`, '90%', '10%', `${startLeft}%`],
          top: [`${startTop}%`, `${startTop}%`, `${startTop}%`, `${startTop}%`],
          scale: [baseScale, scaleMin, scaleMax, baseScale]
        };
        break;
      case 2: // Vertical sweep with scaling
        animationPath = {
          left: [`${startLeft}%`, `${startLeft}%`, `${startLeft}%`, `${startLeft}%`],
          top: [`${startTop}%`, '90%', '10%', `${startTop}%`],
          scale: [baseScale, scaleMax, scaleMin, baseScale]
        };
        break;
      case 3: // Circular/oval path with scaling
        animationPath = {
          left: [`${startLeft}%`, '85%', '50%', '15%', `${startLeft}%`],
          top: [`${startTop}%`, '50%', '85%', '50%', `${startTop}%`],
          scale: [baseScale, scaleMin, scaleMax, scaleMin, baseScale]
        };
        break;
      case 4: // Figure-8 pattern with scaling
        animationPath = {
          left: [`${startLeft}%`, '75%', '75%', '25%', `${startLeft}%`],
          top: [`${startTop}%`, '75%', '25%', '75%', `${startTop}%`],
          scale: [baseScale, scaleMax, scaleMin, scaleMax, baseScale]
        };
        break;
    }

    return (
      <motion.div 
        key={index}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        animate={animationPath}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: duration,
          delay: delay,
          ease: "easeInOut",
          times: [0, 0.5, 1], // Control timing of the motion path
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