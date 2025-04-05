/**
 * Copy text to clipboard
 * @param text The text to copy
 * @returns Promise that resolves when text is copied
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

/**
 * Get expiration options in milliseconds
 */
export const expirationOptions = [
  { label: 'Never', value: 0 },
  { label: '1 hour', value: 60 * 60 * 1000 },
  { label: '24 hours', value: 24 * 60 * 60 * 1000 },
  { label: '7 days', value: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 days', value: 30 * 24 * 60 * 60 * 1000 },
]; 