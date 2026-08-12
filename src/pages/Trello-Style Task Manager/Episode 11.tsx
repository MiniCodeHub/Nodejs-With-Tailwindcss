import { useState } from "react";

type Subtask = {
  id: number;
  title: string;
  completed: boolean;
};

type Task = {
  id: number;
  title: string;
  subtasks: Subtask[];
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Design Landing Page",
    subtasks: [
      { id: 1, title: "Create wireframe", completed: true },
      { id: 2, title: "Design hero section", completed: true },
      { id: 3, title: "Create pricing section", completed: false },
      { id: 4, title: "Make responsive", completed: false },
    ],
  },
  {
    id: 2,
    title: "Build Authentication",
    subtasks: [
      { id: 5, title: "Create login form", completed: true },
      { id: 6, title: "Add validation", completed: false },
      { id: 7, title: "Connect API", completed: false },
    ],
  },
];

export default function App() {
  const [tasks, setTasks] =
    useState<Task[]>(initialTasks);

  const [selectedTask, setSelectedTask] =
    useState<number | null>(1);

  const [newSubtask, setNewSubtask] =
    useState("");

  function calculateProgress(task: Task) {
    if (task.subtasks.length === 0) {
      return 0;
    }

    const completed =
      task.subtasks.filter(
        (subtask) => subtask.completed
      ).length;

    return Math.round(
      (completed / task.subtasks.length) * 100
    );
  }

  function toggleSubtask(
    taskId: number,
    subtaskId: number
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(
                (subtask) =>
                  subtask.id === subtaskId
                    ? {
                        ...subtask,
                        completed:
                          !subtask.completed,
                      }
                    : subtask
              ),
            }
          : task
      )
    );
  }

  function addSubtask() {
    if (!newSubtask.trim()) {
      return;
    }

    if (selectedTask === null) {
      return;
    }

    const subtask: Subtask = {
      id: Date.now(),
      title: newSubtask.trim(),
      completed: false,
    };

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === selectedTask
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                subtask,
              ],
            }
          : task
      )
    );

    setNewSubtask("");
  }

  const selected =
    tasks.find(
      (task) => task.id === selectedTask
    ) ?? null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        TaskFlow
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Task List */}

        <div className="space-y-3">

          <h2 className="text-xl font-semibold mb-4">
            Tasks
          </h2>

          {tasks.map((task) => {

            const progress =
              calculateProgress(task);

            return (
              <button
                key={task.id}
                onClick={() =>
                  setSelectedTask(task.id)
                }
                className={`w-full text-left p-4 rounded-xl transition ${
                  selectedTask === task.id
                    ? "bg-blue-600"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
              >

                <div className="flex justify-between">

                  <span className="font-semibold">
                    {task.title}
                  </span>

                  <span className="text-sm">
                    {progress}%
                  </span>

                </div>

                <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </button>
            );
          })}

        </div>

        {/* Checklist */}

        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-6">

          {!selected ? (

            <p className="text-slate-400">
              Select a task.
            </p>

          ) : (

            <>

              <div className="flex justify-between items-center mb-6">

                <div>

                  <h2 className="text-2xl font-bold">
                    {selected.title}
                  </h2>

                  <p className="text-slate-400 mt-1">
                    {selected.subtasks.filter(
                      (item) => item.completed
                    ).length}
                    {" / "}
                    {selected.subtasks.length}
                    {" subtasks completed"}
                  </p>

                </div>

                <div className="text-3xl font-bold text-blue-400">
                  {calculateProgress(selected)}%
                </div>

              </div>

              {/* Progress */}

              <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-8">

                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${calculateProgress(
                      selected
                    )}%`,
                  }}
                />

              </div>

              {/* Subtasks */}

              <div className="space-y-3">

                {selected.subtasks.map(
                  (subtask) => (

                    <label
                      key={subtask.id}
                      className="flex items-center gap-3 bg-slate-800 p-4 rounded-lg cursor-pointer"
                    >

                      <input
                        type="checkbox"
                        checked={
                          subtask.completed
                        }
                        onChange={() =>
                          toggleSubtask(
                            selected.id,
                            subtask.id
                          )
                        }
                        className="w-5 h-5"
                      />

                      <span
                        className={
                          subtask.completed
                            ? "line-through text-slate-500"
                            : ""
                        }
                      >
                        {subtask.title}
                      </span>

                    </label>

                  )
                )}

              </div>

              {/* Add Subtask */}

              <div className="flex gap-3 mt-6">

                <input
                  value={newSubtask}
                  onChange={(e) =>
                    setNewSubtask(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSubtask();
                    }
                  }}
                  placeholder="Add a subtask..."
                  className="flex-1 bg-slate-800 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={addSubtask}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
                >
                  Add
                </button>

              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
}