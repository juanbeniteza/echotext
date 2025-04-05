'use client';

import { useEffect, useState } from 'react';
import { decodeConfig, ShareConfig } from '../lib/sharing';
import { decodeConfigCompact } from '../lib/optimizedSharing';
import TextDisplay from './TextDisplay'; 
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { track } from '@vercel/analytics';

interface SharedViewProps {
  encodedConfig: string | null;
}

export default function SharedView({ encodedConfig }: SharedViewProps) {
  const [config, setConfig] = useState<ShareConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const safelyDecodeConfig = () => {
      if (!encodedConfig) {
        setError('Invalid URL. The share link parameter is missing.');
        setConfig(null);
        setIsLoading(false);
        return;
      }

      try {
        // Wrap in a setTimeout to ensure any exceptions don't crash the entire app
        setTimeout(() => {
          try {
            // First try the compact decoder (for new links)
            let decoded = decodeConfigCompact(encodedConfig);
            
            // If that fails, try the legacy decoder (for old links)
            if (!decoded) {
              decoded = decodeConfig(encodedConfig);
            }
            
            // Both decoders failed
            if (!decoded) {
              setError('This link cannot be decoded. It may be malformed or corrupted.');
              setConfig(null);
              
              // Track failed link views
              track('link_error', {
                error_type: 'decode_failure',
                encoded_id: encodedConfig
              });
              
              setIsLoading(false);
              return;
            }
            
            if (decoded && decoded.text && decoded.text.trim() !== '') {
              setConfig(decoded);
              setError(null);
              
              // Track when a shared link is successfully viewed
              track('link_viewed', {
                text_length: decoded.text.length,
                has_effect: decoded.effect !== null,
                effect_type: decoded.effect,
                has_formatting: decoded.isBold || decoded.isItalic || decoded.isStrikethrough
              });
            } else {
              setError('Invalid URL. This EchoText link might be corrupted or malformed.');
              setConfig(null);
              
              // Track failed link views
              track('link_error', {
                error_type: 'malformed_data',
                encoded_id: encodedConfig
              });
            }
          } catch (err) {
            console.error("Failed to decode content:", err);
            
            // More specific error messages based on error type
            let errorType = 'unknown_error';
            if (err instanceof Error) {
              if (err.message.includes('atob') || err.message.includes('decode')) {
                setError('This link contains invalid characters that cannot be decoded properly.');
                errorType = 'decode_error';
              } else if (err.message.includes('JSON')) {
                setError('This link contains data that cannot be properly processed.');
                errorType = 'json_error';
              } else {
                setError(`Invalid URL: ${err.message}`);
                errorType = 'url_error';
              }
            } else {
              setError('Invalid URL. This EchoText link cannot be decoded properly.');
            }
            
            // Track error during decoding
            track('link_error', {
              error_type: errorType,
              encoded_id: encodedConfig
            });
            
            setConfig(null);
          } finally {
            setIsLoading(false);
          }
        }, 0);
      } catch (err) {
        // Fallback error handler for any unexpected errors
        console.error("Unexpected error in decoding process:", err);
        
        // More informative error message
        const errorMessage = err instanceof Error 
          ? `An error occurred: ${err.message}` 
          : 'An unexpected error occurred while processing this link.';
          
        setError(errorMessage);
        setConfig(null);
        setIsLoading(false);
        
        // Track unexpected errors
        track('link_error', {
          error_type: 'unexpected_error',
          encoded_id: encodedConfig
        });
      }
    };

    safelyDecodeConfig();
  }, [encodedConfig]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-dotted">
        {/* Theme Toggle in the top-right corner */}
        <div className="fixed top-4 right-4 z-[30]">
          <ThemeToggle />
        </div>
        
        {/* Author attribution link in bottom-right */}
        <div className="fixed bottom-4 right-4 z-[30]">
          <a 
            href={process.env.NEXT_PUBLIC_AUTHOR_URL || "https://juanbenitez.dev"}
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            author
          </a>
        </div>
        
        <div className="p-6 rounded-xl">
          <p className="text-xl font-medium text-gray-800 dark:text-white">Loading shared content...</p>
        </div>
      </div>
    );
  }

  if (error || !config || !config.text || config.text.trim() === '') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-dotted p-8 dark:text-white">
        {/* Theme Toggle in the top-right corner */}
        <div className="fixed top-4 right-4 z-[30]">
          <ThemeToggle />
        </div>
        
        {/* Author attribution link in bottom-right */}
        <div className="fixed bottom-4 right-4 z-[30]">
          <a 
            href={process.env.NEXT_PUBLIC_AUTHOR_URL || "https://juanbenitez.dev"}
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            author
          </a>
        </div>
        
        <div className="max-w-md text-center p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-4 foreground">Invalid Link</h2>
          <p className="mb-8 foreground text-lg">{error || "The URL you're trying to access is not valid."}</p>
          <Link 
            href="/" 
            className="px-6 py-3 bg-indigo-600 text-white text-center rounded-lg shadow-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition duration-150 ease-in-out font-medium"
          >
            Go to EchoText Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-dotted">
      <div className="absolute inset-0 z-[5]">
        <TextDisplay config={config} fullscreen={true} />
      </div>
      
      {/* Theme Toggle in the top-right corner */}
      <div className="fixed top-4 right-4 z-[30]">
        <ThemeToggle />
      </div>
      
      {/* Author attribution link in bottom-right */}
      <div className="fixed bottom-4 right-4 z-[30]">
        <a 
          href={process.env.NEXT_PUBLIC_AUTHOR_URL || "https://juanbenitez.dev"}
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          author
        </a>
      </div>
      
      {/* Action buttons container */}
      <div className="fixed top-4 left-4 z-[30]">
        {/* Create your own button */}
        <Link 
          href="/" 
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg shadow-md transition duration-150 ease-in-out text-sm font-medium"
        >
          Create your own EchoText
        </Link>
      </div>
    </main>
  );
} 