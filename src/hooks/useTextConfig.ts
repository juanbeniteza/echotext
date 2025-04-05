import { useState, useCallback } from 'react';
import { TextConfig, Effect } from '../types';

// Default configuration values
export const DEFAULT_CONFIG: TextConfig = {
  text: '', // Start with empty text
  effect: Effect.NONE,
  color: '#FF0000',
  fontSize: 30, // Adjusted from 24 to better fit our min/max scale range
  fontFamily: 'Arial, sans-serif',
  spacing: 0,
  repeat: 50, // Increased default number of repetitions
  // Formatting defaults
  isBold: false,
  isItalic: false,
  isStrikethrough: false,
};

export const useTextConfig = (initialConfig: Partial<TextConfig> = {}) => {
  const [config, setConfig] = useState<TextConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  });

  // Update the entire configuration
  const setFullConfig = useCallback((newConfig: TextConfig) => {
    setConfig(newConfig);
  }, []);

  // Update a single property of the configuration
  const updateConfig = useCallback(<K extends keyof TextConfig>(
    key: K,
    value: TextConfig[K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Update the text
  const setText = useCallback((text: string) => {
    updateConfig('text', text);
  }, [updateConfig]);

  // Update the effect
  const setEffect = useCallback((effect: Effect) => {
    updateConfig('effect', effect);
  }, [updateConfig]);

  // Update the color
  const setColor = useCallback((color: string) => {
    updateConfig('color', color);
  }, [updateConfig]);

  // Update the font size (Keep for potential future use)
  const setFontSize = useCallback((fontSize: number) => {
    updateConfig('fontSize', fontSize);
  }, [updateConfig]);

  // Update the font family (Keep for potential future use)
  const setFontFamily = useCallback((fontFamily: string) => {
    updateConfig('fontFamily', fontFamily);
  }, [updateConfig]);

  // Update the letter spacing (Keep for potential future use)
  const setSpacing = useCallback((spacing: number) => {
    updateConfig('spacing', spacing);
  }, [updateConfig]);

  // Update the repeat count (Keep for potential future use)
  const setRepeat = useCallback((repeat: number) => {
    updateConfig('repeat', repeat);
  }, [updateConfig]);

  // --- Text Formatting Setters ---
  const toggleBold = useCallback(() => {
    updateConfig('isBold', !config.isBold);
  }, [config.isBold, updateConfig]);

  const toggleItalic = useCallback(() => {
    updateConfig('isItalic', !config.isItalic);
  }, [config.isItalic, updateConfig]);

  const toggleStrikethrough = useCallback(() => {
    updateConfig('isStrikethrough', !config.isStrikethrough);
  }, [config.isStrikethrough, updateConfig]);
  // --- End Text Formatting Setters ---

  return {
    config,
    setFullConfig,
    updateConfig,
    setText,
    setEffect,
    setColor,
    setFontSize,
    setFontFamily,
    setSpacing,
    setRepeat,
    // Formatting toggles
    toggleBold,
    toggleItalic,
    toggleStrikethrough,
  };
}; 