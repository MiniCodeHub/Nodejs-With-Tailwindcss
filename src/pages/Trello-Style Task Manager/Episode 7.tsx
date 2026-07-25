import { useMemo, useState } from "react";

type Priority = "High" | "Medium" | "Low";

type Task = {
  id: number;
  title: string;
  priority: Priority;
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
      { id: 1, title: "Design Landing Page", priority: "High" },
      { id: 2, title: "Write Documentation", priority: "Low" }
    ]
  },
  {
    id: 2,
    title: "In Progress",
    tasks: [
      { id: 3, title: "Build Login API", priority: "Medium" }
    ]
  },
  {
    id: 3,
    title: "Done",
    tasks: [
      { id: 4, title: "Setup Project", priority: "High" }
    ]
  }
];

export default function App() {
  const [lists] = useState<List[]>(initialLists);

  const [search, setSearch] = useState("");

  const [filter, setFilter] =
    useState<"All" | Priority>("All");

  const stats = useMemo(() => {
    const allTasks = lists.flatMap(list => list.tasks);

    return {
      total: allTasks.length,
      high: allTasks.filter(t => t.priority === "High").length,
      medium: allTasks.filter(t => t.priority === "Medium").length,
      low: allTasks.filter(t => t.priority === "Low").length
    };
  }, [lists]);

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter(task => {

      const searchMatch =
        task.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const priorityMatch =
        filter === "All" ||
        task.priority === filter;

      return searchMatch && priorityMatch;
    });
  };

  const badgeColor = (priority: Priority) => {
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
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        TaskFlow Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="bg-slate-900 rounded-xl p-5">
          <h2>Total Tasks</h2>
          <p className="text-3xl font-bold mt-2">
            {stats.total}
          </p>
        </div>

        <div className="bg-red-500 rounded-xl p-5">
          <h2>High</h2>
          <p className="text-3xl font-bold">
            {stats.high}
          </p>
        </div>

        <div className="bg-yellow-500 rounded-xl p-5">
          <h2>Medium</h2>
          <p className="text-3xl font-bold">
            {stats.medium}
          </p>
        </div>

        <div className="bg-green-500 rounded-xl p-5">
          <h2>Low</h2>
          <p className="text-3xl font-bold">
            {stats.low}
          </p>
        </div>

      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search task..."
          className="flex-1 bg-slate-900 rounded-lg p-3 border border-slate-700"
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "All" | Priority)
          }
          className="bg-slate-900 rounded-lg p-3 border border-slate-700"
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {lists.map(list => (

          <div
            key={list.id}
            className="bg-slate-900 rounded-2xl p-5"
          >

            <h2 className="text-xl font-bold mb-5">
              {list.title}
            </h2>

            <div className="space-y-4">

              {filterTasks(list.tasks).map(task => (

                <div
                  key={task.id}
                  className="bg-slate-800 rounded-xl p-4"
                >

                  <div className="flex justify-between">

                    <h3>{task.title}</h3>

                    <span
                      className={`${badgeColor(task.priority)} px-2 py-1 rounded-full text-xs`}
                    >
                      {task.priority}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}