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
    if (encodedConfig) {
      try {
        const decoded = decodeConfig(encodedConfig);
        if (decoded) {
          setConfig(decoded);
          setError(null);
        } else {
          setError('Invalid or corrupted share link.');
          setConfig(null);
        }
      } catch (err) {
        console.error("Failed to decode content:", err);
        setError('Failed to decode shared content.');
        setConfig(null);
      }
    } else {
       setError('Share link parameter missing or invalid.');
       setConfig(null);
    }
    setIsLoading(false);
  }, [encodedConfig]); 

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading shared content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-red-50 p-4">
        <p className="text-xl text-red-700 font-semibold mb-4">Error</p>
        <p className="text-red-600 text-center mb-6">{error}</p>
        <Link href="/" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-150 ease-in-out">
          Go back to editor
        </Link>
      </div>
    );
  }

  if (config) {
    return (
      <main className="relative min-h-screen bg-dotted">
        <div className="absolute inset-0 z-[5]">
          <TextDisplay config={config} fullscreen={true} />
        </div>
        <div className="absolute top-4 left-4 z-[30]">
            <Link href="/" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition duration-150 ease-in-out text-sm font-medium">
              Create your own EchoText
            </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Could not load shared content.</p>
    </div>
  );
} 