import { useState } from "react";

type Comment = {
  id: number;
  text: string;
  createdAt: string;
};

type Activity = {
  id: number;
  message: string;
  createdAt: string;
};

type Task = {
  id: number;
  title: string;
  comments: Comment[];
  activities: Activity[];
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Design Landing Page",
    comments: [
      {
        id: 1,
        text: "The hero section looks good.",
        createdAt: "Today, 10:30 AM",
      },
    ],
    activities: [
      {
        id: 1,
        message: "Task created",
        createdAt: "Today, 9:00 AM",
      },
      {
        id: 2,
        message: "Comment added",
        createdAt: "Today, 10:30 AM",
      },
    ],
  },
  {
    id: 2,
    title: "Build Authentication",
    comments: [],
    activities: [
      {
        id: 3,
        message: "Task created",
        createdAt: "Today, 8:45 AM",
      },
    ],
  },
];

export default function App() {
  const [tasks, setTasks] =
    useState<Task[]>(initialTasks);

  const [selectedTask, setSelectedTask] =
    useState<number | null>(null);

  const [comment, setComment] = useState("");

  const task = tasks.find(
    (item) => item.id === selectedTask
  );

  function addComment() {
    if (!task || !comment.trim()) return;

    const now = new Date();

    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newComment: Comment = {
      id: Date.now(),
      text: comment.trim(),
      createdAt: `Today, ${time}`,
    };

    const newActivity: Activity = {
      id: Date.now() + 1,
      message: "Comment added",
      createdAt: `Today, ${time}`,
    };

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === task.id
          ? {
              ...item,
              comments: [
                ...item.comments,
                newComment,
              ],
              activities: [
                ...item.activities,
                newActivity,
              ],
            }
          : item
      )
    );

    setComment("");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        TaskFlow
      </h1>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Tasks */}

        <div className="space-y-4">

          <h2 className="text-2xl font-semibold">
            Tasks
          </h2>

          {tasks.map((item) => (

            <button
              key={item.id}
              onClick={() =>
                setSelectedTask(item.id)
              }
              className={`w-full text-left p-5 rounded-xl border transition ${
                selectedTask === item.id
                  ? "border-blue-500 bg-slate-800"
                  : "border-slate-800 bg-slate-900 hover:bg-slate-800"
              }`}
            >

              <h3 className="text-lg font-semibold">
                {item.title}
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                {item.comments.length} comments
              </p>

            </button>

          ))}

        </div>

        {/* Details */}

        <div className="bg-slate-900 rounded-xl p-6">

          {!task ? (

            <div className="text-slate-400">
              Select a task to view details.
            </div>

          ) : (

            <>
              <h2 className="text-2xl font-bold mb-6">
                {task.title}
              </h2>

              {/* Comments */}

              <h3 className="font-semibold mb-3">
                Comments
              </h3>

              <div className="space-y-3 mb-5">

                {task.comments.length === 0 && (
                  <p className="text-slate-500">
                    No comments yet.
                  </p>
                )}

                {task.comments.map((item) => (

                  <div
                    key={item.id}
                    className="bg-slate-800 rounded-lg p-4"
                  >

                    <p>{item.text}</p>

                    <span className="text-xs text-slate-400">
                      {item.createdAt}
                    </span>

                  </div>

                ))}

              </div>

              {/* Add Comment */}

              <div className="flex gap-2 mb-8">

                <input
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addComment();
                    }
                  }}
                  placeholder="Write a comment..."
                  className="flex-1 bg-slate-800 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={addComment}
                  className="bg-blue-600 hover:bg-blue-500 px-5 rounded-lg"
                >
                  Add
                </button>

              </div>

              {/* Activity Timeline */}

              <h3 className="font-semibold mb-4">
                Activity Timeline
              </h3>

              <div className="border-l border-slate-700 ml-2">

                {task.activities.map((activity) => (

                  <div
                    key={activity.id}
                    className="relative pl-6 pb-5"
                  >

                    <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-blue-500" />

                    <p className="text-sm">
                      {activity.message}
                    </p>

                    <span className="text-xs text-slate-500">
                      {activity.createdAt}
                    </span>

                  </div>

                ))}

              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
}