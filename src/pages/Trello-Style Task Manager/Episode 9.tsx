import { useMemo, useState } from "react";

type Task = {
  id: number;
  title: string;
  tags: string[];
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Design Landing Page",
    tags: ["UI", "High Priority"]
  },
  {
    id: 2,
    title: "Build Login API",
    tags: ["Backend", "API"]
  },
  {
    id: 3,
    title: "Write Documentation",
    tags: ["Docs"]
  },
  {
    id: 4,
    title: "Fix Navbar",
    tags: ["UI", "Bug"]
  }
];

const tagColors: Record<string, string> = {
  UI: "bg-blue-500",
  Backend: "bg-green-500",
  API: "bg-purple-500",
  Docs: "bg-yellow-500",
  Bug: "bg-red-500",
  "High Priority": "bg-pink-600"
};

export default function App() {

  const [tasks] = useState<Task[]>(initialTasks);

  const [selectedTag, setSelectedTag] =
    useState("All");

  const allTags = useMemo(() => {

    return [
      "All",
      ...new Set(
        tasks.flatMap(task => task.tags)
      )
    ];

  }, [tasks]);

  const filteredTasks = useMemo(() => {

    if (selectedTag === "All")
      return tasks;

    return tasks.filter(task =>
      task.tags.includes(selectedTag)
    );

  }, [tasks, selectedTag]);

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        TaskFlow
      </h1>

      <div className="flex flex-wrap gap-3 mb-8">

        {allTags.map(tag => (

          <button

            key={tag}

            onClick={() =>
              setSelectedTag(tag)
            }

            className={`px-4 py-2 rounded-full transition
            ${
              selectedTag === tag
                ? "bg-blue-600"
                : "bg-slate-800 hover:bg-slate-700"
            }`}

          >
            {tag}
          </button>

        ))}

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {filteredTasks.map(task => (

          <div

            key={task.id}

            className="bg-slate-900 rounded-xl p-5"

          >

            <h2 className="text-xl font-semibold mb-4">
              {task.title}
            </h2>

            <div className="flex flex-wrap gap-2">

              {task.tags.map(tag => (

                <span

                  key={tag}

                  className={`px-3 py-1 rounded-full text-sm
                  ${
                    tagColors[tag] ??
                    "bg-gray-600"
                  }`}

                >
                  {tag}
                </span>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}