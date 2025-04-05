'use client';

import { useEffect, useState } from 'react';
import { decodeConfig, ShareConfig } from '../lib/sharing';
import TextDisplay from './TextDisplay'; 
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

interface SharedViewProps {
  encodedConfig: string | null;
}

export default function SharedView({ encodedConfig }: SharedViewProps) {
  const [config, setConfig] = useState<ShareConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to safely decode config
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
            const decoded = decodeConfig(encodedConfig);
            if (decoded && decoded.text && decoded.text.trim() !== '') {
              setConfig(decoded);
              setError(null);
            } else {
              setError('Invalid URL. This EchoText link might be corrupted or malformed.');
              setConfig(null);
            }
          } catch (err) {
            console.error("Failed to decode content:", err);
            setError('Invalid URL. This EchoText link cannot be decoded properly.');
            setConfig(null);
          } finally {
            setIsLoading(false);
          }
        }, 0);
      } catch (err) {
        // Fallback error handler for any unexpected errors
        console.error("Unexpected error in decoding process:", err);
        setError('An unexpected error occurred while processing this link.');
        setConfig(null);
        setIsLoading(false);
      }
    };

    safelyDecodeConfig();
  }, [encodedConfig]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-dotted">
        {/* Theme Toggle in the top-right corner */}
        <div className="absolute top-4 right-4 z-[30]">
          <ThemeToggle />
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
        <div className="absolute top-4 right-4 z-[30]">
          <ThemeToggle />
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
      <div className="absolute top-4 right-4 z-[30]">
        <ThemeToggle />
      </div>
      
      {/* Action buttons container */}
      <div className="absolute top-4 left-4 z-[30]">
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