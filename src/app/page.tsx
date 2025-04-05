'use client';

import { useState } from 'react';
import { useTextConfig, DEFAULT_CONFIG } from '../hooks/useTextConfig';
import ConfigPanel from '../components/ConfigPanel';
import TextDisplay from '../components/TextDisplay';

export default function Home() {
  const {
    config,
    setText,
    setEffect,
    setColor,
    setFontSize,
    setFontFamily,
    setSpacing,
    setRepeat,
  } = useTextConfig();
  
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="container mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">EchoText</h1>
          <p className="text-gray-600">Create and share beautiful text with effects</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Preview</h2>
              <button 
                className="text-blue-600 hover:text-blue-800"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit fullscreen preview" : "Enter fullscreen preview"}
              >
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
              </button>
            </div>
            <TextDisplay config={config} fullscreen={isFullscreen} />
          </div>
          
          <div className="lg:col-span-1">
            <ConfigPanel
              config={config}
              onTextChange={setText}
              onEffectChange={setEffect}
              onColorChange={setColor}
              onFontSizeChange={setFontSize}
              onFontFamilyChange={setFontFamily}
              onSpacingChange={setSpacing}
              onRepeatChange={setRepeat}
            />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EchoText. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
