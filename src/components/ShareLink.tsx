'use client';

import { useState } from 'react';
import { TextConfig } from '../types';
import { useSupabase } from '../hooks/useSupabase';
import { generateShareableUrl, copyToClipboard } from '../utils/sharing';
import ExpirationPicker from './ExpirationPicker';

interface ShareLinkProps {
  config: TextConfig;
}

const ShareLink: React.FC<ShareLinkProps> = ({ config }) => {
  const { saveConfig, loading, error } = useSupabase();
  const [shareableUrl, setShareableUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expirationTime, setExpirationTime] = useState<number>(0); // 0 = no expiration

  const handleGenerateLink = async () => {
    const id = await saveConfig(config, expirationTime > 0 ? expirationTime : undefined);
    
    if (id) {
      const url = generateShareableUrl(id);
      setShareableUrl(url);
      setCopied(false);
    }
  };

  const handleCopyLink = async () => {
    if (shareableUrl) {
      const success = await copyToClipboard(shareableUrl);
      
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      }
    }
  };

  return (
    <div className="space-y-4">
      <ExpirationPicker 
        expirationTime={expirationTime}
        onChange={setExpirationTime}
      />
      
      <button
        type="button"
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        onClick={handleGenerateLink}
        disabled={loading}
        aria-label="Generate shareable link"
      >
        {loading ? 'Generating...' : 'Generate Share Link'}
      </button>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
      
      {shareableUrl && (
        <div className="mt-4">
          <label 
            htmlFor="share-url" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Shareable Link
          </label>
          <div className="flex">
            <input
              id="share-url"
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={shareableUrl}
              readOnly
              aria-label="Shareable URL"
            />
            <button
              type="button"
              className="py-2 px-4 bg-gray-100 text-gray-800 font-medium rounded-r-md border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={handleCopyLink}
              aria-label="Copy link to clipboard"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareLink; 