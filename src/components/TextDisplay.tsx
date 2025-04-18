'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TextConfig, Effect } from '../types';
import { getEffectClass, getTextStyle } from '../utils/effects';

interface TextDisplayProps {
  config: Omit<TextConfig, 'effect'> & { effect: Effect | null };
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
    // Formatting flags
    isBold,
    isItalic,
    isStrikethrough,
  } = config;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [randomSeed, setRandomSeed] = useState(0);

  // Update random seed when text changes to create new starting positions
  useEffect(() => {
    // Only set the random seed on the client side to prevent hydration mismatch
    setRandomSeed(Date.now());
  }, [text]);

  // Update container size and detect mobile screens
  useEffect(() => {
    // Exit early on server side to avoid hydration mismatch
    if (typeof window === 'undefined') return;
    
    // Initial check for mobile screen
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Standard mobile breakpoint
    };
    
    // Only run this code on the client side
    checkMobile(); // Check on mount
    
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setContainerSize({ width: offsetWidth, height: offsetHeight });

      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
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

  // Calculate the number of instances based on device type
  const instanceCount = isMobile ? 20 : 30;

  // Generate text elements (30 for desktop, 20 for mobile)
  const textElements = Array.from({ length: instanceCount }, (_, index) => {
    // Get effect class only if effect is not null
    const effectClass = effect ? getEffectClass(effect) : '';
    
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
    
    // Calculate size multiplier based on the index category
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
    
    // Apply size multiplier but ensure we stay within our min/max bounds
    const rawFontSize = parseInt(baseTextStyle.fontSize as string) * sizeMultiplier;
    // Use a lower maximum (30px) on mobile devices
    const maxFontSize = isMobile ? 35 : 50;
    const clampedFontSize = Math.min(Math.max(rawFontSize, 14), maxFontSize);
    
    const adjustedTextStyle = {
      ...baseTextStyle,
      fontSize: `${clampedFontSize}px`
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
    
    // Generate random starting positions for each instance
    const getStartPosition = () => {
      // Use index and randomSeed to generate a pseudo-random number
      // This ensures each instance gets a different position
      // but positions remain stable during animations
      const rng = () => {
        // Simple seeded random using the randomSeed and instance index
        return ((Math.sin(randomSeed + index * 100) + 1) / 2);
      };
      
      // Create random positions between 15% and 85% for both axes
      const startLeft = 15 + rng() * 70; // Random between 15% and 85%
      const startTop = 15 + ((rng() * 7919) % 1) * 70; // Different random pattern for vertical
      
      return { startLeft, startTop };
    };
    
    // Get starting position for this instance
    const { startLeft, startTop } = getStartPosition();
    
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
    
    // Calculate scale bounds to ensure font size stays between 14px and maxFontSize during animation
    const baseFontSize = parseInt(baseTextStyle.fontSize as string);
    
    // How much can we scale down before hitting the minimum font size?
    const minScaleFactor = Math.max(14 / (baseFontSize * baseScale), 0.5);
    
    // How much can we scale up before hitting the maximum font size?
    const maxScaleFactor = Math.min(maxFontSize / (baseFontSize * baseScale), 1.8);
    
    // Create scale animations that sync with movement paths
    const scaleMin = baseScale * Math.max(0.7, minScaleFactor);
    const scaleMax = baseScale * Math.min(1.5, maxScaleFactor);
    
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

    // Apply effect class only if effect is present
    const appliedEffectClass = effect ? effectClass : '';

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
          className={`effect-text ${appliedEffectClass} ${formattingClasses} text-center whitespace-nowrap`}
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
    
  // Check if we're on the client side to avoid hydration mismatches
  const isClient = typeof window !== 'undefined';

  return (
    <div 
      ref={containerRef} 
      className={`${baseClasses} ${conditionalClasses}`}
    >
      {isClient && text && containerSize.width > 0 ? (
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