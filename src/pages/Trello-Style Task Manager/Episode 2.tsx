import { useState } from "react";

type Column = {
  id: number;
  title: string;
  tasks: string[];
};

export default function App() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 1,
      title: "To Do",
      tasks: [
        "Design Landing Page",
        "Create Login UI"
      ]
    },
    {
      id: 2,
      title: "In Progress",
      tasks: [
        "Setup Dashboard"
      ]
    },
    {
      id: 3,
      title: "Done",
      tasks: [
        "Create React Project"
      ]
    }
  ]);

  function addTask(columnId: number) {
    const title = prompt("Task Name");

    if (!title) return;

    setColumns(
      columns.map(column =>
        column.id === columnId
          ? {
              ...column,
              tasks: [
                ...column.tasks,
                title
              ]
            }
          : column
      )
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <header className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            TaskFlow
          </h1>

          <p className="text-slate-400 mt-2">
            Trello-style Task Manager
          </p>

        </div>

      </header>

      <div className="grid lg:grid-cols-3 gap-6">

        {columns.map(column => (

          <div
            key={column.id}
            className="bg-slate-900 rounded-2xl p-5 border border-slate-800"
          >

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-bold">
                {column.title}
              </h2>

              <span className="bg-cyan-500 px-3 py-1 rounded-full text-sm">
                {column.tasks.length}
              </span>

            </div>

            <div className="space-y-4">

              {column.tasks.map((task, index) => (

                <div
                  key={index}
                  className="bg-slate-800 rounded-xl p-4 hover:-translate-y-1 transition"
                >

                  <h3 className="font-semibold">
                    {task}
                  </h3>

                  <p className="text-slate-400 text-sm mt-2">
                    Task description
                  </p>

                </div>

              ))}

            </div>

            <button
              onClick={() => addTask(column.id)}
              className="mt-5 w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-semibold transition"
            >
              + Add Task
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}