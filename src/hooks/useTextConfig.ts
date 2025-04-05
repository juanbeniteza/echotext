import { useState, useCallback } from 'react';
import { TextConfig, Effect } from '../types';

// Default configuration values
export const DEFAULT_CONFIG: TextConfig = {
  text: 'Hello, World!',
  effect: Effect.NONE,
  color: '#000000',
  fontSize: 24,
  fontFamily: 'Arial, sans-serif',
  spacing: 0,
  repeat: 25, // Default number of repetitions
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

  // Update the font size
  const setFontSize = useCallback((fontSize: number) => {
    updateConfig('fontSize', fontSize);
  }, [updateConfig]);

  // Update the font family
  const setFontFamily = useCallback((fontFamily: string) => {
    updateConfig('fontFamily', fontFamily);
  }, [updateConfig]);

  // Update the letter spacing
  const setSpacing = useCallback((spacing: number) => {
    updateConfig('spacing', spacing);
  }, [updateConfig]);

  // Update the repeat count
  const setRepeat = useCallback((repeat: number) => {
    updateConfig('repeat', repeat);
  }, [updateConfig]);

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
  };
}; 