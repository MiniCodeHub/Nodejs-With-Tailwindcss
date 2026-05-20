import { useState } from 'react';

interface FileItem {
  name: string;
  type: 'folder' | 'file';
  children?: FileItem[];
}

const fileTree: FileItem[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          {
            name: 'Navbar.tsx',
            type: 'file',
          },
          {
            name: 'Button.tsx',
            type: 'file',
          },
          {
            name: 'Sidebar.tsx',
            type: 'file',
          },
        ],
      },
      {
        name: 'pages',
        type: 'folder',
        children: [
          {
            name: 'Home.tsx',
            type: 'file',
          },
          {
            name: 'About.tsx',
            type: 'file',
          },
        ],
      },
      {
        name: 'App.tsx',
        type: 'file',
      },
    ],
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      {
        name: 'logo.png',
        type: 'file',
      },
      {
        name: 'favicon.ico',
        type: 'file',
      },
    ],
  },
  {
    name: 'package.json',
    type: 'file',
  },
  {
    name: 'tailwind.config.js',
    type: 'file',
  },
];

interface TreeProps {
  items: FileItem[];
  level?: number;
}

function FileTree({
  items,
  level = 0,
}: TreeProps) {

  const [openFolders, setOpenFolders] =
    useState<Record<string, boolean>>({});

  const toggleFolder = (path: string) => {

    setOpenFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <div className="space-y-1">
      
      {items.map((item, index) => {

        const path =
          `${level}-${index}-${item.name}`;

        const isOpen =
          openFolders[path];

        return (
          <div key={path}>
            
            {/* Item */}
            <div
              onClick={() =>
                item.type === 'folder' &&
                toggleFolder(path)
              }
              className="
                flex
                items-center
                gap-3
                px-3
                py-2
                rounded-lg
                hover:bg-gray-800
                transition
                cursor-pointer
                select-none
              "
              style={{
                paddingLeft:
                  `${level * 20 + 12}px`,
              }}
            >
              {/* Icon */}
              <span className="text-lg">
                {item.type === 'folder'
                  ? isOpen
                    ? '📂'
                    : '📁'
                  : '📄'}
              </span>

              {/* Name */}
              <span className="text-gray-200">
                {item.name}
              </span>
            </div>

            {/* Children */}
            {item.type === 'folder' &&
              isOpen &&
              item.children && (
                <div className="ml-2 border-l border-gray-700">
                  <FileTree
                    items={item.children}
                    level={level + 1}
                  />
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      
      <div className="w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-800">
          
          <h1 className="text-3xl font-bold">
            File Tree Explorer
          </h1>

          <p className="text-gray-400 mt-2">
            React + Tailwind Recursive Folder UI
          </p>
        </div>

        {/* Tree */}
        <div className="p-5">
          <FileTree items={fileTree} />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 text-sm text-gray-500 flex flex-wrap gap-4">
          <span>Recursive Components</span>
          <span>Collapsible Folders</span>
          <span>Nested Data Structures</span>
          <span>Tree Rendering</span>
        </div>
      </div>
    </div>
  );
}