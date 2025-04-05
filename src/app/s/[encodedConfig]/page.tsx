import { use } from 'react';
import SharedView from '../../../components/SharedView';

// This is a Server Component that handles the dynamic route
export default function SharedPage({ params }: { params: { encodedConfig: string } }) {
  // Use the React.use pattern for handling params in Server Components
  // This properly handles the params promise unwrapping
  const resolvedParams = use(Promise.resolve(params));
  
  return (
    <SharedView encodedConfig={resolvedParams.encodedConfig} />
  );
} 