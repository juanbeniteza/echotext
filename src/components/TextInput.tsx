'use client';

import { useState, useEffect } from 'react';

interface TextInputProps {
  initialText: string;
  onTextChange: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ initialText, onTextChange }) => {
  const [text, setText] = useState(initialText);

  // Update the parent when text changes
  useEffect(() => {
    onTextChange(text);
  }, [text, onTextChange]);

  // Update local state when initialText prop changes
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="w-full">
      <label 
        htmlFor="text-input" 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Enter Your Text
      </label>
      <textarea
        id="text-input"
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={text}
        onChange={handleChange}
        rows={3}
        placeholder="Type something here..."
        aria-label="Text input"
      />
    </div>
  );
};

export default TextInput; 