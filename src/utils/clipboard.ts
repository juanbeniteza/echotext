/**
 * Copies the given text to the user's clipboard.
 * Uses the modern Clipboard API if available, falling back to execCommand.
 * 
 * @param text The text to copy.
 * @returns A promise that resolves to true if successful, false otherwise.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Modern Clipboard API (preferred)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy using Clipboard API:', err);
      // Fallthrough to try execCommand
    }
  }

  // Fallback using execCommand (less reliable, requires element selection)
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // Style to prevent visual disturbance
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  textArea.style.left = '-9999px';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let success = false;
  try {
    success = document.execCommand('copy');
    if (!success) {
        console.error('execCommand("copy") failed');
    }
  } catch (err) {
    console.error('Failed to copy using execCommand:', err);
  }

  document.body.removeChild(textArea);
  return success;
} 