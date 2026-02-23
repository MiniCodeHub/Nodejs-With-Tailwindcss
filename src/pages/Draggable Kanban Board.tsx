import { useState, useRef, useCallback } from "react";

interface Card {
  id: string;
  column: string;
  title: string;
  tag: string;
  priority: string;
}

const COLUMNS = ["To Do", "In Progress", "Done"];

const COLUMN_STYLES: Record<string, { accent: string; bg: string; border: string; badge: string; glow: string; dot: string }> = {
  "To Do": {
    accent: "#f97316",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
    glow: "shadow-orange-500/20",
    dot: "bg-orange-400",
  },
  "In Progress": {
    accent: "#3b82f6",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    glow: "shadow-blue-500/20",
    dot: "bg-blue-400",
  },
  Done: {
    accent: "#22c55e",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    badge: "bg-green-500/20 text-green-300 border border-green-500/30",
    glow: "shadow-green-500/20",
    dot: "bg-green-400",
  },
};

const INITIAL_CARDS = [
  { id: "1", column: "To Do", title: "Design system audit", tag: "Design", priority: "high" },
  { id: "2", column: "To Do", title: "Write API documentation", tag: "Docs", priority: "medium" },
  { id: "3", column: "To Do", title: "Set up CI/CD pipeline", tag: "DevOps", priority: "low" },
  { id: "4", column: "In Progress", title: "Implement auth flow", tag: "Backend", priority: "high" },
  { id: "5", column: "In Progress", title: "Build dashboard UI", tag: "Frontend", priority: "high" },
  { id: "6", column: "In Progress", title: "Performance profiling", tag: "Ops", priority: "medium" },
  { id: "7", column: "Done", title: "Database schema design", tag: "Backend", priority: "high" },
  { id: "8", column: "Done", title: "User research sessions", tag: "Research", priority: "medium" },
  { id: "9", column: "Done", title: "Onboarding flow v1", tag: "Frontend", priority: "low" },
];

const PRIORITY_COLORS: Record<string, string> = {
  high: "text-red-400 bg-red-500/10",
  medium: "text-yellow-400 bg-yellow-500/10",
  low: "text-slate-400 bg-slate-500/10",
};

const TAG_COLORS: Record<string, string> = {
  Design: "text-pink-300 bg-pink-500/10",
  Docs: "text-purple-300 bg-purple-500/10",
  DevOps: "text-cyan-300 bg-cyan-500/10",
  Backend: "text-amber-300 bg-amber-500/10",
  Frontend: "text-sky-300 bg-sky-500/10",
  Ops: "text-lime-300 bg-lime-500/10",
  Research: "text-violet-300 bg-violet-500/10",
};

export default function KanbanBoard() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [newCard, setNewCard] = useState<{ column: string | null; text: string }>({ column: null, text: "" });
  const dragCard = useRef<Card | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, card: Card) => {
    dragCard.current = card;
    setDragging(card.id);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragging(null);
    setDragOver(null);
    dragCard.current = null;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, col: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(col);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, col: string) => {
    e.preventDefault();
    if (!dragCard.current) return;
    const id = dragCard.current.id;
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, column: col } : c))
    );
    setDragging(null);
    setDragOver(null);
    dragCard.current = null;
  }, []);

  const addCard = (col: string) => {
    if (!newCard.text.trim()) return;
    setCards((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        column: col,
        title: newCard.text.trim(),
        tag: "General",
        priority: "medium",
      },
    ]);
    setNewCard({ column: null, text: "" });
  };

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] text-white font-mono"
      style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Space+Grotesk:wght@400;600;700&display=swap');
        .card-drag { cursor: grab; }
        .card-drag:active { cursor: grabbing; }
        .dragging-card { opacity: 0.4; transform: rotate(-2deg) scale(0.97); transition: all 0.15s ease; }
        .drop-target { outline: 2px dashed rgba(255,255,255,0.2); outline-offset: 4px; }
        .card-enter { animation: cardSlide 0.25s ease forwards; }
        @keyframes cardSlide {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        scrollbar-width: thin;
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border border-white/20 grid grid-cols-2 gap-0.5 p-1.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/40 rounded-sm" />
            ))}
          </div>
          <div>
            <h1
              className="text-lg font-semibold tracking-tight text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
            >
              TASK BOARD
            </h1>
            <p className="text-xs text-white/30 mt-0.5">sprint_03 · {cards.length} total tasks</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="w-2 h-2 bg-green-400 rounded-full pulse-dot inline-block" />
          live · drag to move
        </div>
      </div>

      {/* Board */}
      <div className="p-8 flex gap-6 overflow-x-auto min-h-[calc(100vh-80px)] items-start">
        {COLUMNS.map((col) => {
          const style = COLUMN_STYLES[col];
          const colCards = cards.filter((c) => c.column === col);
          const isOver = dragOver === col;

          return (
            <div
              key={col}
              className={`flex-1 min-w-[280px] max-w-[340px] flex flex-col rounded-xl border ${style.border} transition-all duration-200 ${
                isOver ? `${style.bg} shadow-lg ${style.glow} drop-target` : "border-white/8 bg-white/2"
              }`}
              onDragOver={(e) => handleDragOver(e, col)}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, col)}
            >
              {/* Column Header */}
              <div className="px-4 pt-4 pb-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${style.dot} pulse-dot`} />
                  <span
                    className="text-sm font-semibold tracking-wide text-white/90"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {col.toUpperCase()}
                  </span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${style.badge}`}>
                  {colCards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 flex flex-col gap-2.5 overflow-y-auto min-h-[200px]">
                {colCards.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-white/15 text-xs py-8">
                    drop here
                  </div>
                )}
                {colCards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card)}
                    onDragEnd={handleDragEnd}
                    className={`card-drag card-enter group relative bg-white/[0.04] border border-white/8 rounded-lg p-3.5 hover:bg-white/[0.07] hover:border-white/15 transition-all duration-150 ${
                      dragging === card.id ? "dragging-card" : ""
                    }`}
                  >
                    {/* Delete button */}
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all text-xs leading-none w-4 h-4 flex items-center justify-center"
                    >
                      ✕
                    </button>

                    {/* Title */}
                    <p className="text-sm text-white/85 leading-snug pr-4 mb-3">
                      {card.title}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          TAG_COLORS[card.tag] || "text-slate-300 bg-slate-500/10"
                        }`}
                      >
                        {card.tag}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono capitalize ${PRIORITY_COLORS[card.priority]}`}
                      >
                        {card.priority}
                      </span>
                    </div>

                    {/* Drag handle indicator */}
                    <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-30 transition-opacity">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                        <circle cx="2" cy="2" r="1" /><circle cx="6" cy="2" r="1" />
                        <circle cx="2" cy="6" r="1" /><circle cx="6" cy="6" r="1" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Card */}
              <div className="p-3 border-t border-white/5">
                {newCard.column === col ? (
                  <div className="flex flex-col gap-2">
                    <input
                      autoFocus
                      value={newCard.text}
                      onChange={(e) => setNewCard({ column: col, text: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addCard(col);
                        if (e.key === "Escape") setNewCard({ column: null, text: "" });
                      }}
                      placeholder="Task name... ↵"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-white/20 font-mono"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => addCard(col)}
                        className="flex-1 text-xs py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setNewCard({ column: null, text: "" })}
                        className="flex-1 text-xs py-1.5 rounded-lg hover:bg-white/5 text-white/30 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setNewCard({ column: col, text: "" })}
                    className="w-full text-xs text-white/25 hover:text-white/50 py-1.5 flex items-center gap-1.5 transition-colors group"
                  >
                    <span className="text-base leading-none group-hover:text-white/40">+</span>
                    Add task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}