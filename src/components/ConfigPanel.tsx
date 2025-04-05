'use client';

import { TextConfig, Effect } from '../types';
import TextInput from './TextInput';
import EffectSelector from './EffectSelector';
import ColorSelector from './ColorSelector';
import FormatControls from './FormatControls';
import ShareLink from './ShareLink';

interface ConfigPanelProps {
  config: TextConfig;
  onTextChange: (text: string) => void;
  onEffectChange: (effect: Effect) => void;
  onColorChange: (color: string) => void;
  onFontSizeChange: (size: number) => void;
  onFontFamilyChange: (family: string) => void;
  onSpacingChange: (spacing: number) => void;
  onRepeatChange: (repeat: number) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onTextChange,
  onEffectChange,
  onColorChange,
  onFontSizeChange,
  onFontFamilyChange,
  onSpacingChange,
  onRepeatChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Text Configuration</h2>
      
      <div className="space-y-6">
        <TextInput 
          initialText={config.text} 
          onTextChange={onTextChange} 
        />
        
        <EffectSelector 
          selectedEffect={config.effect} 
          onEffectChange={onEffectChange} 
        />
        
        <ColorSelector 
          selectedColor={config.color} 
          onColorChange={onColorChange} 
        />
        
        <FormatControls 
          fontSize={config.fontSize}
          fontFamily={config.fontFamily}
          spacing={config.spacing}
          repeat={config.repeat}
          onFontSizeChange={onFontSizeChange}
          onFontFamilyChange={onFontFamilyChange}
          onSpacingChange={onSpacingChange}
          onRepeatChange={onRepeatChange}
        />
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Share Your Creation</h3>
          <ShareLink config={config} />
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel; 