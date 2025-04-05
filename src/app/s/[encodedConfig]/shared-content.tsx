'use client';

import SharedView from '@/components/SharedView';
import { ThemeProvider } from '@/hooks/useTheme';

// This is a client component that handles theme and error display
export default function SharedContent({ encodedConfig }: { encodedConfig: string }) {
  return (
    <ThemeProvider>
      <SharedView encodedConfig={encodedConfig} />
    </ThemeProvider>
  );
} 