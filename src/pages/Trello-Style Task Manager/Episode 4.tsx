import { useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
};

type List = {
  id: number;
  title: string;
  tasks: Task[];
};

export default function App() {
  const [lists, setLists] = useState<List[]>([
    {
      id: 1,
      title: "To Do",
      tasks: [],
    },
    {
      id: 2,
      title: "In Progress",
      tasks: [],
    },
    {
      id: 3,
      title: "Done",
      tasks: [],
    },
  ]);

  const addTask = (listId: number) => {
    const title = prompt("Task Title");

    if (!title) return;

    const description =
      prompt("Task Description") || "";

    setLists(
      lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: [
                ...list.tasks,
                {
                  id: Date.now(),
                  title,
                  description,
                },
              ],
            }
          : list
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        TaskFlow
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-slate-900 rounded-2xl p-5 border border-slate-800"
          >
            <div className="flex justify-between mb-5">
              <h2 className="text-xl font-bold">
                {list.title}
              </h2>

              <span className="bg-cyan-500 px-3 py-1 rounded-full text-sm">
                {list.tasks.length}
              </span>
            </div>

            <div className="space-y-4">

              {list.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-800 p-4 rounded-xl"
                >
                  <h3 className="font-semibold">
                    {task.title}
                  </h3>

                  <p className="text-slate-400 text-sm mt-2">
                    {task.description}
                  </p>
                </div>
              ))}

            </div>

            <button
              onClick={() => addTask(list.id)}
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