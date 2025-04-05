import React from 'react';
import { ShareConfig } from '@/lib/sharing'; // Revert to alias path
// We'll need a syntax highlighting component eventually,
// but for now, just display the code in a pre tag.
// Example using a placeholder or basic styling:

interface CodePreviewProps {
  config: ShareConfig;
  readOnly?: boolean; // Flag to indicate if it's just for display
}

const CodePreview: React.FC<CodePreviewProps> = ({ config, readOnly }) => {
  // TODO: Implement proper syntax highlighting using config.language and config.theme
  // TODO: Apply config.fontFamily, config.fontSize, config.padding etc.

  // Basic structure for now
  return (
    <div
      className="p-4 rounded-lg shadow-lg bg-white" // Basic container
      style={{
        padding: '16px',
      }}
    >
      <pre
        style={{
          fontSize: `${config.fontSize}px`,
          fontFamily: config.fontFamily || 'var(--font-custom), monospace',
          // Apply theme background/text color later
        }}
      >
        <code>
          {/* Display the text content */}
          {config.text}
        </code>
      </pre>
      {/* Maybe add info about the settings used? */}
      {readOnly && (
         <p className="text-xs text-gray-500 mt-2 font-custom">
             Shared content (Read-only)
         </p>
      )}
    </div>
  );
};

export default CodePreview; 