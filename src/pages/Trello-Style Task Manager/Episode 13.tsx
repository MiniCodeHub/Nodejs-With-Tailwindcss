import { useState } from "react";

type Label =
  | "Frontend"
  | "Backend"
  | "Bug"
  | "Urgent"
  | "Design";

type Task = {
  id: number;
  title: string;
  labels: Label[];
};

const availableLabels: Label[] = [
  "Frontend",
  "Backend",
  "Bug",
  "Urgent",
  "Design",
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Create Login Page",
    labels: ["Frontend", "Urgent"],
  },
  {
    id: 2,
    title: "Fix Authentication API",
    labels: ["Backend", "Bug"],
  },
  {
    id: 3,
    title: "Design Dashboard",
    labels: ["Frontend", "Design"],
  },
  {
    id: 4,
    title: "Fix Mobile Layout",
    labels: ["Frontend", "Bug"],
  },
  {
    id: 5,
    title: "Create Database Schema",
    labels: ["Backend"],
  },
];

export default function App() {
  const [tasks, setTasks] =
    useState<Task[]>(initialTasks);

  const [selectedFilter, setSelectedFilter] =
    useState<Label | "All">("All");

  const [selectedTask, setSelectedTask] =
    useState<number | null>(null);

  const [newLabel, setNewLabel] =
    useState<Label>("Frontend");

  function toggleLabel(
    taskId: number,
    label: Label
  ) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const hasLabel =
          task.labels.includes(label);

        return {
          ...task,
          labels: hasLabel
            ? task.labels.filter(
                (item) => item !== label
              )
            : [...task.labels, label],
        };
      })
    );
  }

  function addLabel() {
    if (selectedTask === null) {
      return;
    }

    toggleLabel(
      selectedTask,
      newLabel
    );
  }

  const filteredTasks =
    selectedFilter === "All"
      ? tasks
      : tasks.filter((task) =>
          task.labels.includes(
            selectedFilter
          )
        );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            TaskFlow
          </h1>

          <p className="text-slate-400 mt-2">
            Manage tasks using labels and filters.
          </p>

        </div>


        {/* Filters */}

        <div className="mb-8">

          <h2 className="text-lg font-semibold mb-3">
            Filter Tasks
          </h2>

          <div className="flex flex-wrap gap-2">

            <button
              onClick={() =>
                setSelectedFilter("All")
              }
              className={`
                px-4 py-2 rounded-lg
                transition
                ${
                  selectedFilter === "All"
                    ? "bg-blue-600"
                    : "bg-slate-800 hover:bg-slate-700"
                }
              `}
            >
              All
            </button>

            {availableLabels.map(
              (label) => (

                <button
                  key={label}
                  onClick={() =>
                    setSelectedFilter(label)
                  }
                  className={`
                    px-4 py-2 rounded-lg
                    transition
                    ${
                      selectedFilter === label
                        ? "bg-blue-600"
                        : "bg-slate-800 hover:bg-slate-700"
                    }
                  `}
                >
                  {label}
                </button>

              )
            )}

          </div>

        </div>


        {/* Task Grid */}

        <div className="grid md:grid-cols-2 gap-5">

          {filteredTasks.map((task) => (

            <div
              key={task.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >

              <div className="flex justify-between items-start">

                <h2 className="text-lg font-semibold">
                  {task.title}
                </h2>

                <button
                  onClick={() =>
                    setSelectedTask(
                      selectedTask === task.id
                        ? null
                        : task.id
                    )
                  }
                  className="text-slate-400 hover:text-white"
                >
                  Edit
                </button>

              </div>


              {/* Labels */}

              <div className="flex flex-wrap gap-2 mt-4">

                {task.labels.length === 0 ? (

                  <span className="text-sm text-slate-500">
                    No labels
                  </span>

                ) : (

                  task.labels.map(
                    (label) => (

                      <span
                        key={label}
                        className={`
                          px-2.5 py-1
                          rounded-full
                          text-xs
                          font-medium

                          ${
                            label === "Urgent"
                              ? "bg-red-500/20 text-red-400"
                              : label === "Bug"
                              ? "bg-orange-500/20 text-orange-400"
                              : label === "Backend"
                              ? "bg-purple-500/20 text-purple-400"
                              : label === "Design"
                              ? "bg-pink-500/20 text-pink-400"
                              : "bg-blue-500/20 text-blue-400"
                          }
                        `}
                      >
                        {label}
                      </span>

                    )
                  )

                )}

              </div>


              {/* Label Editor */}

              {selectedTask === task.id && (

                <div className="mt-5 pt-5 border-t border-slate-800">

                  <p className="text-sm text-slate-400 mb-3">
                    Manage Labels
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {availableLabels.map(
                      (label) => {

                        const active =
                          task.labels.includes(
                            label
                          );

                        return (
                          <button
                            key={label}
                            onClick={() =>
                              toggleLabel(
                                task.id,
                                label
                              )
                            }
                            className={`
                              px-3 py-2
                              rounded-lg
                              text-sm
                              border
                              transition

                              ${
                                active
                                  ? "bg-blue-600 border-blue-500"
                                  : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                              }
                            `}
                          >
                            {active
                              ? "✓ "
                              : "+ "}
                            {label}
                          </button>
                        );
                      }
                    )}

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>


        {/* Empty State */}

        {filteredTasks.length === 0 && (

          <div className="text-center py-16">

            <p className="text-slate-400">
              No tasks match this label.
            </p>

            <button
              onClick={() =>
                setSelectedFilter("All")
              }
              className="mt-4 px-4 py-2 bg-blue-600 rounded-lg"
            >
              Show All Tasks
            </button>

          </div>

        )}

      </div>

    </div>
  );
}