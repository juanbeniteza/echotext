'use client';

import { use } from 'react';
import SharedView from '../../../components/SharedView';
import { ThemeProvider } from '../../../hooks/useTheme';

// This is a Client Component that handles the dynamic route with theme support
export default function SharedPage({ params }: { params: { encodedConfig: string } }) {
  // Use the React.use pattern for handling params in Client Components
  // This properly handles the params promise unwrapping
  const resolvedParams = use(Promise.resolve(params));
  
  return (
    <ThemeProvider>
      <SharedView encodedConfig={resolvedParams.encodedConfig} />
    </ThemeProvider>
  );
} 