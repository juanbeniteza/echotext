'use client';

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ 
  selectedColor, 
  onColorChange 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  };

  // Predefined color options
  const colorOptions = [
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
  ];

  return (
    <div className="mb-4">
      <label 
        htmlFor="color-selector" 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Text Color
      </label>
      
      <div className="flex items-center space-x-2">
        <input
          id="color-selector"
          type="color"
          className="h-10 w-10 border border-gray-300 rounded cursor-pointer"
          value={selectedColor}
          onChange={handleChange}
          aria-label="Select text color"
        />
        <span className="text-sm">{selectedColor}</span>
      </div>
      
      <div className="mt-2 flex flex-wrap gap-2">
        {colorOptions.map((color) => (
          <button
            key={color}
            type="button"
            className={`h-6 w-6 rounded-full border ${
              selectedColor === color ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-300'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector; 