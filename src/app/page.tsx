'use client';

import { useState, useEffect } from 'react';
import { useTextConfig } from '../hooks/useTextConfig';
import TextDisplay from '../components/TextDisplay';
import ThemeToggle from '../components/ThemeToggle';
import { Effect } from '../types';
import { ShareConfig } from '../lib/sharing';
import { encodeConfigCompact } from '../lib/optimizedSharing';
import { availableEffects, getEffectName, getEffectClass } from '../utils/effects';
import { FiEye, FiX, FiShare2, FiCheck, FiCopy } from "react-icons/fi";
import { copyToClipboard } from '../utils/clipboard';
import { track } from '@vercel/analytics';

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
    className={`px-3 py-1.5 border rounded-md transition duration-150 ease-in-out ${
      isActive 
        ? 'bg-indigo-100 border-indigo-300 shadow-inner dark:bg-indigo-900 dark:border-indigo-700' 
        : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-white dark:border-gray-400 text-gray-800 dark:text-gray-800'
    }`}
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
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEffectClick = (effect: Effect) => {
    setEffect(effect);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const toggleFullscreen = () => {
    // Don't enter fullscreen if there's no text
    if (!config.text.trim() && !isFullscreen) return;
    
    setIsFullscreen(!isFullscreen);
    if (isCopied) setIsCopied(false);
  };

  const handleShare = async () => {
    // Don't proceed if there's no text
    if (!config.text.trim()) return;

    const shareableConfig: ShareConfig = {
        text: config.text,
        effect: config.effect,
        color: config.color,
        isBold: config.isBold,
        isItalic: config.isItalic,
        isStrikethrough: config.isStrikethrough,
        fontSize: config.fontSize,
        fontFamily: config.fontFamily,
        spacing: config.spacing,
        repeat: config.repeat,
    };

    // Use optimized encoding for shorter URLs
    const encoded = encodeConfigCompact(shareableConfig);
    if (!encoded) {
      alert("Failed to generate share link.");
      return;
    }

    // Fix hydration by using proper Next.js approach
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const generatedShareUrl = `${origin}/s/${encoded}`;
    setShareUrl(generatedShareUrl);

    // Track link creation event with analytics
    track('link_created', {
      text_length: config.text.length,
      has_effect: config.effect !== Effect.NONE,
      effect_type: config.effect,
      has_formatting: config.isBold || config.isItalic || config.isStrikethrough
    });

    const success = await copyToClipboard(generatedShareUrl);
    if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    } else {
        alert("Failed to copy link to clipboard.");
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start p-8 bg-dotted">
      
      {/* Theme Toggle in the top-right corner */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Title and description - moved from absolute to relative positioning */}
      <div className="text-center w-full px-4 pt-12 md:pt-16 mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">~ echotext ~</h1>
        <p className="text-md md:text-lg mt-2">share text with mesmerizing effects</p>
      </div>

      {/* Author attribution link - fixed to bottom for all displays */}
      <div className="fixed bottom-4 right-4 z-10">
        <a 
          href={process.env.NEXT_PUBLIC_AUTHOR_URL || "https://juanbenitez.dev"}
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          author
        </a>
      </div>
      
      <div className="w-full max-w-3xl flex flex-col items-center space-y-6 md:space-y-8 mt-16 md:mt-24">
        
        <input
          type="text"
          className="w-full p-3 md:p-4 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-xl md:text-2xl text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition duration-150 ease-in-out bg-white dark:bg-gray-800"
          placeholder="Type your text here"
          value={isClient ? config.text : ''}
          onChange={(e) => setText(e.target.value)}
          maxLength={20}
          aria-label="Text input"
          suppressHydrationWarning
          autoComplete="off"
        />

        {/* Character limit indicator */}
        <div className="text-xs -mt-6 self-end mr-2">
          {isClient ? config.text.length : 0}/20 characters
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
                  className={`px-4 py-2 border rounded-lg font-medium transition duration-150 ease-in-out text-sm ${
                    isActive 
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700 shadow-inner dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-300' 
                      : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-white dark:border-gray-400 text-gray-800 dark:text-gray-800'
                  } md:w-auto`}
                  onClick={() => handleEffectClick(effectKey)}
                >
                  {/* Apply effect class to the text span when active */}
                  <span className={isActive ? `effect-text ${effectClass} text-indigo-700 dark:text-indigo-300` : ''}>
                    {getEffectName(effectKey)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Formatting & Color Group (Shows border on medium+) */}
          <div className="flex items-center space-x-3 md:space-x-4 md:border-l md:border-gray-300 md:dark:border-gray-700 md:pl-4">
            {/* Formatting Buttons */}
            <div className="flex items-center space-x-2">
              <FormatButton label="Bold" isActive={config.isBold} onClick={toggleBold}>
                <span className={`font-bold ${config.isBold ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-800'}`}>B</span>
              </FormatButton>
              <FormatButton label="Italic" isActive={config.isItalic} onClick={toggleItalic}>
                <span className={`italic ${config.isItalic ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-800'}`}>I</span>
              </FormatButton>
              <FormatButton label="Strikethrough" isActive={config.isStrikethrough} onClick={toggleStrikethrough}>
                <span className={`line-through ${config.isStrikethrough ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-800'}`}>S</span>
              </FormatButton>
            </div>
            
            {/* Color input */}
            <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-full border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm">
              <input
                type="color"
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                value={config.color}
                onChange={handleColorChange}
                aria-label="Select text color"
              />
              <div 
                className="absolute inset-0 w-full h-full rounded-full border-4 border-white dark:border-gray-800 pointer-events-none"
                style={{ backgroundColor: config.color }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 pt-4">
          <button 
            className={`flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm bg-white dark:bg-gray-800 ${!config.text.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={toggleFullscreen}
            disabled={!config.text.trim()}
            aria-label={isFullscreen ? "Exit fullscreen preview" : "Enter fullscreen preview"}
          >
            {isFullscreen ? <FiX className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            <span>{isFullscreen ? "Exit" : "Preview"}</span>
          </button>

          <button 
            className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-lg font-medium transition duration-150 ease-in-out shadow-sm 
                       ${isCopied 
                         ? 'bg-green-100 border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300' 
                         : 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:bg-indigo-900/80 dark:border-indigo-800 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}
                       ${!config.text.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleShare}
            disabled={isCopied || !config.text.trim()}
            aria-label="Share EchoText configuration"
          >
            {isCopied ? <FiCheck className="h-5 w-5" /> : <FiShare2 className="h-5 w-5" />}
            <span>{isCopied ? "Copied!" : "Share"}</span>
          </button>
        </div>

        {/* Share URL display section */}
        {shareUrl && (
          <div className="w-full mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800/95 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Share Link:</p>
              <button
                onClick={handleCopyLink}
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors p-1"
                aria-label="Copy share URL"
              >
                <FiCopy className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 bg-gray-50 dark:bg-gray-900/80 p-3 rounded-md overflow-x-auto">
              <code className="text-xs sm:text-sm break-all text-gray-800 dark:text-gray-200">{shareUrl}</code>
            </div>
          </div>
        )}
      </div> 

      {/* Fullscreen Preview */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-dotted flex flex-col items-center justify-start p-4 overflow-auto">
          {/* Add title at the top */}
          <div className="text-center w-full px-4 pt-12 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold">~ echotext ~</h1>
          </div>
          
          {/* Text display centered vertically in the remaining space */}
          <div className="flex-grow flex items-center justify-center w-full mt-16 md:mt-24">
            <TextDisplay config={config} fullscreen={true} />
          </div>
          
          {/* Theme toggle button stays at top right */}
          <div className="fixed top-4 right-4 z-[51]">
            <ThemeToggle />
          </div>
          
          {/* Author attribution link in bottom-right */}
          <div className="fixed bottom-4 right-4 z-[51]">
            <a 
              href={process.env.NEXT_PUBLIC_AUTHOR_URL || "https://juanbenitez.dev"}
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              author
            </a>
          </div>
          
          {/* Action buttons moved to top left */}
          <div className="fixed top-4 left-4 z-[51] flex gap-2">
            {/* Copy Link Button */}
            <button 
              className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition duration-150 ease-in-out shadow-md 
                        ${isCopied 
                          ? 'bg-green-100 border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                        ${!config.text.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleShare}
              disabled={isCopied || !config.text.trim()}
              aria-label="Copy share link"
            >
              {isCopied ? <FiCheck className="h-5 w-5" /> : <FiShare2 className="h-5 w-5" />}
              <span>{isCopied ? "Copied!" : "Copy Link"}</span>
            </button>
            
            {/* Close Preview Button */}
            <button 
              className="px-4 py-2 rounded-lg shadow-md font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              onClick={toggleFullscreen}
              aria-label="Exit fullscreen preview"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
