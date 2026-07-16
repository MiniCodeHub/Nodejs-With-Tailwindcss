import { useState } from "react";

type Priority = "Low" | "Medium" | "High";

type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
};

type List = {
  id: number;
  title: string;
  tasks: Task[];
};

export default function App() {
  const [lists, setLists] = useState<List[]>(([
    {
      id: 1,
      title: "To Do",
      tasks: [
        {
          id: 1,
          title: "Design Homepage",
          description: "Create initial wireframe",
          priority: "High",
          dueDate: "2026-07-20"
        }
      ]
    },
    {
      id: 2,
      title: "In Progress",
      tasks: []
    },
    {
      id: 3,
      title: "Done",
      tasks: []
    }
  ]));

  const addTask = (listId: number) => {
    const title = prompt("Task Title");

    if (!title) return;

    const description =
      prompt("Description") || "";

    const priority =
      (prompt(
        "Priority (Low/Medium/High)"
      ) || "Low") as Priority;

    const dueDate =
      prompt(
        "Due Date (YYYY-MM-DD)"
      ) || "";

    const task: Task = {
      id: Date.now(),
      title,
      description,
      priority,
      dueDate
    };

    setLists(
      lists.map(list =>
        list.id === listId
          ? {
              ...list,
              tasks: [...list.tasks, task]
            }
          : list
      )
    );
  };

  const deleteTask = (
    listId: number,
    taskId: number
  ) => {
    setLists(
      lists.map(list =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.filter(
                task => task.id !== taskId
              )
            }
          : list
      )
    );
  };

  const editTask = (
    listId: number,
    taskId: number
  ) => {
    const newTitle =
      prompt("New Task Title");

    if (!newTitle) return;

    setLists(
      lists.map(list =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map(task =>
                task.id === taskId
                  ? {
                      ...task,
                      title: newTitle
                    }
                  : task
              )
            }
          : list
      )
    );
  };

  const priorityColor = (
    priority: Priority
  ) => {
    switch (priority) {
      case "High":
        return "bg-red-500";

      case "Medium":
        return "bg-yellow-500";

      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="
      min-h-screen
      bg-slate-950
      text-white
      p-8
    ">
      <h1 className="
        text-4xl
        font-bold
        mb-8
      ">
        TaskFlow
      </h1>

      <div className="
        grid
        md:grid-cols-3
        gap-6
      ">
        {lists.map(list => (
          <div
            key={list.id}
            className="
              bg-slate-900
              rounded-2xl
              p-5
              border
              border-slate-800
            "
          >
            <div className="
              flex
              justify-between
              mb-5
            ">
              <h2 className="
                text-xl
                font-bold
              ">
                {list.title}
              </h2>

              <span className="
                bg-cyan-500
                px-3
                py-1
                rounded-full
              ">
                {list.tasks.length}
              </span>
            </div>

            <div className="space-y-4">
              {list.tasks.map(task => (
                <div
                  key={task.id}
                  className="
                    bg-slate-800
                    p-4
                    rounded-xl
                  "
                >
                  <div className="
                    flex
                    justify-between
                    items-start
                  ">
                    <h3 className="
                      font-semibold
                      text-lg
                    ">
                      {task.title}
                    </h3>

                    <span
                      className={`
                        ${priorityColor(
                          task.priority
                        )}
                        px-2
                        py-1
                        rounded-full
                        text-xs
                      `}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <p className="
                    text-slate-400
                    mt-2
                  ">
                    {task.description}
                  </p>

                  <p className="
                    text-sm
                    text-slate-500
                    mt-3
                  ">
                    Due: {task.dueDate}
                  </p>

                  <div className="
                    flex
                    gap-2
                    mt-4
                  ">
                    <button
                      onClick={() =>
                        editTask(
                          list.id,
                          task.id
                        )
                      }
                      className="
                        flex-1
                        bg-blue-500
                        py-2
                        rounded-lg
                      "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteTask(
                          list.id,
                          task.id
                        )
                      }
                      className="
                        flex-1
                        bg-red-500
                        py-2
                        rounded-lg
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                addTask(list.id)
              }
              className="
                mt-5
                w-full
                bg-cyan-500
                hover:bg-cyan-600
                py-3
                rounded-xl
                font-semibold
              "
            >
              + Add Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}