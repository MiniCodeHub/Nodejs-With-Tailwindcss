import { useEffect, useMemo, useState } from "react";

type TaskStatus = "todo" | "in-progress" | "done";
type Priority = "low" | "medium" | "high";

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  labels: string[];
  dueDate: string;
  createdAt: string;
}

interface TaskForm {
  title: string;
  description: string;
  priority: Priority;
  labels: string;
  dueDate: string;
}

const STORAGE_KEY = "trello_task_manager_tasks";

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete React project",
    description: "Finish the Trello-style task manager.",
    status: "todo",
    priority: "high",
    labels: ["React", "Project"],
    dueDate: "2026-09-15",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Learn Tailwind CSS",
    description: "Practice responsive layouts and components.",
    status: "in-progress",
    priority: "medium",
    labels: ["Tailwind"],
    dueDate: "2026-09-12",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Build dashboard",
    description: "Create the project analytics dashboard.",
    status: "done",
    priority: "low",
    labels: ["UI"],
    dueDate: "2026-09-10",
    createdAt: new Date().toISOString(),
  },
];

const columns: {
  id: TaskStatus;
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
    id: "done",
    title: "Done",
  },
];

function App() {
  // =====================================================
  // LOAD TASKS FROM LOCAL STORAGE
  // =====================================================

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);

      if (!savedTasks) {
        return initialTasks;
      }

      const parsedTasks: unknown = JSON.parse(savedTasks);

      if (Array.isArray(parsedTasks)) {
        return parsedTasks as Task[];
      }

      return initialTasks;
    } catch (error) {
      console.error("Failed to load tasks:", error);
      return initialTasks;
    }
  });

  // =====================================================
  // OTHER STATES
  // =====================================================

  const [search, setSearch] = useState<string>("");

  const [saveStatus, setSaveStatus] =
    useState<string>("Saved");

  const [showAddTask, setShowAddTask] =
    useState<boolean>(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [showClearConfirm, setShowClearConfirm] =
    useState<boolean>(false);

  const [newTask, setNewTask] =
    useState<TaskForm>({
      title: "",
      description: "",
      priority: "medium",
      labels: "",
      dueDate: "",
    });

  // =====================================================
  // SAVE TASKS
  // =====================================================

  useEffect(() => {
    try {
      setSaveStatus("Saving...");

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );

      const timer = window.setTimeout(() => {
        setSaveStatus("Saved");
      }, 300);

      return () => {
        window.clearTimeout(timer);
      };
    } catch (error) {
      console.error("Failed to save tasks:", error);
      setSaveStatus("Save failed");
    }
  }, [tasks]);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      const titleMatch =
        task.title.toLowerCase().includes(query);

      const descriptionMatch =
        task.description
          .toLowerCase()
          .includes(query);

      const labelMatch =
        task.labels.some((label) =>
          label.toLowerCase().includes(query)
        );

      return (
        titleMatch ||
        descriptionMatch ||
        labelMatch
      );
    });
  }, [tasks, search]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    return {
      total: tasks.length,

      todo: tasks.filter(
        (task) => task.status === "todo"
      ).length,

      inProgress: tasks.filter(
        (task) => task.status === "in-progress"
      ).length,

      done: tasks.filter(
        (task) => task.status === "done"
      ).length,
    };
  }, [tasks]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setNewTask((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD TASK
  // =====================================================

  const addTask = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!newTask.title.trim()) {
      return;
    }

    const task: Task = {
      id: Date.now(),

      title: newTask.title.trim(),

      description:
        newTask.description.trim(),

      status: "todo",

      priority: newTask.priority,

      labels: newTask.labels
        .split(",")
        .map((label) => label.trim())
        .filter((label) => label.length > 0),

      dueDate: newTask.dueDate,

      createdAt: new Date().toISOString(),
    };

    setTasks((previous) => [
      task,
      ...previous,
    ]);

    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      labels: "",
      dueDate: "",
    });

    setShowAddTask(false);
  };

  // =====================================================
  // DELETE TASK
  // =====================================================

  const deleteTask = (taskId: number) => {
    setTasks((previous) =>
      previous.filter(
        (task) => task.id !== taskId
      )
    );
  };

  // =====================================================
  // CHANGE STATUS
  // =====================================================

  const changeStatus = (
    taskId: number,
    newStatus: TaskStatus
  ) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (task: Task) => {
    setEditingTask({
      ...task,
      labels: [...task.labels],
    });
  };

  // =====================================================
  // SAVE EDITED TASK
  // =====================================================

  const saveEditedTask = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !editingTask ||
      !editingTask.title.trim()
    ) {
      return;
    }

    setTasks((previous) =>
      previous.map((task) =>
        task.id === editingTask.id
          ? {
              ...editingTask,
              title:
                editingTask.title.trim(),

              description:
                editingTask.description.trim(),

              labels: editingTask.labels
                .map((label) => label.trim())
                .filter(
                  (label) =>
                    label.length > 0
                ),
            }
          : task
      )
    );

    setEditingTask(null);
  };

  // =====================================================
  // CLEAR ALL TASKS
  // =====================================================

  const clearAllTasks = () => {
    setTasks([]);

    localStorage.removeItem(STORAGE_KEY);

    setShowClearConfirm(false);

    setSaveStatus("Saved");
  };

  // =====================================================
  // RESTORE DEMO DATA
  // =====================================================

  const restoreDemoTasks = () => {
    setTasks(
      initialTasks.map((task) => ({
        ...task,
        labels: [...task.labels],
      }))
    );
  };

  // =====================================================
  // PRIORITY STYLE
  // =====================================================

  const getPriorityStyle = (
    priority: Priority
  ): string => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";

      case "medium":
        return "bg-yellow-100 text-yellow-700";

      case "low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // TASK CARD
  // =====================================================

  const TaskCard = ({
    task,
  }: {
    task: Task;
  }) => {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">

        {/* TITLE */}

        <div className="flex items-start justify-between gap-3">

          <div className="flex-1">

            <h3 className="font-semibold text-gray-900">
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-gray-500 mt-1">
                {task.description}
              </p>
            )}

          </div>

          <button
            type="button"
            onClick={() =>
              openEditModal(task)
            }
            className="text-gray-400 hover:text-blue-600"
            title="Edit task"
          >
            ✏️
          </button>

        </div>

        {/* LABELS */}

        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">

            {task.labels.map(
              (label, index) => (
                <span
                  key={`${label}-${index}`}
                  className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-700"
                >
                  #{label}
                </span>
              )
            )}

          </div>
        )}

        {/* PRIORITY */}

        <div className="flex flex-wrap items-center gap-2 mt-3">

          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityStyle(
              task.priority
            )}`}
          >
            {task.priority.toUpperCase()}
          </span>

          {task.dueDate && (
            <span className="text-xs text-gray-500">
              📅 {task.dueDate}
            </span>
          )}

        </div>

        {/* STATUS BUTTONS */}

        <div className="flex flex-wrap items-center gap-2 mt-4">

          {task.status !== "todo" && (
            <button
              type="button"
              onClick={() =>
                changeStatus(
                  task.id,
                  "todo"
                )
              }
              className="px-2 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200"
            >
              To Do
            </button>
          )}

          {task.status !== "in-progress" && (
            <button
              type="button"
              onClick={() =>
                changeStatus(
                  task.id,
                  "in-progress"
                )
              }
              className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              Progress
            </button>
          )}

          {task.status !== "done" && (
            <button
              type="button"
              onClick={() =>
                changeStatus(
                  task.id,
                  "done"
                )
              }
              className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700 hover:bg-green-200"
            >
              Done
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              deleteTask(task.id)
            }
            className="ml-auto px-2 py-1 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100"
          >
            Delete
          </button>

        </div>

      </div>
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                TaskFlow
              </h1>

              <p className="text-sm text-gray-500">
                Trello-style Task Manager
              </p>

            </div>

            <div className="flex items-center gap-4">

              {/* SAVE STATUS */}

              <div className="flex items-center gap-2 text-sm text-gray-500">

                <span
                  className={`w-2 h-2 rounded-full ${
                    saveStatus === "Saved"
                      ? "bg-green-500"
                      : saveStatus ===
                        "Saving..."
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />

                {saveStatus}

              </div>

              {/* ADD TASK */}

              <button
                type="button"
                onClick={() =>
                  setShowAddTask(true)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                + Add Task
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* EPISODE INFO */}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">

          <div className="flex items-start gap-3">

            <div className="text-xl">
              💾
            </div>

            <div>

              <h2 className="font-semibold text-blue-900">
                Episode 18 — Local Storage Persistence
              </h2>

              <p className="text-sm text-blue-700 mt-1">
                Tasks are automatically saved
                in your browser and restored
                after refreshing the page.
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white rounded-xl border border-gray-200 p-4">

            <p className="text-sm text-gray-500">
              Total Tasks
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-1">
              {statistics.total}
            </p>

          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">

            <p className="text-sm text-gray-500">
              To Do
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-1">
              {statistics.todo}
            </p>

          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">

            <p className="text-sm text-gray-500">
              In Progress
            </p>

            <p className="text-2xl font-bold text-blue-600 mt-1">
              {statistics.inProgress}
            </p>

          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">

            <p className="text-sm text-gray-500">
              Completed
            </p>

            <p className="text-2xl font-bold text-green-600 mt-1">
              {statistics.done}
            </p>

          </div>

        </section>

        {/* =================================================
            SEARCH / CONTROLS
        ================================================= */}

        <section className="bg-white border border-gray-200 rounded-xl p-4 mb-6">

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              value={search}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement>
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search tasks..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowClearConfirm(true)
              }
              className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={restoreDemoTasks}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Restore Demo
            </button>

          </div>

        </section>

        {/* =================================================
            BOARD
        ================================================= */}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {columns.map((column) => {

            const columnTasks =
              filteredTasks.filter(
                (task) =>
                  task.status ===
                  column.id
              );

            return (
              <div
                key={column.id}
                className="bg-gray-200/70 rounded-xl p-4 min-h-[400px]"
              >

                {/* COLUMN HEADER */}

                <div className="flex items-center justify-between mb-4">

                  <h2 className="font-semibold text-gray-800">
                    {column.title}
                  </h2>

                  <span className="px-2 py-1 bg-white rounded-md text-xs font-medium text-gray-600">
                    {columnTasks.length}
                  </span>

                </div>

                {/* TASKS */}

                <div className="space-y-3">

                  {columnTasks.map(
                    (task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                      />
                    )
                  )}

                  {columnTasks.length ===
                    0 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400">
                      No tasks
                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </section>

      </main>

      {/* =================================================
          ADD TASK MODAL
      ================================================= */}

      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">

            <div className="flex items-center justify-between p-5 border-b">

              <h2 className="text-xl font-bold">
                Add New Task
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowAddTask(false)
                }
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={addTask}
              className="p-5 space-y-4"
            >

              {/* TITLE */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Task Title
                </label>

                <input
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Task description"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* PRIORITY / DATE */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
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

                <div>

                  <label className="block text-sm font-medium mb-1">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                </div>

              </div>

              {/* LABELS */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Labels
                </label>

                <input
                  name="labels"
                  value={newTask.labels}
                  onChange={handleInputChange}
                  placeholder="React, Frontend, Urgent"
                  className="w-full px-3 py-2 border rounded-lg"
                />

                <p className="text-xs text-gray-400 mt-1">
                  Separate labels with commas.
                </p>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddTask(false)
                  }
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Task
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          EDIT TASK MODAL
      ================================================= */}

      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">

            <div className="flex items-center justify-between p-5 border-b">

              <h2 className="text-xl font-bold">
                Edit Task
              </h2>

              <button
                type="button"
                onClick={() =>
                  setEditingTask(null)
                }
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={saveEditedTask}
              className="p-5 space-y-4"
            >

              {/* TITLE */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Task Title
                </label>

                <input
                  value={editingTask.title}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) =>
                    setEditingTask({
                      ...editingTask,
                      title:
                        event.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Description
                </label>

                <textarea
                  value={editingTask.description}
                  onChange={(
                    event: React.ChangeEvent<HTMLTextAreaElement>
                  ) =>
                    setEditingTask({
                      ...editingTask,
                      description:
                        event.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />

              </div>

              {/* PRIORITY / DATE */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>

                  <select
                    value={editingTask.priority}
                    onChange={(
                      event: React.ChangeEvent<HTMLSelectElement>
                    ) =>
                      setEditingTask({
                        ...editingTask,
                        priority:
                          event.target.value as Priority,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
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

                <div>

                  <label className="block text-sm font-medium mb-1">
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) =>
                      setEditingTask({
                        ...editingTask,
                        dueDate:
                          event.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                </div>

              </div>

              {/* LABELS */}

              <div>

                <label className="block text-sm font-medium mb-1">
                  Labels
                </label>

                <input
                  value={editingTask.labels.join(", ")}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) =>
                    setEditingTask({
                      ...editingTask,
                      labels:
                        event.target.value
                          .split(",")
                          .map(
                            (label) =>
                              label.trim()
                          )
                          .filter(
                            (label) =>
                              label.length > 0
                          ),
                    })
                  }
                  placeholder="React, Frontend"
                  className="w-full px-3 py-2 border rounded-lg"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setEditingTask(null)
                  }
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          CLEAR CONFIRMATION
      ================================================= */}

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">

            <div className="text-4xl mb-3">
              ⚠️
            </div>

            <h2 className="text-xl font-bold">
              Clear all tasks?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              This will permanently remove all
              saved tasks from localStorage.
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() =>
                  setShowClearConfirm(false)
                }
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={clearAllTasks}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear All
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;
