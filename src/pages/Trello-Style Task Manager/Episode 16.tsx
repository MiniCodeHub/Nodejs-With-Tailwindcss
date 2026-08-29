import { useEffect, useState } from "react";

type Status =
  | "todo"
  | "in-progress"
  | "review"
  | "done";

type Priority =
  | "low"
  | "medium"
  | "high";

type Task = {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
};

const STORAGE_KEY = "taskflow_tasks";

const columns: {
  id: Status;
  title: string;
}[] = [
  {
    id: "todo",
    title: "To Do",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "review",
    title: "Review",
  },
  {
    id: "done",
    title: "Done",
  },
];

const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Design Login Page",
    description: "Create responsive login UI",
    status: "todo",
    priority: "high",
  },
  {
    id: 2,
    title: "Build API",
    description: "Create authentication API",
    status: "in-progress",
    priority: "high",
  },
  {
    id: 3,
    title: "Test Dashboard",
    description: "Check dashboard functionality",
    status: "review",
    priority: "medium",
  },
  {
    id: 4,
    title: "Setup Project",
    description: "Initialize React project",
    status: "done",
    priority: "low",
  },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks =
      localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
      return defaultTasks;
    }

    try {
      return JSON.parse(savedTasks);
    } catch {
      return defaultTasks;
    }
  });

  const [newTaskTitle, setNewTaskTitle] =
    useState("");

  const [newTaskDescription, setNewTaskDescription] =
    useState("");

  const [newTaskPriority, setNewTaskPriority] =
    useState<Priority>("medium");

  const [draggedTask, setDraggedTask] =
    useState<number | null>(null);

  // =========================
  // SAVE TASKS
  // =========================

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    );
  }, [tasks]);

  // =========================
  // ADD TASK
  // =========================

  function addTask() {
    if (!newTaskTitle.trim()) {
      return;
    }

    const task: Task = {
      id: Date.now(),

      title: newTaskTitle.trim(),

      description:
        newTaskDescription.trim(),

      status: "todo",

      priority: newTaskPriority,
    };

    setTasks((current) => [
      ...current,
      task,
    ]);

    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("medium");
  }

  // =========================
  // DELETE TASK
  // =========================

  function deleteTask(taskId: number) {
    setTasks((current) =>
      current.filter(
        (task) => task.id !== taskId
      )
    );
  }

  // =========================
  // DRAG START
  // =========================

  function handleDragStart(taskId: number) {
    setDraggedTask(taskId);
  }

  // =========================
  // DROP
  // =========================

  function handleDrop(status: Status) {
    if (draggedTask === null) {
      return;
    }

    setTasks((current) =>
      current.map((task) =>
        task.id === draggedTask
          ? {
              ...task,
              status,
            }
          : task
      )
    );

    setDraggedTask(null);
  }

  // =========================
  // CLEAR ALL TASKS
  // =========================

  function clearAllTasks() {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete all tasks?"
      );

    if (!confirmed) {
      return;
    }

    setTasks([]);
  }

  // =========================
  // PRIORITY STYLE
  // =========================

  function getPriorityStyle(
    priority: Priority
  ) {
    switch (priority) {
      case "low":
        return "bg-green-500/20 text-green-400";

      case "medium":
        return "bg-yellow-500/20 text-yellow-400";

      case "high":
        return "bg-red-500/20 text-red-400";
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =========================
          HEADER
      ========================== */}

      <header className="border-b border-slate-800 bg-slate-900">

        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-2xl font-bold">
                TaskFlow
              </h1>

              <p className="text-sm text-slate-400 mt-1">
                Your tasks are automatically saved
              </p>

            </div>

            <div className="flex items-center gap-4">

              <span className="text-sm text-slate-400">
                {tasks.length} tasks
              </span>

              <button
                onClick={clearAllTasks}
                className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition text-sm"
              >
                Clear All
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* =========================
          MAIN
      ========================== */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* =========================
            ADD TASK
        ========================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">

          <h2 className="text-lg font-semibold mb-4">
            Add New Task
          </h2>

          <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3">

            <input
              type="text"
              value={newTaskTitle}
              onChange={(event) =>
                setNewTaskTitle(
                  event.target.value
                )
              }
              placeholder="Task title"
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              value={newTaskDescription}
              onChange={(event) =>
                setNewTaskDescription(
                  event.target.value
                )
              }
              placeholder="Task description"
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            <select
              value={newTaskPriority}
              onChange={(event) =>
                setNewTaskPriority(
                  event.target.value as Priority
                )
              }
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
            >
              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>

          </div>

          <button
            onClick={addTask}
            className="mt-3 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-medium"
          >
            + Add Task
          </button>

        </div>

        {/* =========================
            KANBAN BOARD
        ========================== */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

          {columns.map((column) => {

            const columnTasks =
              tasks.filter(
                (task) =>
                  task.status === column.id
              );

            return (
              <div
                key={column.id}
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={() =>
                  handleDrop(column.id)
                }
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-h-[500px]"
              >

                {/* COLUMN HEADER */}

                <div className="flex items-center justify-between mb-5">

                  <h2 className="font-semibold">
                    {column.title}
                  </h2>

                  <span className="px-2 py-1 rounded-full bg-slate-800 text-xs text-slate-400">
                    {columnTasks.length}
                  </span>

                </div>

                {/* TASKS */}

                <div className="space-y-3">

                  {columnTasks.length === 0 && (

                    <div className="border border-dashed border-slate-700 rounded-xl p-8 text-center text-sm text-slate-500">
                      Drop tasks here
                    </div>

                  )}

                  {columnTasks.map(
                    (task) => (

                      <div
                        key={task.id}
                        draggable
                        onDragStart={() =>
                          handleDragStart(
                            task.id
                          )
                        }
                        className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-slate-600 transition"
                      >

                        <div className="flex justify-between gap-3">

                          <h3 className="font-medium">
                            {task.title}
                          </h3>

                          <button
                            onClick={() =>
                              deleteTask(
                                task.id
                              )
                            }
                            className="text-slate-500 hover:text-red-400"
                          >
                            ×
                          </button>

                        </div>

                        {task.description && (

                          <p className="text-sm text-slate-400 mt-2">
                            {task.description}
                          </p>

                        )}

                        <div className="flex items-center justify-between mt-4">

                          <span
                            className={`text-xs px-2.5 py-1 rounded-full ${getPriorityStyle(
                              task.priority
                            )}`}
                          >
                            {task.priority
                              .charAt(0)
                              .toUpperCase()
                              +
                              task.priority.slice(1)}
                          </span>

                          <span className="text-xs text-slate-600">
                            #{task.id}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>
            );
          })}

        </div>

      </main>

    </div>
  );
}

export default App;