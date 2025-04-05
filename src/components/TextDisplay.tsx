'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

  // Update container size for animation bounds
  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setContainerSize({ width: offsetWidth, height: offsetHeight });

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []); // Only run once on mount

  // Generate animated text elements
  const textElements = Array.from({ length: repeat }, (_, index) => {
    const effectClass = getEffectClass(effect);
    const baseTextStyle = getTextStyle(color, fontSize, fontFamily, spacing);
    
    // Random percentage position (0% to 100%)
    const getRandomPercent = () => Math.random() * 100;
    const duration = 5 + Math.random() * 10; // Random duration between 5 and 15 seconds
    
    // --- Perspective Scaling Logic ---
    const calculateScale = (topPercent: number, leftPercent: number): number => {
      const maxDistance = Math.sqrt(50**2 + 50**2); // Max distance from center (50,50) to corner (0,0 or 100,100)
      const distanceX = Math.abs(leftPercent - 50);
      const distanceY = Math.abs(topPercent - 50);
      const distance = Math.sqrt(distanceX**2 + distanceY**2);
      
      // Map distance to scale (closer = bigger, farther = smaller)
      const minScale = 0.3; // Reduced minimum scale
      const maxScale = 2.0; // Increased maximum scale
      const normalizedDistance = Math.min(distance / maxDistance, 1);
      const scale = maxScale - normalizedDistance * (maxScale - minScale);
      
      return scale;
    };

    const initialTop = getRandomPercent();
    const initialLeft = getRandomPercent();
    const targetTop = getRandomPercent();
    const targetLeft = getRandomPercent();
    const initialScale = calculateScale(initialTop, initialLeft);
    const targetScale = calculateScale(targetTop, targetLeft);
    // --- End Perspective Scaling Logic ---

    // --- Apply Formatting Classes --- 
    const formattingClasses = [
      isBold ? 'font-bold' : '',
      isItalic ? 'italic' : '',
      isStrikethrough ? 'line-through' : '',
    ].filter(Boolean).join(' ');
    // --- End Formatting Classes --- 

    return (
      <motion.span
        key={index}
        className={`effect-text ${effectClass} ${formattingClasses} absolute whitespace-nowrap`}
        // Apply base styles + transform to center the element on its top/left coordinate
        style={{ ...baseTextStyle, transform: 'translate(-50%, -50%)' }}
        initial={{
          top: `${initialTop}%`,
          left: `${initialLeft}%`,
          scale: initialScale,
        }}
        animate={{
          top: `${targetTop}%`,
          left: `${targetLeft}%`,
          scale: targetScale,
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.span>
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
        textElements
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 italic">
          {fullscreen ? 'Loading content...' : 'Enter some text to see the effect'}
        </div>
      )}
    </div>
  );
};

export default TextDisplay; 