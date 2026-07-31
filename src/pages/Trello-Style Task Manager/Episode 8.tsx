import { useMemo, useState } from "react";

type Task = {
  id: number;
  title: string;
  dueDate: string;
};

type List = {
  id: number;
  title: string;
  tasks: Task[];
};

const initialLists: List[] = [
  {
    id: 1,
    title: "To Do",
    tasks: [
      {
        id: 1,
        title: "Create Landing Page",
        dueDate: "2026-08-03"
      },
      {
        id: 2,
        title: "Design Logo",
        dueDate: "2026-07-29"
      }
    ]
  },
  {
    id: 2,
    title: "In Progress",
    tasks: [
      {
        id: 3,
        title: "Build Authentication",
        dueDate: "2026-08-02"
      }
    ]
  },
  {
    id: 3,
    title: "Done",
    tasks: [
      {
        id: 4,
        title: "Project Setup",
        dueDate: "2026-07-25"
      }
    ]
  }
];

export default function App() {

  const [lists] = useState(initialLists);

  const today = new Date();

  const upcomingTasks = useMemo(() => {

    return lists
      .flatMap(list => list.tasks)
      .filter(task => new Date(task.dueDate) >= today)
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
      );

  }, [lists]);

  function isOverdue(date: string) {
    return new Date(date) < today;
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        TaskFlow
      </h1>

      <div className="bg-slate-900 rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-4">
          Upcoming Tasks
        </h2>

        <div className="space-y-3">

          {upcomingTasks.length === 0 && (
            <p>No upcoming tasks.</p>
          )}

          {upcomingTasks.map(task => (

            <div
              key={task.id}
              className="flex justify-between border-b border-slate-700 pb-2"
            >
              <span>{task.title}</span>
              <span>{task.dueDate}</span>
            </div>

          ))}

        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {lists.map(list => (

          <div
            key={list.id}
            className="bg-slate-900 rounded-xl p-5"
          >

            <h2 className="text-xl font-bold mb-5">
              {list.title}
            </h2>

            <div className="space-y-4">

              {list.tasks.map(task => (

                <div
                  key={task.id}
                  className={`rounded-xl p-4 ${
                    isOverdue(task.dueDate)
                      ? "bg-red-900 border border-red-500"
                      : "bg-slate-800"
                  }`}
                >

                  <h3 className="font-semibold">
                    {task.title}
                  </h3>

                  <p className="text-sm mt-2">
                    Due: {task.dueDate}
                  </p>

                  {isOverdue(task.dueDate) && (
                    <p className="text-red-400 text-sm mt-2">
                      Overdue
                    </p>
                  )}

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}