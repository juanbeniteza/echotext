'use client';

import { Effect } from '../types';
import { availableEffects, getEffectName } from '../utils/effects';

interface EffectSelectorProps {
  selectedEffect: Effect;
  onEffectChange: (effect: Effect) => void;
}

const EffectSelector: React.FC<EffectSelectorProps> = ({ 
  selectedEffect, 
  onEffectChange 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Convert the string value back to the Effect enum
    onEffectChange(e.target.value as Effect);
  };

  return (
    <div className="mb-4">
      <label 
        htmlFor="effect-selector" 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Select Effect
      </label>
      <select
        id="effect-selector"
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={selectedEffect}
        onChange={handleChange}
        aria-label="Select text effect"
      >
        {availableEffects.map((effect) => (
          <option key={effect} value={effect}>
            {getEffectName(effect)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EffectSelector; 