'use client';

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
  const { text, effect, color, fontSize, fontFamily, spacing, repeat } = config;

  // Generate repeated text elements
  const textElements = Array.from({ length: repeat }, (_, index) => {
    const effectClass = getEffectClass(effect);
    const textStyle = getTextStyle(color, fontSize, fontFamily, spacing);
    
    return (
      <span
        key={index}
        className={`effect-text ${effectClass}`}
        style={textStyle}
      >
        {text}
      </span>
    );
  });

  return (
    <div 
      className={`
        flex flex-wrap justify-center items-center gap-4 p-4
        ${fullscreen ? 'fixed inset-0 bg-white overflow-auto z-10' : 'relative min-h-40 border border-gray-200 rounded-md'}
      `}
    >
      {text ? (
        textElements
      ) : (
        <div className="text-gray-400 italic">Enter some text to see the effect</div>
      )}
    </div>
  );
};

export default TextDisplay; 