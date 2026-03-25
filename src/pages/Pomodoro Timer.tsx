import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Mode = "work" | "short" | "long";

interface Settings {
  work:  number;
  short: number;
  long:  number;
  longAfter: number;
}

interface Task {
  id: number;
  text: string;
  done: boolean;
  pomos: number;
}

// ── Constants ──────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS: Settings = { work: 25, short: 5, long: 15, longAfter: 4 };

const MODE_META: Record<Mode, { label: string; color: string; bg: string; ring: string }> = {
  work:  { label: "Focus",        color: "text-indigo-400", bg: "bg-indigo-500", ring: "#6366f1" },
  short: { label: "Short Break",  color: "text-emerald-400",bg: "bg-emerald-500",ring: "#10b981" },
  long:  { label: "Long Break",   color: "text-sky-400",    bg: "bg-sky-500",    ring: "#0ea5e9" },
};

// ── SVG Ring ───────────────────────────────────────────────────────────────
function Ring({ pct, color, size = 220 }: { pct: number; color: string; size?: number }) {
  const r   = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash}
        style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.5s" }} />
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function App() {
  const [settings, setSettings]     = useState<Settings>(DEFAULT_SETTINGS);
  const [mode, setMode]             = useState<Mode>("work");
  const [secondsLeft, setSecondsLeft] = useState<number>(DEFAULT_SETTINGS.work * 60);
  const [running, setRunning]       = useState<boolean>(false);
  const [pomosCompleted, setPomosCompleted] = useState<number>(0);
  const [sessionPomos, setSessionPomos]    = useState<number>(0);
  const [tasks, setTasks]           = useState<Task[]>([
    { id: 1, text: "Review pull requests",         done: false, pomos: 0 },
    { id: 2, text: "Write unit tests for auth",     done: false, pomos: 0 },
    { id: 3, text: "Update documentation",          done: false, pomos: 0 },
  ]);
  const [taskInput, setTaskInput]   = useState<string>("");
  const [activeTask, setActiveTask] = useState<number | null>(1);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [draftSettings, setDraftSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextId = useRef(4);

  const totalSeconds = settings[mode] * 60;
  const pct = secondsLeft / totalSeconds;
  const meta = MODE_META[mode];

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  // ── Timer logic ──
  const switchMode = useCallback((next: Mode, cfg: Settings = settings) => {
    setMode(next);
    setSecondsLeft(cfg[next] * 60);
    setRunning(false);
  }, [settings]);

  const tick = useCallback(() => {
    setSecondsLeft(prev => {
      if (prev <= 1) {
        // Timer done
        setRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);

        if (mode === "work") {
          setPomosCompleted(p => p + 1);
          setSessionPomos(p => {
            const next = p + 1;
            const nextMode: Mode = next % settings.longAfter === 0 ? "long" : "short";
            setTimeout(() => switchMode(nextMode), 300);
            // Increment active task pomos
            setActiveTask(id => {
              if (id !== null) {
                setTasks(ts => ts.map(t => t.id === id ? { ...t, pomos: t.pomos + 1 } : t));
              }
              return id;
            });
            return next;
          });
        } else {
          setTimeout(() => switchMode("work"), 300);
        }
        return 0;
      }
      return prev - 1;
    });
  }, [mode, settings, switchMode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, tick]);

  // Update title bar
  useEffect(() => {
    document.title = running ? `${mm}:${ss} — ${meta.label}` : "Pomodoro Timer";
  }, [mm, ss, running, meta.label]);

  const toggleRun = () => setRunning(r => !r);
  const reset     = () => { setRunning(false); setSecondsLeft(settings[mode] * 60); };

  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks(ts => [...ts, { id: nextId.current++, text: taskInput.trim(), done: false, pomos: 0 }]);
    setTaskInput("");
  };

  const toggleTask = (id: number) =>
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const removeTask = (id: number) => {
    setTasks(ts => ts.filter(t => t.id !== id));
    setActiveTask(a => a === id ? null : a);
  };

  const saveSettings = () => {
    setSettings(draftSettings);
    switchMode(mode, draftSettings);
    setShowSettings(false);
  };

  // Dots for long-break progress
  const dots = Array.from({ length: settings.longAfter }, (_, i) => i < (sessionPomos % settings.longAfter || (sessionPomos > 0 && sessionPomos % settings.longAfter === 0 ? settings.longAfter : 0)));

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center py-10 px-4">

      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Pomodoro</h1>
          <p className="text-xs text-slate-500 mt-0.5">{sessionPomos} pomos this session</p>
        </div>
        <button onClick={() => { setDraftSettings(settings); setShowSettings(s => !s); }}
          className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white
            hover:bg-slate-700 transition flex items-center justify-center text-base">
          ⚙️
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Timer Settings (minutes)</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {(["work","short","long"] as Mode[]).map(k => (
              <div key={k}>
                <label className="text-xs text-slate-400 font-medium block mb-1 capitalize">
                  {MODE_META[k].label}
                </label>
                <input type="number" min={1} max={60}
                  value={draftSettings[k]}
                  onChange={e => setDraftSettings(d => ({ ...d, [k]: +e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-xl
                    text-sm text-white outline-none focus:border-indigo-500 transition" />
              </div>
            ))}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Long break after</label>
              <input type="number" min={1} max={10}
                value={draftSettings.longAfter}
                onChange={e => setDraftSettings(d => ({ ...d, longAfter: +e.target.value }))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-xl
                  text-sm text-white outline-none focus:border-indigo-500 transition" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowSettings(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition">
              Cancel
            </button>
            <button onClick={saveSettings}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold
                hover:bg-indigo-700 transition">
              Save
            </button>
          </div>
        </div>
      )}

      {/* Mode tabs */}
      <div className="flex gap-1 bg-slate-800 rounded-xl p-1 mb-8 w-full max-w-md">
        {(["work","short","long"] as Mode[]).map(m => (
          <button key={m} onClick={() => { if (!running) switchMode(m); }}
            disabled={running}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition
              ${mode === m ? `${MODE_META[m].bg} text-white` : "text-slate-400 hover:text-white disabled:opacity-50"}`}>
            {MODE_META[m].label}
          </button>
        ))}
      </div>

      {/* Ring + time */}
      <div className="relative flex items-center justify-center mb-8">
        <Ring pct={pct} color={meta.ring} size={220} />
        <div className="absolute flex flex-col items-center">
          <span className={`text-5xl font-extrabold tracking-tighter ${meta.color}`}>
            {mm}:{ss}
          </span>
          <span className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{meta.label}</span>
        </div>
      </div>

      {/* Long-break dots */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: settings.longAfter }, (_, i) => (
          <div key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300
              ${i < (sessionPomos % settings.longAfter) ? "bg-indigo-500 scale-110" : "bg-slate-700"}`} />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-10">
        <button onClick={reset}
          className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 hover:text-white
            hover:bg-slate-700 transition text-xl flex items-center justify-center">
          ↺
        </button>
        <button onClick={toggleRun}
          className={`w-20 h-12 rounded-2xl font-bold text-sm transition
            ${running
              ? "bg-slate-700 text-white hover:bg-slate-600"
              : `${meta.bg} text-white hover:opacity-90`}`}>
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={() => { const next: Mode = mode === "work" ? (sessionPomos % settings.longAfter === settings.longAfter - 1 ? "long" : "short") : "work"; switchMode(next); }}
          className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 hover:text-white
            hover:bg-slate-700 transition text-xl flex items-center justify-center">
          ⏭
        </button>
      </div>

      {/* Tasks */}
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-300">Tasks</h2>
          <span className="text-xs text-slate-500">{tasks.filter(t => t.done).length}/{tasks.length} done</span>
        </div>

        {/* Add task */}
        <div className="flex gap-2 mb-3">
          <input type="text" value={taskInput} placeholder="Add a task..."
            onChange={e => setTaskInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl
              text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition" />
          <button onClick={addTask}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold
              hover:bg-indigo-700 transition">
            Add
          </button>
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id}
              onClick={() => setActiveTask(task.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer
                transition group
                ${activeTask === task.id
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-700 bg-slate-800 hover:border-slate-600"}`}>
              <button onClick={e => { e.stopPropagation(); toggleTask(task.id); }}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  transition ${task.done ? "bg-emerald-500 border-emerald-500" : "border-slate-500 hover:border-indigo-400"}`}>
                {task.done && <span className="text-white text-xs font-bold">✓</span>}
              </button>
              <span className={`flex-1 text-sm ${task.done ? "line-through text-slate-500" : "text-slate-200"}`}>
                {task.text}
              </span>
              {task.pomos > 0 && (
                <span className="text-xs text-indigo-400 font-semibold">{task.pomos}🍅</span>
              )}
              {activeTask === task.id && (
                <span className="text-xs text-indigo-400 font-bold">← active</span>
              )}
              <button onClick={e => { e.stopPropagation(); removeTask(task.id); }}
                className="w-6 h-6 rounded-lg bg-red-500/0 text-slate-600
                  opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400
                  transition flex items-center justify-center text-xs">
                ✕
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-sm text-slate-600 py-6">No tasks yet. Add one above.</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: "Total Pomos",  value: pomosCompleted },
            { label: "This Session", value: sessionPomos   },
            { label: "Tasks Done",   value: tasks.filter(t => t.done).length },
          ].map(s => (
            <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}