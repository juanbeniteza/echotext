'use client';

import { useParams } from 'next/navigation';
import SharedContent from './shared-content';

// Using useParams hook to get route parameters in a client component
export default function SharedPage() {
  // Use Next.js useParams hook to get the route parameters
  const params = useParams();
  const encodedConfig = params.encodedConfig as string;
  
  return <SharedContent encodedConfig={encodedConfig} />;
} 