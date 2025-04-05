import SharedView from '../../../components/SharedView';

// This is a Server Component that handles the dynamic route
export default function SharedPage({ params }: { params: { encodedConfig: string } }) {
  // Log encoded config (this will show in server logs)
  console.log("Server Component received params:", {
    encodedConfig: params.encodedConfig,
    type: typeof params.encodedConfig,
    length: params.encodedConfig?.length
  });
  
  return (
    <SharedView encodedConfig={params.encodedConfig} />
  );
} 