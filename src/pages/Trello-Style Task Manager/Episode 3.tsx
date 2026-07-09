import { useState } from "react";

type List = {
  id: number;
  title: string;
  tasks: string[];
};

export default function App() {
  const [lists, setLists] = useState<List[]>([
    {
      id: 1,
      title: "To Do",
      tasks: [
        "Design Homepage",
        "Create Logo"
      ]
    },
    {
      id: 2,
      title: "In Progress",
      tasks: [
        "Build Dashboard"
      ]
    },
    {
      id: 3,
      title: "Done",
      tasks: [
        "Setup React Project"
      ]
    }
  ]);

  const [newList, setNewList] =
    useState("");

  function addList() {
    if (!newList.trim()) return;

    const list = {
      id: Date.now(),
      title: newList,
      tasks: []
    };

    setLists([
      ...lists,
      list
    ]);

    setNewList("");
  }

  return (
    <div className="
      min-h-screen
      bg-slate-950
      text-white
      p-8
    ">
      <header className="
        flex
        flex-col
        md:flex-row
        gap-4
        justify-between
        mb-8
      ">
        <div>
          <h1 className="
            text-4xl
            font-bold
          ">
            TaskFlow
          </h1>

          <p className="
            text-slate-400
            mt-2
          ">
            Create unlimited boards
          </p>
        </div>

        <div className="
          flex
          gap-3
        ">
          <input
            value={newList}
            onChange={(e)=>
              setNewList(
                e.target.value
              )
            }
            placeholder="New list name"
            className="
              bg-slate-800
              px-4
              py-3
              rounded-xl
              outline-none
            "
          />

          <button
            onClick={addList}
            className="
              bg-cyan-500
              hover:bg-cyan-600
              px-5
              rounded-xl
              font-semibold
            "
          >
            Add List
          </button>
        </div>
      </header>

      <div className="
        grid
        lg:grid-cols-4
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
                text-sm
              ">
                {list.tasks.length}
              </span>
            </div>

            <div className="
              space-y-3
            ">
              {list.tasks.map(
                (task,index)=>(
                  <div
                    key={index}
                    className="
                      bg-slate-800
                      p-4
                      rounded-xl
                    "
                  >
                    {task}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}