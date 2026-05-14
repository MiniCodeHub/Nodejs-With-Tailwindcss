import { useRef, useState } from 'react';

export default function App() {
  const editorRef = useRef<HTMLDivElement>(null);

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    unorderedList: false,
  });

  // Execute formatting command
  const formatText = (command: string) => {
    document.execCommand(command);

    updateActiveStates();

    editorRef.current?.focus();
  };

  // Update active button states
  const updateActiveStates = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
    });
  };

  // Clear editor
  const clearEditor = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }

    setActiveFormats({
      bold: false,
      italic: false,
      unorderedList: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">
      
      <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-800">
          <h1 className="text-3xl font-bold">
            Rich Text Editor
          </h1>

          <p className="text-gray-400 mt-2">
            React + Tailwind Editor Without Any Library
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 p-5 border-b border-gray-800 bg-gray-900">
          
          {/* Bold */}
          <button
            onClick={() => formatText('bold')}
            className={`px-4 py-2 rounded-lg font-semibold transition
              ${
                activeFormats.bold
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
          >
            Bold
          </button>

          {/* Italic */}
          <button
            onClick={() => formatText('italic')}
            className={`px-4 py-2 rounded-lg font-semibold transition
              ${
                activeFormats.italic
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
          >
            Italic
          </button>

          {/* Bullet List */}
          <button
            onClick={() => formatText('insertUnorderedList')}
            className={`px-4 py-2 rounded-lg font-semibold transition
              ${
                activeFormats.unorderedList
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
          >
            Bullet List
          </button>

          {/* Clear */}
          <button
            onClick={clearEditor}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition font-semibold"
          >
            Clear
          </button>
        </div>

        {/* Editor */}
        <div className="p-6">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning={true}
            onKeyUp={updateActiveStates}
            onMouseUp={updateActiveStates}
            className="min-h-[350px] bg-gray-950 border border-gray-800 rounded-xl p-5 outline-none text-lg leading-8 focus:border-blue-500 transition"
            spellCheck={false}
          >
            Start typing here...
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 text-sm text-gray-500 flex flex-wrap gap-4">
          <span>Bold</span>
          <span>Italic</span>
          <span>Lists</span>
          <span>No External Library</span>
          <span>Content Editable API</span>
        </div>
      </div>
    </div>
  );
}