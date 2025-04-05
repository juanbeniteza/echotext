import pako from 'pako';
import { Effect } from '../types'; // Import Effect type

// Redefine based on useTextConfig state
export interface ShareConfig {
  text: string;
  effect: Effect | null; // Allow null if no effect is selected
  color: string;
  isBold: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  // Properties required by TextDisplay
  fontSize: number; 
  fontFamily: string;
  spacing: number;
  repeat: number;
  // Add any other relevant state from useTextConfig if needed
}

/**
 * Encodes the configuration object into a compact, URL-safe string.
 * @param config The configuration object to encode.
 * @returns A compressed, URL-safe base64 encoded string, or empty string on error.
 */
export function encodeConfig(config: ShareConfig): string {
  try {
    const jsonString = JSON.stringify(config);
    const compressed = pako.deflate(jsonString);
    // Convert Uint8Array to a binary string needed by btoa
    let binaryString = '';
    // Avoid potential issues with large arrays and apply calls
    for (let i = 0; i < compressed.length; i++) {
        binaryString += String.fromCharCode(compressed[i]);
    }

    const base64 = btoa(binaryString);
    // Make base64 URL-safe: replace '+' with '-', '/' with '_', remove '=' padding
    const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return urlSafeBase64;
  } catch (error) {
    console.error("Failed to encode config:", error);
    // Return empty string or throw an error based on desired error handling
    return '';
  }
}

/**
 * Decodes a URL-safe string back into the configuration object.
 * @param encodedString The URL-safe encoded string.
 * @returns The decoded configuration object, or null if decoding fails.
 */
export function decodeConfig(encodedString: string): ShareConfig | null {
  if (!encodedString) {
    return null;
  }
  
  try {
    // Make base64 standard again: replace '-' with '+', '_' with '/'
    let base64 = encodedString.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding back: base64 length must be a multiple of 4
    while (base64.length % 4) {
      base64 += '=';
    }

    try {
      // Decode base64 to binary string
      const binaryString = atob(base64);
      
      // Convert binary string to Uint8Array
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      try {
        // Use a try-catch specifically for pako decompression
        let decompressed: string;
        try {
          // Decompress using pako
          decompressed = pako.inflate(bytes, { to: 'string' });
        } catch (decompressionError) {
           // console.error("Pako decompression error:", decompressionError);
          return null;
        }
        
        // Check if decompressed data is valid before parsing
        if (!decompressed || typeof decompressed !== 'string' || 
            decompressed === 'undefined' || decompressed.trim() === '') {
          console.error("Invalid decompressed data:", decompressed);
          return null;
        }

        try {
          // Parse the JSON string
          const config = JSON.parse(decompressed);

          // Validate that config is an object
          if (!config || typeof config !== 'object') {
            console.error("Parsed config is not an object:", config);
            return null;
          }

          // Provide default values for the validation to be more resilient
          const defaultConfig: ShareConfig = {
            text: config.text || 'Fallback text',
            effect: null, // Default to no effect if invalid
            color: config.color || '#000000',
            isBold: typeof config.isBold === 'boolean' ? config.isBold : false,
            isItalic: typeof config.isItalic === 'boolean' ? config.isItalic : false,
            isStrikethrough: typeof config.isStrikethrough === 'boolean' ? config.isStrikethrough : false,
            fontSize: typeof config.fontSize === 'number' && config.fontSize > 0 ? config.fontSize : 36,
            fontFamily: config.fontFamily || 'Arial, sans-serif',
            spacing: typeof config.spacing === 'number' ? config.spacing : 1,
            repeat: typeof config.repeat === 'number' && config.repeat >= 1 ? config.repeat : 1
          };

          // Basic validation check (less strict)
          if (typeof config === 'object' && config !== null && 'text' in config) {
            // Use the validated config, but be less strict on missing properties
            return {
              text: config.text || defaultConfig.text,
              effect: config.effect || defaultConfig.effect, 
              color: (typeof config.color === 'string' && /^#[0-9A-F]{6}$/i.test(config.color)) 
                ? config.color 
                : defaultConfig.color,
              isBold: typeof config.isBold === 'boolean' ? config.isBold : defaultConfig.isBold,
              isItalic: typeof config.isItalic === 'boolean' ? config.isItalic : defaultConfig.isItalic,
              isStrikethrough: typeof config.isStrikethrough === 'boolean' 
                ? config.isStrikethrough 
                : defaultConfig.isStrikethrough,
              fontSize: typeof config.fontSize === 'number' && config.fontSize > 0 
                ? config.fontSize 
                : defaultConfig.fontSize,
              fontFamily: typeof config.fontFamily === 'string' && config.fontFamily.length > 0 
                ? config.fontFamily 
                : defaultConfig.fontFamily,
              spacing: typeof config.spacing === 'number' ? config.spacing : defaultConfig.spacing,
              repeat: typeof config.repeat === 'number' && config.repeat >= 1 
                ? config.repeat 
                : defaultConfig.repeat
            };
          } else {
            console.error("Decoded config validation failed:", config);
            return null;
          }
        } catch (jsonError) {
          console.error("JSON parse error", jsonError);
          return null; // Return null instead of throwing to prevent uncaught exceptions
        }
      } catch (pakoError) {
        console.error("Decompression error", pakoError);
        return null; // Return null instead of throwing to prevent uncaught exceptions
      }
    } catch (base64Error) {
      console.error("Base64 decoding error", base64Error);
      return null; // Return null instead of throwing to prevent uncaught exceptions
    }
  } catch (error) {
    // Catch all errors
    console.error("Failed to decode config:", error);
    return null;
  }
} 