import { useEffect, useMemo, useState } from "react";

type TaskStatus = "todo" | "in-progress" | "done";
type Priority = "low" | "medium" | "high";

type ActivityType =
  | "created"
  | "updated"
  | "status"
  | "priority"
  | "labels"
  | "deleted";

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

interface Activity {
  id: number;
  taskId: number;
  taskTitle: string;
  type: ActivityType;
  message: string;
  createdAt: string;
}

interface TaskForm {
  title: string;
  description: string;
  priority: Priority;
  labels: string;
  dueDate: string;
}

const TASK_STORAGE_KEY = "trello_task_manager_tasks";
const ACTIVITY_STORAGE_KEY =
  "trello_task_manager_activity";

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete React project",
    description:
      "Finish the Trello-style task manager.",
    status: "todo",
    priority: "high",
    labels: ["React", "Project"],
    dueDate: "2026-09-15",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Learn Tailwind CSS",
    description:
      "Practice responsive layouts and components.",
    status: "in-progress",
    priority: "medium",
    labels: ["Tailwind"],
    dueDate: "2026-09-12",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Build dashboard",
    description:
      "Create the project analytics dashboard.",
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
  // TASKS
  // =====================================================

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved =
        localStorage.getItem(
          TASK_STORAGE_KEY
        );

      if (!saved) {
        return initialTasks;
      }

      const parsed: unknown =
        JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed as Task[];
      }

      return initialTasks;
    } catch (error) {
      console.error(
        "Failed to load tasks:",
        error
      );

      return initialTasks;
    }
  });

  // =====================================================
  // ACTIVITY
  // =====================================================

  const [activities, setActivities] =
    useState<Activity[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            ACTIVITY_STORAGE_KEY
          );

        if (!saved) {
          return [];
        }

        const parsed: unknown =
          JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed as Activity[];
        }

        return [];
      } catch (error) {
        console.error(
          "Failed to load activity:",
          error
        );

        return [];
      }
    });

  // =====================================================
  // UI STATES
  // =====================================================

  const [search, setSearch] =
    useState<string>("");

  const [showAddTask, setShowAddTask] =
    useState<boolean>(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [showActivity, setShowActivity] =
    useState<boolean>(false);

  const [showClearConfirm, setShowClearConfirm] =
    useState<boolean>(false);

  const [showClearActivityConfirm, setShowClearActivityConfirm] =
    useState<boolean>(false);

  const [saveStatus, setSaveStatus] =
    useState<string>("Saved");

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
        TASK_STORAGE_KEY,
        JSON.stringify(tasks)
      );

      const timer =
        window.setTimeout(() => {
          setSaveStatus("Saved");
        }, 300);

      return () => {
        window.clearTimeout(timer);
      };
    } catch (error) {
      console.error(
        "Failed to save tasks:",
        error
      );

      setSaveStatus("Save failed");
    }
  }, [tasks]);

  // =====================================================
  // SAVE ACTIVITIES
  // =====================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        ACTIVITY_STORAGE_KEY,
        JSON.stringify(activities)
      );
    } catch (error) {
      console.error(
        "Failed to save activity:",
        error
      );
    }
  }, [activities]);

  // =====================================================
  // ADD ACTIVITY
  // =====================================================

  const addActivity = (
    taskId: number,
    taskTitle: string,
    type: ActivityType,
    message: string
  ) => {
    const activity: Activity = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      taskId,
      taskTitle,
      type,
      message,
      createdAt:
        new Date().toISOString(),
    };

    setActivities((previous) => [
      activity,
      ...previous,
    ]);
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredTasks = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      return (
        task.title
          .toLowerCase()
          .includes(query) ||
        task.description
          .toLowerCase()
          .includes(query) ||
        task.labels.some((label) =>
          label
            .toLowerCase()
            .includes(query)
        )
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
        (task) =>
          task.status === "todo"
      ).length,

      inProgress: tasks.filter(
        (task) =>
          task.status === "in-progress"
      ).length,

      done: tasks.filter(
        (task) =>
          task.status === "done"
      ).length,

      activity: activities.length,
    };
  }, [tasks, activities]);

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

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

    const title =
      newTask.title.trim();

    if (!title) {
      return;
    }

    const task: Task = {
      id: Date.now(),

      title,

      description:
        newTask.description.trim(),

      status: "todo",

      priority:
        newTask.priority,

      labels:
        newTask.labels
          .split(",")
          .map((label) =>
            label.trim()
          )
          .filter(
            (label) =>
              label.length > 0
          ),

      dueDate:
        newTask.dueDate,

      createdAt:
        new Date().toISOString(),
    };

    setTasks((previous) => [
      task,
      ...previous,
    ]);

    addActivity(
      task.id,
      task.title,
      "created",
      `Created task "${task.title}"`
    );

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

  const deleteTask = (
    taskId: number
  ) => {
    const task =
      tasks.find(
        (item) =>
          item.id === taskId
      );

    if (!task) {
      return;
    }

    addActivity(
      task.id,
      task.title,
      "deleted",
      `Deleted task "${task.title}"`
    );

    setTasks((previous) =>
      previous.filter(
        (item) =>
          item.id !== taskId
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
    const task =
      tasks.find(
        (item) =>
          item.id === taskId
      );

    if (!task) {
      return;
    }

    if (
      task.status === newStatus
    ) {
      return;
    }

    const oldStatus =
      task.status;

    const statusNames: Record<
      TaskStatus,
      string
    > = {
      todo: "To Do",
      "in-progress":
        "In Progress",
      done: "Done",
    };

    setTasks((previous) =>
      previous.map((item) =>
        item.id === taskId
          ? {
              ...item,
              status:
                newStatus,
            }
          : item
      )
    );

    addActivity(
      task.id,
      task.title,
      "status",
      `Moved "${task.title}" from ${statusNames[oldStatus]} to ${statusNames[newStatus]}`
    );
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEditModal = (
    task: Task
  ) => {
    setEditingTask({
      ...task,
      labels: [
        ...task.labels,
      ],
    });
  };

  // =====================================================
  // SAVE EDITED TASK
  // =====================================================

  const saveEditedTask = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editingTask) {
      return;
    }

    const oldTask =
      tasks.find(
        (task) =>
          task.id ===
          editingTask.id
      );

    if (!oldTask) {
      return;
    }

    const updatedTask: Task = {
      ...editingTask,

      title:
        editingTask.title.trim(),

      description:
        editingTask.description.trim(),

      labels:
        editingTask.labels
          .map((label) =>
            label.trim()
          )
          .filter(
            (label) =>
              label.length > 0
          ),
    };

    // -------------------------------------------------
    // GENERAL UPDATE
    // -------------------------------------------------

    const titleChanged =
      oldTask.title !==
      updatedTask.title;

    const descriptionChanged =
      oldTask.description !==
      updatedTask.description;

    const dueDateChanged =
      oldTask.dueDate !==
      updatedTask.dueDate;

    if (
      titleChanged ||
      descriptionChanged ||
      dueDateChanged
    ) {
      addActivity(
        updatedTask.id,
        updatedTask.title,
        "updated",
        `Updated task "${updatedTask.title}"`
      );
    }

    // -------------------------------------------------
    // PRIORITY CHANGE
    // -------------------------------------------------

    if (
      oldTask.priority !==
      updatedTask.priority
    ) {
      addActivity(
        updatedTask.id,
        updatedTask.title,
        "priority",
        `Changed priority from ${oldTask.priority} to ${updatedTask.priority}`
      );
    }

    // -------------------------------------------------
    // LABEL CHANGE
    // -------------------------------------------------

    const oldLabels =
      [...oldTask.labels]
        .sort()
        .join(",");

    const newLabels =
      [...updatedTask.labels]
        .sort()
        .join(",");

    if (
      oldLabels !== newLabels
    ) {
      addActivity(
        updatedTask.id,
        updatedTask.title,
        "labels",
        `Updated labels for "${updatedTask.title}"`
      );
    }

    // -------------------------------------------------
    // STATUS CHANGE
    // -------------------------------------------------

    if (
      oldTask.status !==
      updatedTask.status
    ) {
      const statusNames: Record<
        TaskStatus,
        string
      > = {
        todo: "To Do",
        "in-progress":
          "In Progress",
        done: "Done",
      };

      addActivity(
        updatedTask.id,
        updatedTask.title,
        "status",
        `Changed status from ${statusNames[oldTask.status]} to ${statusNames[updatedTask.status]}`
      );
    }

    setTasks((previous) =>
      previous.map((task) =>
        task.id ===
        updatedTask.id
          ? updatedTask
          : task
      )
    );

    setEditingTask(null);
  };

  // =====================================================
  // CLEAR TASKS
  // =====================================================

  const clearAllTasks = () => {
    setTasks([]);

    localStorage.removeItem(
      TASK_STORAGE_KEY
    );

    setShowClearConfirm(false);

    setSaveStatus("Saved");
  };

  // =====================================================
  // CLEAR ACTIVITY
  // =====================================================

  const clearActivity = () => {
    setActivities([]);

    localStorage.removeItem(
      ACTIVITY_STORAGE_KEY
    );

    setShowClearActivityConfirm(
      false
    );
  };

  // =====================================================
  // RESTORE DEMO
  // =====================================================

  const restoreDemoTasks = () => {
    setTasks(
      initialTasks.map(
        (task) => ({
          ...task,
          labels: [
            ...task.labels,
          ],
        })
      )
    );

    addActivity(
      0,
      "System",
      "updated",
      "Restored demo tasks"
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
  // ACTIVITY ICON
  // =====================================================

  const getActivityIcon = (
    type: ActivityType
  ): string => {
    switch (type) {
      case "created":
        return "➕";

      case "updated":
        return "✏️";

      case "status":
        return "🔄";

      case "priority":
        return "⚡";

      case "labels":
        return "🏷️";

      case "deleted":
        return "🗑️";

      default:
        return "•";
    }
  };

  // =====================================================
  // FORMAT ACTIVITY DATE
  // =====================================================

  const formatActivityDate = (
    date: string
  ): string => {
    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
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

        {task.labels.length >
          0 && (
          <div className="flex flex-wrap gap-2 mt-3">

            {task.labels.map(
              (
                label,
                index
              ) => (
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

        {/* ACTIONS */}

        <div className="flex flex-wrap items-center gap-2 mt-4">

          {task.status !==
            "todo" && (
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

          {task.status !==
            "in-progress" && (
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

          {task.status !==
            "done" && (
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
  // RETURN
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

            <div className="flex flex-wrap items-center gap-3">

              {/* SAVE STATUS */}

              <div className="flex items-center gap-2 text-sm text-gray-500">

                <span
                  className={`w-2 h-2 rounded-full ${
                    saveStatus ===
                    "Saved"
                      ? "bg-green-500"
                      : saveStatus ===
                        "Saving..."
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />

                {saveStatus}

              </div>

              {/* ACTIVITY */}

              <button
                type="button"
                onClick={() =>
                  setShowActivity(true)
                }
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Activity
                {activities.length >
                  0 && (
                  <span className="ml-2 px-2 py-0.5 bg-white text-gray-900 rounded-full text-xs">
                    {activities.length}
                  </span>
                )}
              </button>

              {/* ADD */}

              <button
                type="button"
                onClick={() =>
                  setShowAddTask(true)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
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

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">

          <div className="flex items-start gap-3">

            <div className="text-xl">
              🕒
            </div>

            <div>

              <h2 className="font-semibold text-purple-900">
                Episode 19 — Task Activity & History
              </h2>

              <p className="text-sm text-purple-700 mt-1">
                Track task creation, edits,
                status changes, priority changes,
                labels, and deletions.
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

          <div className="bg-white rounded-xl border border-gray-200 p-4">

            <p className="text-sm text-gray-500">
              Total Tasks
            </p>

            <p className="text-2xl font-bold mt-1">
              {statistics.total}
            </p>

          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">

            <p className="text-sm text-gray-500">
              To Do
            </p>

            <p className="text-2xl font-bold mt-1">
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

          <div className="bg-white rounded-xl border border-gray-200 p-4">

            <p className="text-sm text-gray-500">
              Activities
            </p>

            <p className="text-2xl font-bold text-purple-600 mt-1">
              {statistics.activity}
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
                setShowClearConfirm(
                  true
                )
              }
              className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={
                restoreDemoTasks
              }
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

          {columns.map(
            (column) => {

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

                  <div className="flex items-center justify-between mb-4">

                    <h2 className="font-semibold text-gray-800">
                      {column.title}
                    </h2>

                    <span className="px-2 py-1 bg-white rounded-md text-xs font-medium text-gray-600">
                      {
                        columnTasks.length
                      }
                    </span>

                  </div>

                  <div className="space-y-3">

                    {columnTasks.map(
                      (task) => (
                        <TaskCard
                          key={
                            task.id
                          }
                          task={
                            task
                          }
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
            }
          )}

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
                  setShowAddTask(
                    false
                  )
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

              <div>

                <label className="block text-sm font-medium mb-1">
                  Task Title
                </label>

                <input
                  name="title"
                  value={
                    newTask.title
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    newTask.description
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Task description"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={
                      newTask.priority
                    }
                    onChange={
                      handleInputChange
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
                    name="dueDate"
                    value={
                      newTask.dueDate
                    }
                    onChange={
                      handleInputChange
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                </div>

              </div>

              <div>

                <label className="block text-sm font-medium mb-1">
                  Labels
                </label>

                <input
                  name="labels"
                  value={
                    newTask.labels
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="React, Frontend, Urgent"
                  className="w-full px-3 py-2 border rounded-lg"
                />

              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddTask(
                      false
                    )
                  }
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Add Task
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          EDIT MODAL
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
              onSubmit={
                saveEditedTask
              }
              className="p-5 space-y-4"
            >

              <div>

                <label className="block text-sm font-medium mb-1">
                  Task Title
                </label>

                <input
                  value={
                    editingTask.title
                  }
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

              <div>

                <label className="block text-sm font-medium mb-1">
                  Description
                </label>

                <textarea
                  value={
                    editingTask.description
                  }
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>

                  <select
                    value={
                      editingTask.priority
                    }
                    onChange={(
                      event: React.ChangeEvent<HTMLSelectElement>
                    ) =>
                      setEditingTask({
                        ...editingTask,
                        priority:
                          event.target
                            .value as Priority,
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
                    value={
                      editingTask.dueDate
                    }
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

              <div>

                <label className="block text-sm font-medium mb-1">
                  Labels
                </label>

                <input
                  value={
                    editingTask.labels.join(
                      ", "
                    )
                  }
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
                              label.length >
                              0
                          ),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />

              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setEditingTask(
                      null
                    )
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
          ACTIVITY PANEL
      ================================================= */}

      {showActivity && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">

          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col">

            {/* HEADER */}

            <div className="p-5 border-b flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Activity History
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {activities.length} activity
                  {activities.length ===
                  1
                    ? ""
                    : "ies"}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowActivity(
                    false
                  )
                }
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>

            </div>

            {/* ACTIVITY LIST */}

            <div className="flex-1 overflow-y-auto p-5">

              {activities.length ===
                0 && (
                <div className="text-center py-16">

                  <div className="text-4xl mb-3">
                    🕒
                  </div>

                  <h3 className="font-semibold text-gray-800">
                    No activity yet
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Your task activity will
                    appear here.
                  </p>

                </div>
              )}

              <div className="space-y-5">

                {activities.map(
                  (activity) => (
                    <div
                      key={
                        activity.id
                      }
                      className="flex gap-3"
                    >

                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {getActivityIcon(
                          activity.type
                        )}
                      </div>

                      <div className="flex-1">

                        <p className="text-sm text-gray-800">
                          {
                            activity.message
                          }
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {
                            formatActivityDate(
                              activity.createdAt
                            )
                          }
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* FOOTER */}

            <div className="p-5 border-t">

              <button
                type="button"
                onClick={() =>
                  setShowClearActivityConfirm(
                    true
                  )
                }
                disabled={
                  activities.length ===
                  0
                }
                className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Activity History
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          CLEAR TASKS MODAL
      ================================================= */}

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">

          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">

            <div className="text-4xl mb-3">
              ⚠️
            </div>

            <h2 className="text-xl font-bold">
              Clear all tasks?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              All tasks will be permanently
              removed from this browser.
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() =>
                  setShowClearConfirm(
                    false
                  )
                }
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  clearAllTasks
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Clear All
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          CLEAR ACTIVITY MODAL
      ================================================= */}

      {showClearActivityConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">

          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">

            <div className="text-4xl mb-3">
              🗑️
            </div>

            <h2 className="text-xl font-bold">
              Clear activity history?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              This will permanently delete
              your activity history.
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() =>
                  setShowClearActivityConfirm(
                    false
                  )
                }
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  clearActivity
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Clear History
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;