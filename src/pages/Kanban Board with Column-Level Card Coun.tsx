import React, { useState } from 'react';

interface Task {
  id: number;
  title: string;
}

interface Column {
  id: number;
  title: string;
  tasks: Task[];
}

interface ColumnProps {
  title: string;
  tasks: Task[];
}

function KanbanColumn({ title, tasks }: ColumnProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-5 shadow-lg">
      
      {/* Column Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">
          {title}
        </h2>

        <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-blue-500 transition"
          >
            <p className="text-white text-sm">
              {task.title}
            </p>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-gray-400 text-sm text-center py-6 border border-dashed border-gray-600 rounded-xl">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [columns] = useState<Column[]>([
    {
      id: 1,
      title: 'To Do',
      tasks: [
        { id: 1, title: 'Design landing page' },
        { id: 2, title: 'Create navbar component' },
      ],
    },
    {
      id: 2,
      title: 'In Progress',
      tasks: [
        { id: 3, title: 'Build authentication UI' },
      ],
    },
    {
      id: 3,
      title: 'Completed',
      tasks: [
        { id: 4, title: 'Setup Tailwind CSS' },
        { id: 5, title: 'Create project structure' },
      ],
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Kanban Board
        </h1>

        <p className="text-gray-400">
          React + Tailwind Task Management UI
        </p>
      </div>

      {/* Board */}
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            tasks={column.tasks}
          />
        ))}
      </div>
    </div>
  );
}