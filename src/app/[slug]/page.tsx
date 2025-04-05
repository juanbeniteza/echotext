'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TextConfig, Effect } from '../../types';
import { DEFAULT_CONFIG } from '../../hooks/useTextConfig';
import TextDisplay from '../../components/TextDisplay';

export default function SharedTextPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<TextConfig>(DEFAULT_CONFIG);
  
  const slug = params?.slug as string;

  useEffect(() => {
    if (!slug) return;

    const fetchConfig = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/links/${slug}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to load configuration');
        }
        
        const data = await res.json();
        
        if (data.config) {
          setConfig(data.config);
        } else {
          throw new Error('Invalid configuration data');
        }
      } catch (err) {
        console.error('Error fetching shared text:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [slug]);

  const handleBackToHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="mb-6">{error}</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleBackToHome}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 bg-dotted overflow-hidden">
      <div className="fixed top-4 left-4 z-20">
        <button
          className="px-4 py-2 bg-white rounded-md shadow-md hover:bg-gray-100 transition-colors"
          onClick={handleBackToHome}
        >
          Create Your Own
        </button>
      </div>
      
      <TextDisplay 
        config={config} 
        fullscreen={true} 
      />
    </main>
  );
} 