export default function App() {
  const columns = [
    {
      title: "To Do",
      tasks: [
        "Design Landing Page",
        "Create Login UI",
      ],
    },
    {
      title: "In Progress",
      tasks: [
        "Build Dashboard",
      ],
    },
    {
      title: "Done",
      tasks: [
        "Setup React Project",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col p-6">

        <h1 className="text-3xl font-bold text-cyan-400 mb-10">
          TaskFlow
        </h1>

        <nav className="space-y-3">

          <button className="w-full text-left px-4 py-3 rounded-xl bg-cyan-500">
            Dashboard
          </button>

          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition">
            Boards
          </button>

          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition">
            Calendar
          </button>

          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 transition">
            Settings
          </button>

        </nav>

      </aside>

      {/* Main */}
      <main className="flex-1 p-6">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h2 className="text-4xl font-bold">
              My Workspace
            </h2>

            <p className="text-slate-400 mt-2">
              Organize your work efficiently.
            </p>
          </div>

          <button className="bg-cyan-500 hover:bg-cyan-600 transition px-6 py-3 rounded-xl font-semibold">
            + New Task
          </button>

        </header>

        {/* Kanban Board */}
        <div className="grid lg:grid-cols-3 gap-6">

          {columns.map((column) => (

            <div
              key={column.title}
              className="bg-slate-900 rounded-2xl p-5 border border-slate-800"
            >

              <div className="flex justify-between items-center mb-5">

                <h3 className="text-xl font-bold">
                  {column.title}
                </h3>

                <span className="bg-slate-800 px-3 py-1 rounded-full text-sm">
                  {column.tasks.length}
                </span>

              </div>

              <div className="space-y-4">

                {column.tasks.map((task) => (

                  <div
                    key={task}
                    className="bg-slate-800 rounded-xl p-4 hover:-translate-y-1 transition cursor-pointer"
                  >
                    <h4 className="font-semibold">
                      {task}
                    </h4>

                    <p className="text-sm text-slate-400 mt-2">
                      Sample task description.
                    </p>
                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}