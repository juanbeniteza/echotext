'use client';

import { expirationOptions } from '../utils/sharing';

interface ExpirationPickerProps {
  expirationTime: number;
  onChange: (expirationTime: number) => void;
}

const ExpirationPicker: React.FC<ExpirationPickerProps> = ({
  expirationTime,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    onChange(value);
  };

  return (
    <div className="mb-4">
      <label 
        htmlFor="expiration-picker" 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Link Expiration
      </label>
      <select
        id="expiration-picker"
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={expirationTime}
        onChange={handleChange}
        aria-label="Select link expiration time"
      >
        {expirationOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500">
        {expirationTime === 0
          ? 'Your link will never expire'
          : `Your link will expire after ${expirationOptions.find(
              (option) => option.value === expirationTime
            )?.label.toLowerCase()}`}
      </p>
    </div>
  );
};

export default ExpirationPicker; 