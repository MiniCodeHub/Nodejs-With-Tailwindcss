import { useState } from 'react';
import { marked } from 'marked';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(`# Live Markdown Preview

## Heading Example

**Bold Text**

*Italic Text*

- List Item One
- List Item Two
- List Item Three
`);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      
      {/* Left - Editor */}
      <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4">
          Markdown Input
        </h2>

        <textarea
          value={markdown}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setMarkdown(e.target.value)
          }
          className="w-full h-[70vh] bg-gray-800 p-4 rounded-lg outline-none resize-none"
        />
      </div>

      {/* Right - Preview */}
      <div className="w-full md:w-1/2 p-6 overflow-auto">
        <h2 className="text-xl font-bold mb-4">
          Live Preview
        </h2>

        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: marked(markdown) as string,
          }}
        />
      </div>
    </div>
  );
};

export default App;