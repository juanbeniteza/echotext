'use client';

import { useEffect, useState } from 'react';
import { decodeConfig, ShareConfig } from '../lib/sharing';
import TextDisplay from './TextDisplay'; 
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading shared content...</p>
      </div>
    );
  }

  if (error || !config || !config.text || config.text.trim() === '') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-8">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Invalid Link</h2>
          <p className="text-gray-600 mb-8">{error || "The URL you're trying to access is not valid."}</p>
          <Link 
            href="/" 
            className="px-6 py-3 bg-indigo-600 text-white text-center rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out font-medium"
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
      
      {/* Action buttons container */}
      <div className="absolute top-4 left-4 z-[30]">
        {/* Create your own button */}
        <Link 
          href="/" 
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition duration-150 ease-in-out text-sm font-medium"
        >
          Create your own EchoText
        </Link>
      </div>
    </main>
  );
} 