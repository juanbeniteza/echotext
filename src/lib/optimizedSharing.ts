import pako from 'pako';
import { Effect } from '../types';
import { ShareConfig } from './sharing';

// Constants for default values (these won't be encoded in the URL)
const DEFAULT_FONT_SIZE = 36;
const DEFAULT_FONT_FAMILY = 'var(--font-custom), Arial, sans-serif';
const DEFAULT_SPACING = 1;
const DEFAULT_REPEAT = 1;

/**
 * Cross-platform safe base64 encoding function
 */
function safeBase64Encode(data: string): string {
  try {
    // Try browser's built-in btoa first
    return btoa(data);
  } catch (e) {
    // If btoa fails or is unavailable, use a manual approach
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    
    for (let i = 0; i < data.length; i += 3) {
      const chunk = (data.charCodeAt(i) << 16) | 
                   ((i + 1 < data.length) ? data.charCodeAt(i + 1) << 8 : 0) | 
                   ((i + 2 < data.length) ? data.charCodeAt(i + 2) : 0);
      
      result += chars[(chunk >> 18) & 63];
      result += chars[(chunk >> 12) & 63];
      result += (i + 1 < data.length) ? chars[(chunk >> 6) & 63] : '=';
      result += (i + 2 < data.length) ? chars[chunk & 63] : '=';
    }
    
    return result;
  }
}

/**
 * Cross-platform safe base64 decoding function
 */
function safeBase64Decode(base64: string): string {
  try {
    // Try browser's built-in atob first
    return atob(base64);
  } catch (e) {
    // If atob fails or is unavailable, use a manual approach
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    const lookup = new Uint8Array(256);
    
    for (let i = 0; i < chars.length; i++) {
      lookup[chars.charCodeAt(i)] = i;
    }
    
    const len = base64.length;
    let bufferLength = base64.length * 0.75;
    let p = 0;
    let encoded1, encoded2, encoded3, encoded4;
    
    if (base64[base64.length - 1] === '=') {
      bufferLength--;
      if (base64[base64.length - 2] === '=') {
        bufferLength--;
      }
    }
    
    const bytes = new Array(bufferLength);
    
    for (let i = 0; i < len; i += 4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i + 1)];
      encoded3 = lookup[base64.charCodeAt(i + 2)];
      encoded4 = lookup[base64.charCodeAt(i + 3)];
      
      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    
    let result = '';
    for (let i = 0; i < bytes.length; i++) {
      result += String.fromCharCode(bytes[i]);
    }
    
    return result;
  }
}

/**
 * Parse a color string to a number, safely handling different formats
 */
function colorToNumber(color: string): number {
  // Remove the # if present
  let hexColor = color.replace(/^#/, '');
  
  // Handle short hex format (#RGB)
  if (hexColor.length === 3) {
    hexColor = hexColor[0] + hexColor[0] + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2];
  }
  
  // Ensure we have a valid hex color
  if (!/^[0-9A-Fa-f]{6}$/.test(hexColor)) {
    return 0; // Default to black if invalid
  }
  
  return parseInt(hexColor, 16);
}

/**
 * Convert a color number back to a hex string
 */
function numberToColor(num: number): string {
  // Ensure num is a valid number
  if (typeof num !== 'number' || isNaN(num)) {
    return '#000000'; // Default to black
  }
  
  // Convert to hex and pad to 6 digits
  let hexColor = Math.max(0, Math.min(0xFFFFFF, num)).toString(16);
  hexColor = hexColor.padStart(6, '0');
  
  return `#${hexColor}`;
}

/**
 * Efficiently encodes a ShareConfig object into a shorter URL-safe string.
 * This function creates a minimal representation by omitting constant values.
 * @param config The configuration object to encode
 * @returns A shorter URL-safe string
 */
export function encodeConfigCompact(config: ShareConfig): string {
  try {
    // Create a flags value to store boolean flags more efficiently
    // bit 0: isBold, bit 1: isItalic, bit 2: isStrikethrough
    let flags = 0;
    if (config.isBold) flags |= 1;
    if (config.isItalic) flags |= 2;
    if (config.isStrikethrough) flags |= 4;
    
    // Create a compact binary representation
    // Only include values that actually change
    const parts: (string | number)[] = [
      config.text,
      config.effect === null ? 0 : getEffectIndex(config.effect as Effect),
      colorToNumber(config.color), // Safely convert color to number
      flags
    ];
    
    // Only add other properties if they differ from defaults
    if (config.repeat !== DEFAULT_REPEAT) {
      parts.push(config.repeat);
    }
    
    // Convert to minimum-sized JSON and compress
    const minifiedData = JSON.stringify(parts);
    const compressed = pako.deflate(minifiedData);
    
    // Convert to a binary string
    let binaryString = '';
    for (let i = 0; i < compressed.length; i++) {
      binaryString += String.fromCharCode(compressed[i]);
    }
    
    // Convert to base64 and make URL-safe
    const base64 = safeBase64Encode(binaryString);
    const urlSafe = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    
    return urlSafe;
  } catch (error) {
    console.error("Failed to encode config compactly:", error);
    return '';
  }
}

/**
 * Decodes a compact URL-safe string back into a ShareConfig object.
 * @param encoded The compact encoded string
 * @returns The decoded ShareConfig object, or null if decoding fails
 */
export function decodeConfigCompact(encoded: string): ShareConfig | null {
  if (!encoded) return null;
  
  try {
    // Add padding if needed
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(
      base64.length + (4 - (base64.length % 4 || 4)) % 4,
      '='
    );
    
    // Decode base64
    const binaryString = safeBase64Decode(paddedBase64);
    
    // Convert to Uint8Array for decompression
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Decompress and parse with better error handling
    try {
      const decompressed = pako.inflate(bytes, { to: 'string' });
      
      // Validate the decompressed content before parsing
      if (!decompressed || typeof decompressed !== 'string' || 
          decompressed.includes('undefined') || decompressed.trim() === '') {
        // console.error("Invalid decompressed data:", decompressed);
        return null;
      }
      
      const parts = JSON.parse(decompressed);
      
      // Ensure parts is an array with valid entries
      if (!Array.isArray(parts) || parts.length < 4) {
        console.error("Invalid encoded data structure:", parts);
        return null;
      }
      
      // Read flags - ensure it's a number
      const flags = Number(parts[3] || 0);
      
      // Reconstruct config object with defaults
      const config: ShareConfig = {
        text: String(parts[0] || ''),
        effect: Number(parts[1]) === 0 ? null : getEffectFromIndex(Number(parts[1])),
        color: numberToColor(Number(parts[2] || 0)),
        fontSize: DEFAULT_FONT_SIZE,
        fontFamily: DEFAULT_FONT_FAMILY,
        spacing: DEFAULT_SPACING,
        repeat: parts.length >= 5 ? Number(parts[4] || DEFAULT_REPEAT) : DEFAULT_REPEAT,
        isBold: !!(flags & 1),
        isItalic: !!(flags & 2),
        isStrikethrough: !!(flags & 4)
      };
      
      return config;
    } catch (innerError) {
      console.error("Error parsing or handling decompressed data:", innerError);
      
      // Try falling back to legacy decoder
      return null;
    }
  } catch (error) {
    console.error("Failed to decode compact config:", error);
    return null;
  }
}

/**
 * Converts an Effect enum value to a numeric index for more compact encoding
 */
function getEffectIndex(effect: Effect): number {
  const effectMap: Record<Effect, number> = {
    [Effect.NONE]: 0,
    [Effect.SHAKE]: 1,
    [Effect.RIPPLE]: 2,
    [Effect.JITTER]: 3,
    [Effect.PULSE]: 4,
    [Effect.WAVE]: 5
  };
  return effectMap[effect] || 0;
}

/**
 * Converts a numeric index back to an Effect enum value
 */
function getEffectFromIndex(index: number): Effect {
  const effects = [
    Effect.NONE,
    Effect.SHAKE,
    Effect.RIPPLE,
    Effect.JITTER,
    Effect.PULSE,
    Effect.WAVE
  ];
  return index >= 0 && index < effects.length ? effects[index] : Effect.NONE;
} 