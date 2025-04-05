'use client';

import { useState } from 'react';
import { useTextConfig } from '../hooks/useTextConfig';
import TextDisplay from '../components/TextDisplay';
import { Effect } from '../types';
import { copyToClipboard } from '../utils/sharing';
import { availableEffects, getEffectName, getEffectClass } from '../utils/effects';
import { FiEye, FiX } from "react-icons/fi";

// Formatting Button Component
interface FormatButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const FormatButton: React.FC<FormatButtonProps> = ({ label, isActive, onClick, children }) => (
  <button
    type="button"
    aria-label={`Toggle ${label}`}
    aria-pressed={isActive}
    onClick={onClick}
    className={`px-3 py-1.5 border rounded-md transition duration-150 ease-in-out ${isActive ? 'bg-gray-200 border-gray-400 text-gray-800 shadow-inner' : 'border-gray-300 text-gray-500 hover:bg-gray-100 bg-white bg-opacity-75'}`}
  >
    {children}
  </button>
);

export default function Home() {
  const {
    config,
    setText,
    setEffect,
    setColor,
    toggleBold,
    toggleItalic,
    toggleStrikethrough,
  } = useTextConfig();
  
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEffectClick = (effect: Effect) => {
    setEffect(effect);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-dotted">
      
      <div className="absolute top-16 md:top-20 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">EchoText</h1>
        <p className="text-md md:text-lg text-gray-600 mt-2">Create text with mesmerizing effects</p>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center space-y-8 mt-32 md:mt-40">
        
        <input
          type="text"
          className="w-full p-4 border border-gray-300 rounded-lg text-center text-2xl text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition duration-150 ease-in-out bg-white"
          placeholder="Type your text here"
          value={config.text}
          onChange={(e) => setText(e.target.value)}
          maxLength={20}
          aria-label="Text input"
        />

        {/* Character limit indicator */}
        <div className="text-xs text-gray-500 -mt-6 self-end mr-2">
          {config.text.length}/20 characters
        </div>

        {/* Responsive Controls Container */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center md:gap-4">
          
          {/* Effect Buttons Group */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {availableEffects.map((effectKey) => {
              const isActive = config.effect === effectKey;
              // Get the effect class string if this button is active
              const effectClass = isActive ? getEffectClass(effectKey) : '';
              return (
                <button
                  key={effectKey}
                  className={`px-4 py-2 border rounded-lg font-medium transition duration-150 ease-in-out text-sm ${isActive ? 'bg-indigo-100 border-indigo-300 text-indigo-700 shadow-inner' : 'border-gray-300 text-gray-600 hover:bg-gray-50 bg-white bg-opacity-75'} md:w-auto`}
                  onClick={() => handleEffectClick(effectKey)}
                >
                  {/* Apply effect class to the text span when active */}
                  <span className={isActive ? `effect-text ${effectClass}` : ''}>
                    {getEffectName(effectKey)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Formatting & Color Group (Shows border on medium+) */}
          <div className="flex items-center space-x-3 md:space-x-4 md:border-l md:border-gray-300 md:pl-4">
            {/* Formatting Buttons */}
            <div className="flex items-center space-x-2">
              <FormatButton label="Bold" isActive={config.isBold} onClick={toggleBold}>
                <span className="font-bold">B</span>
              </FormatButton>
              <FormatButton label="Italic" isActive={config.isItalic} onClick={toggleItalic}>
                <span className="italic">I</span>
              </FormatButton>
              <FormatButton label="Strikethrough" isActive={config.isStrikethrough} onClick={toggleStrikethrough}>
                <span className="line-through">S</span>
              </FormatButton>
            </div>
            
            {/* Color input */}
            <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-full border border-gray-300 overflow-hidden shadow-sm bg-white">
              <input
                type="color"
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                value={config.color}
                onChange={handleColorChange}
                aria-label="Select text color"
              />
              <div 
                className="absolute inset-0 w-full h-full rounded-full border-4 border-white pointer-events-none"
                style={{ backgroundColor: config.color }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 pt-4">
          <button 
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm bg-white bg-opacity-75"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen preview" : "Enter fullscreen preview"}
          >
            {isFullscreen ? <FiX className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            <span>{isFullscreen ? "Exit" : "Preview"}</span>
          </button>
        </div>
      </div> 

      {/* Fullscreen Preview */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-dotted flex items-center justify-center p-4 overflow-auto">
          <TextDisplay config={config} fullscreen={true} />
          <button 
            className="fixed top-4 right-4 z-[51] px-4 py-2 bg-white rounded-lg shadow-md text-gray-700 font-medium hover:bg-gray-100 transition duration-150 ease-in-out"
            onClick={toggleFullscreen}
            aria-label="Exit fullscreen preview"
          >
            Close Preview
          </button>
        </div>
      )}
    </main>
  );
}
