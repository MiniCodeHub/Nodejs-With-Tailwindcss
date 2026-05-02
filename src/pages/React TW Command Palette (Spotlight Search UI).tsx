import { useEffect, useState } from 'react';

interface Command {
  id: number;
  title: string;
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const commands: Command[] = [
    { id: 1, title: 'Open Dashboard' },
    { id: 2, title: 'Go to Profile' },
    { id: 3, title: 'View Analytics' },
    { id: 4, title: 'Create Project' },
    { id: 5, title: 'Settings' },
    { id: 6, title: 'Notifications' },
    { id: 7, title: 'Team Members' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      // Escape
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredCommands = commands.filter((command) =>
    command.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Custom Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease;
        }
      `}</style>

      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white px-4">
        
        {/* Main Content */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            Command Palette
          </h1>

          <p className="text-gray-400 text-lg mb-6">
            Press Ctrl + K to open
          </p>

          <button
            onClick={() => setOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Open Palette
          </button>
        </div>

        {/* Overlay */}
        {open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32 px-4 z-50">
            
            {/* Palette */}
            <div className="w-full max-w-2xl bg-gray-800 rounded-2xl overflow-hidden shadow-2xl animate-fadeIn border border-gray-700">
              
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full px-5 py-4 bg-gray-900 text-white outline-none border-b border-gray-700 text-lg"
              />

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((command) => (
                    <button
                      key={command.id}
                      onClick={() => {
                        alert(`Selected: ${command.title}`);
                        setOpen(false);
                      }}
                      className="w-full text-left px-5 py-4 hover:bg-gray-700 transition border-b border-gray-700/50"
                    >
                      {command.title}
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-4 text-gray-400">
                    No results found
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 text-sm text-gray-500 border-t border-gray-700 flex justify-between">
                <span>ESC to close</span>
                <span>{filteredCommands.length} results</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}