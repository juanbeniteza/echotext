import pako from 'pako';
import { Effect } from '../types'; // Import Effect type

/**
 * Cross-platform base64 decoder that works in browser and Node.js environments
 * @param base64 The base64 string to decode
 * @returns Decoded string
 */
function safeBase64Decode(base64: string): string {
  // Make base64 standard: replace URL-safe chars with standard base64 chars
  const standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if needed
  const paddedBase64 = standardBase64.padEnd(
    standardBase64.length + (4 - (standardBase64.length % 4 || 4)) % 4,
    '='
  );

  try {
    // Browser environment
    return atob(paddedBase64);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  } catch (e) {
  /* eslint-enable @typescript-eslint/no-unused-vars */
    // Node.js environment
    if (typeof Buffer !== 'undefined') {
      const buffer = Buffer.from(paddedBase64, 'base64');
      return Array.from(new Uint8Array(buffer))
        .map(byte => String.fromCharCode(byte))
        .join('');
    }
    
    // If all fails, try a manual decoder as last resort
    return manualBase64Decode(paddedBase64);
  }
}

/**
 * Manual base64 decoder as a last resort
 * This is a fallback implementation for environments where neither atob nor Buffer are available
 */
function manualBase64Decode(base64: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }
  
  // Set padding character value
  lookup['='.charCodeAt(0)] = 0;

  const bytes = [];
  let p = 0;
  let encoded1, encoded2, encoded3, encoded4;

  for (let i = 0; i < base64.length; i += 4) {
    // Get values of base64 characters
    encoded1 = lookup[base64.charCodeAt(i)] || 0;
    encoded2 = lookup[base64.charCodeAt(i + 1)] || 0;
    encoded3 = lookup[base64.charCodeAt(i + 2)] || 0;
    encoded4 = lookup[base64.charCodeAt(i + 3)] || 0;

    // Add the first byte
    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    
    // Check for padding in the 3rd position
    if (base64.charAt(i + 2) !== '=') {
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    }
    
    // Check for padding in the 4th position
    if (base64.charAt(i + 3) !== '=') {
      bytes[p++] = ((encoded3 & 3) << 6) | encoded4;
    }
  }

  // Convert byte array to string
  let result = '';
  for (let i = 0; i < p; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  
  return result;
}

/**
 * Cross-platform base64 encoder that works in browser and Node.js environments
 * @param binaryStr The binary string to encode
 * @returns Base64 encoded string
 */
function safeBase64Encode(binaryStr: string): string {
  try {
    // Browser environment
    return btoa(binaryStr);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  } catch (e) {
  /* eslint-enable @typescript-eslint/no-unused-vars */
    // Node.js environment
    if (typeof Buffer !== 'undefined') {
      const buffer = Buffer.from(binaryStr, 'binary');
      return buffer.toString('base64');
    }
    
    // If all fails, try a manual encoder as last resort
    return manualBase64Encode(binaryStr);
  }
}

/**
 * Manual base64 encoder as a last resort
 * This is a fallback implementation for environments where neither btoa nor Buffer are available
 */
function manualBase64Encode(data: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  let byteNum = 0;
  let chunk = 0;
  
  while (i < data.length) {
    const code = data.charCodeAt(i++);
    chunk = (chunk << 8) | code;
    byteNum++;
    
    if (byteNum === 3 || i === data.length) {
      result += chars[(chunk & 0xfc0000) >> 18];
      result += chars[(chunk & 0x03f000) >> 12];
      
      if (byteNum > 1 || i === data.length) {
        result += byteNum > 1 ? chars[(chunk & 0x000fc0) >> 6] : '=';
      }
      
      if (byteNum > 2 || i === data.length) {
        result += byteNum > 2 ? chars[chunk & 0x00003f] : '=';
      }
      
      chunk = 0;
      byteNum = 0;
    }
  }
  
  return result;
}

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
    
    // Convert Uint8Array to a binary string
    let binaryString = '';
    for (let i = 0; i < compressed.length; i++) {
        binaryString += String.fromCharCode(compressed[i]);
    }

    // Use our safe cross-platform base64 encoder
    const base64 = safeBase64Encode(binaryString);
    
    // Make base64 URL-safe: replace '+' with '-', '/' with '_', remove '=' padding
    const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return urlSafeBase64;
  } catch (error) {
    console.error("Failed to encode config:", error);
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
    try {
      // Use our safe cross-platform base64 decoder
      const binaryString = safeBase64Decode(encodedString);
      
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
        /* eslint-disable @typescript-eslint/no-unused-vars */
        } catch (decompressionError) {
        /* eslint-enable @typescript-eslint/no-unused-vars */
           // console.error("Pako decompression error:", decompressionError);
          return null;
        }
        
        // Check if decompressed data is valid before parsing
        if (!decompressed || typeof decompressed !== 'string' || 
            decompressed === 'undefined' || decompressed.trim() === '') {
          // console.error("Invalid decompressed data:", decompressed);
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
            fontFamily: config.fontFamily || 'var(--font-custom), Arial, sans-serif',
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