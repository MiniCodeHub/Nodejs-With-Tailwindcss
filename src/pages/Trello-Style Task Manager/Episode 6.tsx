import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
};

type List = {
  id: number;
  title: string;
  tasks: Task[];
};

const defaultLists: List[] = [
  {
    id: 1,
    title: "To Do",
    tasks: [
      {
        id: 101,
        title: "Create Homepage"
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
];

export default function App() {

  const [lists, setLists] =
    useState<List[]>([]);

  const [draggedTask, setDraggedTask] =
    useState<Task | null>(null);

  const [sourceListId, setSourceListId] =
    useState<number | null>(null);

  useEffect(() => {

    const saved =
      localStorage.getItem("taskflow");

    if (saved) {
      setLists(JSON.parse(saved));
    } else {
      setLists(defaultLists);
    }

  }, []);

  useEffect(() => {

    if (lists.length > 0) {

      localStorage.setItem(
        "taskflow",
        JSON.stringify(lists)
      );

    }

  }, [lists]);

  function handleDrop(targetListId: number) {

    if (!draggedTask || sourceListId === null)
      return;

    setLists(prev => {

      const updated =
        prev.map(list => {

          if (list.id === sourceListId) {

            return {
              ...list,
              tasks: list.tasks.filter(
                task => task.id !== draggedTask.id
              )
            };

          }

          if (list.id === targetListId) {

            return {
              ...list,
              tasks: [
                ...list.tasks,
                draggedTask
              ]
            };

          }

          return list;

        });

      return updated;

    });

    setDraggedTask(null);
    setSourceListId(null);
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        TaskFlow
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {lists.map(list => (

          <div
            key={list.id}

            onDragOver={(e)=>e.preventDefault()}

            onDrop={() =>
              handleDrop(list.id)
            }

            className="bg-slate-900 rounded-2xl p-5 border border-slate-800 min-h-[350px]"
          >

            <h2 className="text-xl font-bold mb-5">
              {list.title}
            </h2>

            <div className="space-y-4">

              {list.tasks.map(task => (

                <div

                  key={task.id}

                  draggable

                  onDragStart={()=>{
                    setDraggedTask(task);
                    setSourceListId(list.id);
                  }}

                  className="bg-slate-800 p-4 rounded-xl cursor-move hover:bg-slate-700 transition"

                >

                  {task.title}

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}