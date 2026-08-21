import { useMemo, useState } from "react";

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
  dueDate: string;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete Login Page",
    labels: ["Frontend", "Urgent"],
    dueDate: "2026-08-21",
  },
  {
    id: 2,
    title: "Fix Authentication API",
    labels: ["Backend", "Bug"],
    dueDate: "2026-08-22",
  },
  {
    id: 3,
    title: "Design Dashboard",
    labels: ["Frontend", "Design"],
    dueDate: "2026-08-24",
  },
  {
    id: 4,
    title: "Write Documentation",
    labels: ["Backend"],
    dueDate: "2026-08-26",
  },
  {
    id: 5,
    title: "Fix Mobile Layout",
    labels: ["Frontend", "Bug"],
    dueDate: "2026-08-20",
  },
];

const today = "2026-08-21";

export default function App() {
  const [tasks, setTasks] =
    useState<Task[]>(initialTasks);

  const [selectedDate, setSelectedDate] =
    useState<string | null>(null);

  const [newTaskTitle, setNewTaskTitle] =
    useState("");

  const [newTaskDate, setNewTaskDate] =
    useState(today);

  const [showCalendar, setShowCalendar] =
    useState(false);

  function addTask() {
    if (!newTaskTitle.trim()) {
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      labels: [],
      dueDate: newTaskDate,
    };

    setTasks((current) => [
      ...current,
      newTask,
    ]);

    setNewTaskTitle("");
    setNewTaskDate(today);
  }

  function formatDate(dateString: string) {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  function isOverdue(dueDate: string) {
    return dueDate < today;
  }

  function isDueToday(dueDate: string) {
    return dueDate === today;
  }

  const filteredTasks = useMemo(() => {
    if (!selectedDate) {
      return tasks;
    }

    return tasks.filter(
      (task) =>
        task.dueDate === selectedDate
    );
  }, [tasks, selectedDate]);

  const groupedTasks = useMemo(() => {
    const groups: Record<
      string,
      Task[]
    > = {};

    filteredTasks.forEach((task) => {
      if (!groups[task.dueDate]) {
        groups[task.dueDate] = [];
      }

      groups[task.dueDate].push(task);
    });

    return groups;
  }, [filteredTasks]);

  const sortedDates =
    Object.keys(groupedTasks).sort();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              TaskFlow
            </h1>

            <p className="text-slate-400 mt-2">
              Manage tasks and deadlines.
            </p>

          </div>

          <button
            onClick={() =>
              setShowCalendar(!showCalendar)
            }
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          >
            {showCalendar
              ? "Hide Calendar"
              : "Show Calendar"}
          </button>

        </div>


        {/* ADD TASK */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">

          <h2 className="text-lg font-semibold mb-4">
            Add Task
          </h2>

          <div className="grid md:grid-cols-[1fr_200px_auto] gap-3">

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

            <button
              onClick={addTask}
              className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
            >
              Add Task
            </button>

          </div>

        </div>


        {/* CALENDAR */}

        {showCalendar && (

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-xl font-semibold">
                  Task Calendar
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Select a date to view its tasks.
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedDate(null)
                }
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Show All
              </button>

            </div>


            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">

              {sortedDates.map((date) => {

                const selected =
                  selectedDate === date;

                const count =
                  groupedTasks[date].length;

                return (

                  <button
                    key={date}
                    onClick={() =>
                      setSelectedDate(date)
                    }
                    className={`
                      text-left
                      p-4
                      rounded-xl
                      border
                      transition

                      ${
                        selected
                          ? "bg-blue-600 border-blue-500"
                          : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                      }
                    `}
                  >

                    <p className="text-sm text-slate-300">
                      {formatDate(date)}
                    </p>

                    <p className="text-2xl font-bold mt-2">
                      {count}
                    </p>

                    <p className="text-xs text-slate-400">
                      {count === 1
                        ? "task"
                        : "tasks"}
                    </p>

                  </button>

                );
              })}

            </div>

          </div>

        )}


        {/* DATE FILTER */}

        {selectedDate && (

          <div className="mb-5 flex items-center gap-3">

            <span className="text-slate-400">
              Showing tasks for:
            </span>

            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
              {formatDate(selectedDate)}
            </span>

            <button
              onClick={() =>
                setSelectedDate(null)
              }
              className="text-sm text-slate-400 hover:text-white"
            >
              Clear
            </button>

          </div>

        )}


        {/* TASKS */}

        <div className="space-y-8">

          {sortedDates.length === 0 && (

            <div className="text-center py-16 text-slate-500">
              No tasks found.
            </div>

          )}


          {sortedDates.map((date) => (

            <section key={date}>

              <div className="flex items-center gap-3 mb-4">

                <div className="h-px flex-1 bg-slate-800" />

                <h2 className="text-sm font-semibold text-slate-400">
                  {formatDate(date)}
                </h2>

                <div className="h-px flex-1 bg-slate-800" />

              </div>


              <div className="grid md:grid-cols-2 gap-4">

                {groupedTasks[date].map(
                  (task) => {

                    const overdue =
                      isOverdue(
                        task.dueDate
                      );

                    const dueToday =
                      isDueToday(
                        task.dueDate
                      );

                    return (

                      <div
                        key={task.id}
                        className={`
                          p-5
                          rounded-xl
                          border
                          bg-slate-900

                          ${
                            overdue
                              ? "border-red-500/50"
                              : dueToday
                              ? "border-yellow-500/50"
                              : "border-slate-800"
                          }
                        `}
                      >

                        <div className="flex justify-between gap-4">

                          <div>

                            <h3 className="font-semibold">
                              {task.title}
                            </h3>

                            <div className="flex flex-wrap gap-2 mt-3">

                              {task.labels.map(
                                (label) => (

                                  <span
                                    key={label}
                                    className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400"
                                  >
                                    {label}
                                  </span>

                                )
                              )}

                            </div>

                          </div>


                          <div className="text-right">

                            {overdue && (

                              <span className="block text-xs text-red-400">
                                Overdue
                              </span>

                            )}

                            {dueToday && (

                              <span className="block text-xs text-yellow-400">
                                Due Today
                              </span>

                            )}

                            <span className="block text-xs text-slate-500 mt-1">
                              {formatDate(
                                task.dueDate
                              )}
                            </span>

                          </div>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            </section>

          ))}

        </div>

      </div>

    </div>
  );
}