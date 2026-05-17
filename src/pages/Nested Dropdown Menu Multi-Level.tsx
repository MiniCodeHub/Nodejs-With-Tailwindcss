import { useState } from 'react';

interface MenuItem {
  title: string;
  children?: MenuItem[];
}

const menuData: MenuItem[] = [
  {
    title: 'Dashboard',
  },
  {
    title: 'Projects',
    children: [
      {
        title: 'Web Apps',
        children: [
          { title: 'Portfolio Website' },
          { title: 'E-Commerce Store' },
        ],
      },
      {
        title: 'Mobile Apps',
        children: [
          { title: 'Fitness Tracker' },
          { title: 'Chat Application' },
        ],
      },
    ],
  },
  {
    title: 'Services',
    children: [
      { title: 'UI/UX Design' },
      { title: 'Frontend Development' },
      { title: 'Backend APIs' },
    ],
  },
  {
    title: 'Contact',
  },
];

interface DropdownProps {
  items: MenuItem[];
  level?: number;
}

function Dropdown({
  items,
  level = 0,
}: DropdownProps) {

  const [openIndex, setOpenIndex] =
    useState<number | null>(null);

  return (
    <div
      className={`
        ${
          level === 0
            ? 'relative w-72'
            : 'absolute left-full top-0 ml-2 w-64'
        }
      `}
    >
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
        
        {items.map((item, index) => {

          const hasChildren =
            item.children &&
            item.children.length > 0;

          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="relative"
            >
              {/* Menu Item */}
              <button
                onClick={() =>
                  setOpenIndex(
                    isOpen ? null : index
                  )
                }
                className="
                  w-full
                  flex
                  items-center
                  justify-between
                  px-5
                  py-4
                  text-left
                  text-white
                  hover:bg-gray-800
                  transition
                  border-b
                  border-gray-800
                  last:border-none
                "
              >
                <span>{item.title}</span>

                {hasChildren && (
                  <span
                    className={`
                      transition-transform
                      duration-300
                      ${
                        isOpen
                          ? 'rotate-90'
                          : ''
                      }
                    `}
                  >
                    ▶
                  </span>
                )}
              </button>

              {/* Nested Dropdown */}
              {hasChildren && isOpen && (
                <Dropdown
                  items={item.children!}
                  level={level + 1}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      
      <div className="text-center">
        
        <h1 className="text-4xl font-bold text-white mb-4">
          Nested Dropdown Menu
        </h1>

        <p className="text-gray-400 mb-10">
          React + Tailwind Multi-Level Navigation
        </p>

        <Dropdown items={menuData} />
      </div>
    </div>
  );
}