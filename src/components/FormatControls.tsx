'use client';

interface FormatControlsProps {
  fontSize: number;
  fontFamily: string;
  spacing: number;
  repeat: number;
  onFontSizeChange: (size: number) => void;
  onFontFamilyChange: (family: string) => void;
  onSpacingChange: (spacing: number) => void;
  onRepeatChange: (repeat: number) => void;
}

const FormatControls: React.FC<FormatControlsProps> = ({
  fontSize,
  fontFamily,
  spacing,
  repeat,
  onFontSizeChange,
  onFontFamilyChange,
  onSpacingChange,
  onRepeatChange,
}) => {
  // Available font families
  const fontFamilies = [
    'Arial, sans-serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Georgia, serif',
    'Verdana, sans-serif',
    'Impact, fantasy',
    'Comic Sans MS, cursive',
  ];

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      onFontSizeChange(value);
    }
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFontFamilyChange(e.target.value);
  };

  const handleSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      onSpacingChange(value);
    }
  };

  const handleRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      onRepeatChange(value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Font Family Selector */}
      <div>
        <label 
          htmlFor="font-family" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Font Family
        </label>
        <select
          id="font-family"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={fontFamily}
          onChange={handleFontFamilyChange}
          aria-label="Select font family"
        >
          {fontFamilies.map((family) => (
            <option key={family} value={family} style={{ fontFamily: family }}>
              {family.split(',')[0]}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size Control */}
      <div>
        <label 
          htmlFor="font-size" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Font Size: {fontSize}px
        </label>
        <input
          id="font-size"
          type="range"
          className="w-full"
          min="10"
          max="72"
          step="1"
          value={fontSize}
          onChange={handleFontSizeChange}
          aria-label="Adjust font size"
        />
      </div>

      {/* Letter Spacing Control */}
      <div>
        <label 
          htmlFor="letter-spacing" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Letter Spacing: {spacing}px
        </label>
        <input
          id="letter-spacing"
          type="range"
          className="w-full"
          min="0"
          max="20"
          step="1"
          value={spacing}
          onChange={handleSpacingChange}
          aria-label="Adjust letter spacing"
        />
      </div>

      {/* Repeat Count Control */}
      <div>
        <label 
          htmlFor="repeat-count" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Repeat Count: {repeat}
        </label>
        <input
          id="repeat-count"
          type="range"
          className="w-full"
          min="1"
          max="100"
          step="1"
          value={repeat}
          onChange={handleRepeatChange}
          aria-label="Adjust repeat count"
        />
      </div>
    </div>
  );
};

export default FormatControls; 