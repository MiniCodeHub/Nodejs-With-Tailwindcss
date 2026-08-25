import { useMemo, useState } from "react";

type Priority = "Low" | "Medium" | "High" | "Urgent";

type Task = {
  id: number;
  title: string;
  labels: string[];
  dueDate: string;
  priority: Priority;
};

const priorityOrder: Record<Priority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Urgent: 4,
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete Login Page",
    labels: ["Frontend", "Urgent"],
    dueDate: "2026-08-25",
    priority: "Urgent",
  },
  {
    id: 2,
    title: "Fix Authentication API",
    labels: ["Backend", "Bug"],
    dueDate: "2026-08-26",
    priority: "High",
  },
  {
    id: 3,
    title: "Design Dashboard",
    labels: ["Frontend", "Design"],
    dueDate: "2026-08-28",
    priority: "Medium",
  },
  {
    id: 4,
    title: "Update Documentation",
    labels: ["Backend"],
    dueDate: "2026-08-30",
    priority: "Low",
  },
  {
    id: 5,
    title: "Fix Mobile Layout",
    labels: ["Frontend", "Bug"],
    dueDate: "2026-08-25",
    priority: "High",
  },
];

const priorityStyles: Record<Priority, string> = {
  Low: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  Medium: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Urgent: "bg-red-500/20 text-red-400 border-red-500/30",
};

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(
    initialTasks
  );

  const [priorityFilter, setPriorityFilter] =
    useState<Priority | "All">("All");

  const [sortByPriority, setSortByPriority] =
    useState(false);

  const [newTaskTitle, setNewTaskTitle] =
    useState("");

  const [newTaskDate, setNewTaskDate] =
    useState(getToday());

  const [newTaskPriority, setNewTaskPriority] =
    useState<Priority>("Medium");

  function addTask() {
    if (!newTaskTitle.trim()) {
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      labels: [],
      dueDate: newTaskDate,
      priority: newTaskPriority,
    };

    setTasks((current) => [
      ...current,
      newTask,
    ]);

    setNewTaskTitle("");
    setNewTaskDate(getToday());
    setNewTaskPriority("Medium");
  }

  function updateTaskPriority(
    taskId: number,
    priority: Priority
  ) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              priority,
            }
          : task
      )
    );
  }

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (priorityFilter !== "All") {
      result = result.filter(
        (task) =>
          task.priority === priorityFilter
      );
    }

    if (sortByPriority) {
      result.sort(
        (a, b) =>
          priorityOrder[b.priority] -
          priorityOrder[a.priority]
      );
    }

    return result;
  }, [
    tasks,
    priorityFilter,
    sortByPriority,
  ]);

  const priorityCounts = useMemo(() => {
    return {
      Low: tasks.filter(
        (task) => task.priority === "Low"
      ).length,

      Medium: tasks.filter(
        (task) => task.priority === "Medium"
      ).length,

      High: tasks.filter(
        (task) => task.priority === "High"
      ).length,

      Urgent: tasks.filter(
        (task) => task.priority === "Urgent"
      ).length,
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            TaskFlow
          </h1>

          <p className="text-slate-400 mt-2">
            Manage tasks by priority.
          </p>

        </div>


        {/* PRIORITY SUMMARY */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          {(
            [
              "Low",
              "Medium",
              "High",
              "Urgent",
            ] as Priority[]
          ).map((priority) => (

            <button
              key={priority}
              onClick={() =>
                setPriorityFilter(priority)
              }
              className={`
                text-left
                p-5
                rounded-xl
                border
                transition

                ${
                  priorityStyles[priority]
                }

                ${
                  priorityFilter === priority
                    ? "ring-2 ring-white/30"
                    : ""
                }
              `}
            >

              <p className="text-sm opacity-70">
                {priority} Priority
              </p>

              <p className="text-3xl font-bold mt-2">
                {priorityCounts[priority]}
              </p>

              <p className="text-xs opacity-60 mt-1">
                tasks
              </p>

            </button>

          ))}

        </div>


        {/* ADD TASK */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">

          <h2 className="text-lg font-semibold mb-4">
            Add Task
          </h2>

          <div className="grid md:grid-cols-[1fr_190px_170px_auto] gap-3">

            <input
              value={newTaskTitle}
              onChange={(event) =>
                setNewTaskTitle(
                  event.target.value
                )
              }
              placeholder="Task title..."
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="date"
              value={newTaskDate}
              onChange={(event) =>
                setNewTaskDate(
                  event.target.value
                )
              }
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
            />

            <select
              value={newTaskPriority}
              onChange={(event) =>
                setNewTaskPriority(
                  event.target
                    .value as Priority
                )
              }
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
            >

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

              <option value="Urgent">
                Urgent
              </option>

            </select>

            <button
              onClick={addTask}
              className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
            >
              Add Task
            </button>

          </div>

        </div>


        {/* FILTER BAR */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">

          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

            <div>

              <h2 className="font-semibold">
                Priority Filter
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                {filteredTasks.length} task
                {filteredTasks.length !== 1
                  ? "s"
                  : ""}{" "}
                shown
              </p>

            </div>


            <div className="flex flex-wrap gap-2">

              <button
                onClick={() =>
                  setPriorityFilter("All")
                }
                className={`
                  px-4 py-2 rounded-lg
                  ${
                    priorityFilter === "All"
                      ? "bg-blue-600"
                      : "bg-slate-800 hover:bg-slate-700"
                  }
                `}
              >
                All
              </button>


              {(
                [
                  "Low",
                  "Medium",
                  "High",
                  "Urgent",
                ] as Priority[]
              ).map((priority) => (

                <button
                  key={priority}
                  onClick={() =>
                    setPriorityFilter(
                      priority
                    )
                  }
                  className={`
                    px-4 py-2 rounded-lg
                    ${
                      priorityFilter ===
                      priority
                        ? "bg-blue-600"
                        : "bg-slate-800 hover:bg-slate-700"
                    }
                  `}
                >
                  {priority}
                </button>

              ))}

            </div>

          </div>


          <button
            onClick={() =>
              setSortByPriority(
                !sortByPriority
              )
            }
            className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
          >
            {sortByPriority
              ? "Priority Sort: ON"
              : "Sort by Priority"}
          </button>

        </div>


        {/* TASK LIST */}

        <div className="space-y-4">

          {filteredTasks.length === 0 && (

            <div className="text-center py-16 text-slate-500">
              No tasks found for this priority.
            </div>

          )}


          {filteredTasks.map((task) => (

            <div
              key={task.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* TASK INFO */}

                <div>

                  <div className="flex items-center gap-3">

                    <h3 className="text-lg font-semibold">
                      {task.title}
                    </h3>

                    <span
                      className={`
                        px-2.5
                        py-1
                        rounded-full
                        border
                        text-xs
                        font-medium
                        ${priorityStyles[
                          task.priority
                        ]}
                      `}
                    >
                      {task.priority}
                    </span>

                  </div>


                  <div className="flex flex-wrap gap-2 mt-3">

                    {task.labels.map(
                      (label) => (

                        <span
                          key={label}
                          className="px-2 py-1 rounded-full text-xs bg-slate-800 text-slate-400"
                        >
                          {label}
                        </span>

                      )
                    )}

                  </div>


                  <p className="text-sm text-slate-500 mt-3">
                    Due: {task.dueDate}
                  </p>

                </div>


                {/* PRIORITY CONTROL */}

                <div>

                  <label className="block text-xs text-slate-500 mb-2">
                    Change Priority
                  </label>

                  <select
                    value={task.priority}
                    onChange={(event) =>
                      updateTaskPriority(
                        task.id,
                        event.target
                          .value as Priority
                      )
                    }
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none"
                  >

                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Urgent">
                      Urgent
                    </option>

                  </select>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}