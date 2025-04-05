import { Effect } from '../types';

// Map effect enum to CSS class
export const getEffectClass = (effect: Effect): string => {
  switch (effect) {
    case Effect.SHAKE:
      return 'effect-shake';
    case Effect.RIPPLE:
      return 'effect-ripple';
    case Effect.JITTER:
      return 'effect-jitter';
    case Effect.NONE:
    default:
      return '';
  }
};

// Get a display name for each effect
export const getEffectName = (effect: Effect): string => {
  switch (effect) {
    case Effect.SHAKE:
      return 'Shake';
    case Effect.RIPPLE:
      return 'Ripple';
    case Effect.JITTER:
      return 'Jitter';
    case Effect.NONE:
      return 'None';
    default:
      return 'Unknown';
  }
};

// List all available effects for selection
export const availableEffects: Effect[] = [
  Effect.NONE,
  Effect.SHAKE,
  Effect.RIPPLE,
  Effect.JITTER,
];

// Get CSS style properties based on text configuration
export const getTextStyle = (
  color: string,
  fontSize: number,
  fontFamily: string,
  spacing: number,
): React.CSSProperties => {
  return {
    color,
    fontSize: `${fontSize}px`,
    fontFamily,
    letterSpacing: `${spacing}px`,
  };
}; 