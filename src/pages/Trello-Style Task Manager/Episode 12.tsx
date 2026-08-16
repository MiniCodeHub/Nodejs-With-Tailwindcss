import { useState } from "react";

type Task = {
  id: number;
  title: string;
  priority: "Low" | "Medium" | "High";
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Design Landing Page",
    priority: "High",
  },
  {
    id: 2,
    title: "Build Authentication",
    priority: "High",
  },
  {
    id: 3,
    title: "Create Dashboard",
    priority: "Medium",
  },
  {
    id: 4,
    title: "Write Documentation",
    priority: "Low",
  },
  {
    id: 5,
    title: "Deploy Application",
    priority: "Medium",
  },
];

export default function App() {
  const [tasks, setTasks] =
    useState<Task[]>(initialTasks);

  const [draggedId, setDraggedId] =
    useState<number | null>(null);

  const [dragOverId, setDragOverId] =
    useState<number | null>(null);

  function handleDragStart(id: number) {
    setDraggedId(id);
  }

  function handleDragOver(
    event: React.DragEvent,
    id: number
  ) {
    event.preventDefault();

    setDragOverId(id);
  }

  function handleDrop(
    event: React.DragEvent,
    targetId: number
  ) {
    event.preventDefault();

    if (
      draggedId === null ||
      draggedId === targetId
    ) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    setTasks((currentTasks) => {

      const draggedTask =
        currentTasks.find(
          (task) => task.id === draggedId
        );

      if (!draggedTask) {
        return currentTasks;
      }

      const remainingTasks =
        currentTasks.filter(
          (task) => task.id !== draggedId
        );

      const targetIndex =
        remainingTasks.findIndex(
          (task) => task.id === targetId
        );

      remainingTasks.splice(
        targetIndex,
        0,
        draggedTask
      );

      return remainingTasks;
    });

    setDraggedId(null);
    setDragOverId(null);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  function getPriorityStyle(
    priority: Task["priority"]
  ) {
    if (priority === "High") {
      return "bg-red-500/20 text-red-400";
    }

    if (priority === "Medium") {
      return "bg-yellow-500/20 text-yellow-400";
    }

    return "bg-green-500/20 text-green-400";
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-bold">
          TaskFlow
        </h1>

        <p className="text-slate-400 mt-2 mb-8">
          Drag and drop tasks to reorder them.
        </p>

        <div className="space-y-3">

          {tasks.map((task, index) => {

            const isDragging =
              draggedId === task.id;

            const isDragOver =
              dragOverId === task.id;

            return (
              <div
                key={task.id}
                draggable
                onDragStart={() =>
                  handleDragStart(task.id)
                }
                onDragOver={(event) =>
                  handleDragOver(
                    event,
                    task.id
                  )
                }
                onDrop={(event) =>
                  handleDrop(
                    event,
                    task.id
                  )
                }
                onDragEnd={handleDragEnd}
                className={`
                  p-5
                  rounded-xl
                  border
                  transition-all
                  cursor-grab
                  select-none

                  ${
                    isDragging
                      ? "opacity-40 scale-95"
                      : "opacity-100"
                  }

                  ${
                    isDragOver
                      ? "border-blue-500 translate-y-1"
                      : "border-slate-800"
                  }

                  bg-slate-900
                  hover:bg-slate-800
                `}
              >

                <div className="flex items-center gap-4">

                  {/* Drag Handle */}

                  <div className="text-slate-500 text-xl">
                    ⋮⋮
                  </div>

                  {/* Position */}

                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm text-slate-400">
                    {index + 1}
                  </div>

                  {/* Task */}

                  <div className="flex-1">

                    <h2 className="font-semibold">
                      {task.title}
                    </h2>

                    <span
                      className={`
                        inline-block
                        mt-2
                        px-2
                        py-1
                        rounded-md
                        text-xs
                        ${getPriorityStyle(
                          task.priority
                        )}
                      `}
                    >
                      {task.priority} Priority
                    </span>

                  </div>

                  {/* Move Indicator */}

                  <div className="text-slate-600">
                    ↕
                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* Instructions */}

        <div className="mt-8 p-5 rounded-xl bg-slate-900 border border-slate-800">

          <h3 className="font-semibold">
            How to reorder
          </h3>

          <ul className="text-sm text-slate-400 mt-3 space-y-2">

            <li>
              1. Click and hold a task.
            </li>

            <li>
              2. Drag it over another task.
            </li>

            <li>
              3. Release to change its position.
            </li>

          </ul>

        </div>

      </div>

    </div>
  );
}