import { useState } from "react";

type Status =
  | "todo"
  | "in-progress"
  | "review"
  | "done";

type Task = {
  id: number;
  title: string;
  status: Status;
};

type Notification = {
  id: number;
  message: string;
  time: string;
  read: boolean;
};

type Activity = {
  id: number;
  message: string;
  time: string;
};

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

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Design Dashboard",
    status: "todo",
  },
  {
    id: 2,
    title: "Build Authentication",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Test API",
    status: "review",
  },
  {
    id: 4,
    title: "Setup Project",
    status: "done",
  },
];

function App() {
  const [tasks, setTasks] =
    useState<Task[]>(initialTasks);

  const [notifications, setNotifications] =
    useState<Notification[]>([
      {
        id: 1,
        message:
          "Welcome back! You have active tasks.",
        time: "Just now",
        read: false,
      },
    ]);

  const [activities, setActivities] =
    useState<Activity[]>([
      {
        id: 1,
        message:
          "TaskFlow workspace opened",
        time: "Just now",
      },
    ]);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [newTask, setNewTask] =
    useState("");

  const [draggedTask, setDraggedTask] =
    useState<number | null>(null);

  function currentTime() {
    return new Date().toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function addNotification(
    message: string
  ) {
    const notification: Notification = {
      id: Date.now(),
      message,
      time: currentTime(),
      read: false,
    };

    setNotifications((current) => [
      notification,
      ...current,
    ]);
  }

  function addActivity(
    message: string
  ) {
    const activity: Activity = {
      id: Date.now(),
      message,
      time: currentTime(),
    };

    setActivities((current) => [
      activity,
      ...current,
    ]);
  }

  function addTask() {
    const title =
      newTask.trim();

    if (!title) {
      return;
    }

    const task: Task = {
      id: Date.now(),
      title,
      status: "todo",
    };

    setTasks((current) => [
      ...current,
      task,
    ]);

    addNotification(
      `New task created: ${title}`
    );

    addActivity(
      `Created "${title}"`
    );

    setNewTask("");
  }

  function deleteTask(
    taskId: number
  ) {
    const task =
      tasks.find(
        (task) =>
          task.id === taskId
      );

    if (!task) {
      return;
    }

    setTasks((current) =>
      current.filter(
        (task) =>
          task.id !== taskId
      )
    );

    addNotification(
      `Task deleted: ${task.title}`
    );

    addActivity(
      `Deleted "${task.title}"`
    );
  }

  function handleDrop(
    newStatus: Status
  ) {
    if (draggedTask === null) {
      return;
    }

    const task =
      tasks.find(
        (task) =>
          task.id === draggedTask
      );

    if (!task) {
      return;
    }

    if (
      task.status === newStatus
    ) {
      setDraggedTask(null);
      return;
    }

    setTasks((current) =>
      current.map((item) =>
        item.id === draggedTask
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );

    const column =
      columns.find(
        (column) =>
          column.id === newStatus
      );

    addNotification(
      `${task.title} moved to ${column?.title}`
    );

    addActivity(
      `Moved "${task.title}" from ${task.status} to ${column?.title}`
    );

    setDraggedTask(null);
  }

  function markAllAsRead() {
    setNotifications(
      (current) =>
        current.map(
          (notification) => ({
            ...notification,
            read: true,
          })
        )
    );
  }

  function markAsRead(
    id: number
  ) {
    setNotifications(
      (current) =>
        current.map(
          (notification) =>
            notification.id === id
              ? {
                  ...notification,
                  read: true,
                }
              : notification
        )
    );
  }

  function clearNotifications() {
    setNotifications([]);
  }

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <header className="relative border-b border-slate-800 bg-slate-900">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold">
              TaskFlow
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Notifications & activity
            </p>

          </div>

          {/* NOTIFICATION BUTTON */}

          <div className="relative">

            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              className="relative w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 transition"
            >
              🔔

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center bg-red-500 text-xs rounded-full">
                  {unreadCount}
                </span>
              )}

            </button>

            {/* NOTIFICATION PANEL */}

            {showNotifications && (

              <div className="absolute right-0 mt-3 w-[360px] max-w-[90vw] bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">

                <div className="p-4 border-b border-slate-800 flex justify-between items-center">

                  <div>

                    <h2 className="font-semibold">
                      Notifications
                    </h2>

                    <p className="text-xs text-slate-500">
                      {unreadCount} unread
                    </p>

                  </div>

                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Mark all read
                  </button>

                </div>

                <div className="max-h-[350px] overflow-y-auto">

                  {notifications.length === 0 && (

                    <p className="text-center text-slate-500 py-10">
                      No notifications
                    </p>

                  )}

                  {notifications.map(
                    (notification) => (

                      <button
                        key={notification.id}
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                        className={`
                          w-full
                          text-left
                          p-4
                          border-b
                          border-slate-800
                          transition

                          ${
                            notification.read
                              ? "bg-slate-900"
                              : "bg-blue-500/10"
                          }
                        `}
                      >

                        <div className="flex gap-3">

                          <div
                            className={`mt-1 w-2 h-2 rounded-full ${
                              notification.read
                                ? "bg-slate-600"
                                : "bg-blue-500"
                            }`}
                          />

                          <div>

                            <p className="text-sm">
                              {
                                notification.message
                              }
                            </p>

                            <span className="text-xs text-slate-500">
                              {
                                notification.time
                              }
                            </span>

                          </div>

                        </div>

                      </button>

                    )
                  )}

                </div>

                {notifications.length > 0 && (

                  <button
                    onClick={clearNotifications}
                    className="w-full p-3 text-sm text-red-400 hover:bg-slate-800"
                  >
                    Clear Notifications
                  </button>

                )}

              </div>

            )}

          </div>

        </div>

      </header>


      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ADD TASK */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              value={newTask}
              onChange={(event) =>
                setNewTask(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  addTask();
                }
              }}
              placeholder="Add new task..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              onClick={addTask}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium"
            >
              + Add Task
            </button>

          </div>

        </div>


        <div className="grid xl:grid-cols-[1fr_320px] gap-6">

          {/* KANBAN */}

          <section>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

              {columns.map(
                (column) => {

                  const columnTasks =
                    tasks.filter(
                      (task) =>
                        task.status ===
                        column.id
                    );

                  return (

                    <div
                      key={column.id}
                      onDragOver={(
                        event
                      ) =>
                        event.preventDefault()
                      }
                      onDrop={() =>
                        handleDrop(
                          column.id
                        )
                      }
                      className="bg-slate-900 border border-slate-800 rounded-xl p-4 min-h-[450px]"
                    >

                      <div className="flex justify-between items-center mb-4">

                        <h2 className="font-semibold">
                          {column.title}
                        </h2>

                        <span className="bg-slate-800 px-2 py-1 rounded-full text-xs text-slate-400">
                          {
                            columnTasks.length
                          }
                        </span>

                      </div>

                      <div className="space-y-3">

                        {columnTasks.map(
                          (task) => (

                            <div
                              key={task.id}
                              draggable
                              onDragStart={() =>
                                setDraggedTask(
                                  task.id
                                )
                              }
                              onDragEnd={() =>
                                setDraggedTask(
                                  null
                                )
                              }
                              className={`bg-slate-800 border border-slate-700 p-4 rounded-lg cursor-grab ${
                                draggedTask ===
                                task.id
                                  ? "opacity-40"
                                  : ""
                              }`}
                            >

                              <div className="flex justify-between gap-3">

                                <h3 className="font-medium text-sm">
                                  {
                                    task.title
                                  }
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

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          </section>


          {/* ACTIVITY SIDEBAR */}

          <aside className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit">

            <div className="flex justify-between items-center mb-5">

              <div>

                <h2 className="text-lg font-semibold">
                  Activity
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Recent workspace updates
                </p>

              </div>

              <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400">
                {activities.length}
              </span>

            </div>

            <div className="border-l border-slate-700 ml-2">

              {activities.length === 0 && (

                <p className="text-slate-500 text-sm pl-5">
                  No activity yet.
                </p>

              )}

              {activities.map(
                (activity) => (

                  <div
                    key={activity.id}
                    className="relative pl-6 pb-6"
                  >

                    <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full" />

                    <p className="text-sm">
                      {
                        activity.message
                      }
                    </p>

                    <span className="text-xs text-slate-500">
                      {activity.time}
                    </span>

                  </div>

                )
              )}

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default App;