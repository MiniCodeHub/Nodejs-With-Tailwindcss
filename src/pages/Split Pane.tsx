import { useState, useRef, useCallback, useEffect } from "react";
import type { MouseEvent, TouchEvent } from "react";

// -- Types ------------------------------------------------------------------
type Direction = "horizontal" | "vertical";

interface SplitPaneProps {
  direction?: Direction;
  defaultSplit?: number;
  minA?: number;
  minB?: number;
  children: [React.ReactNode, React.ReactNode];
}

// -- SplitPane core ---------------------------------------------------------
function SplitPane({
  direction = "horizontal",
  defaultSplit = 50,
  minA = 15,
  minB = 15,
  children,
}: SplitPaneProps) {
  const [split, setSplit]     = useState(defaultSplit);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPos = (e: MouseEvent | TouchEvent): number => {
    const rect = containerRef.current!.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    if (direction === "horizontal") return ((clientX - rect.left) / rect.width) * 100;
    return ((clientY - rect.top) / rect.height) * 100;
  };

  const onDividerMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDividerTouchStart = useCallback(() => {
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const clientX = "touches" in e ? (e as globalThis.TouchEvent).touches[0].clientX : (e as globalThis.MouseEvent).clientX;
      const clientY = "touches" in e ? (e as globalThis.TouchEvent).touches[0].clientY : (e as globalThis.MouseEvent).clientY;
      let pct = direction === "horizontal"
        ? ((clientX - rect.left) / rect.width) * 100
        : ((clientY - rect.top) / rect.height) * 100;
      pct = Math.max(minA, Math.min(100 - minB, pct));
      setSplit(pct);
    };

    const onUp = () => setDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchend",  onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchend",  onUp);
    };
  }, [dragging, direction, minA, minB]);

  const isH = direction === "horizontal";

  return (
    <div
      ref={containerRef}
      className={`flex w-full h-full ${isH ? "flex-row" : "flex-col"} overflow-hidden`}
      style={{ cursor: dragging ? (isH ? "col-resize" : "row-resize") : "default" }}
    >
      {/* Pane A */}
      <div className="overflow-auto" style={{ [isH ? "width" : "height"]: `${split}%`, flexShrink: 0 }}>
        {children[0]}
      </div>

      {/* Divider */}
      <div
        onMouseDown={onDividerMouseDown}
        onTouchStart={onDividerTouchStart}
        className={`relative flex-shrink-0 group z-10 select-none
          ${isH ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize"}`}
        style={{ background: "#1e2535" }}
      >
        {/* Handle bar */}
        <div className={`absolute bg-slate-600 rounded-full transition-all
          group-hover:bg-indigo-500 ${dragging ? "bg-indigo-500" : ""}
          ${isH
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-16"
            : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-16"}`} />

        {/* Wider invisible hit area */}
        <div className={`absolute ${isH ? "inset-y-0 -inset-x-2" : "inset-x-0 -inset-y-2"}`} />
      </div>

      {/* Pane B */}
      <div className="overflow-auto flex-1 min-w-0 min-h-0">
        {children[1]}
      </div>
    </div>
  );
}

// -- Demo content components ------------------------------------------------
function FileTree() {
  const [open, setOpen] = useState<Set<string>>(new Set(["src","components"]));
  const toggle = (name: string) => setOpen(s => {
    const n = new Set(s);
    n.has(name) ? n.delete(name) : n.add(name);
    return n;
  });

  const items = [
    { name:"src",        type:"folder", depth:0, children:[
      { name:"components", type:"folder", depth:1, children:[
        { name:"Button.tsx",    type:"file", depth:2, ext:"tsx" },
        { name:"Input.tsx",     type:"file", depth:2, ext:"tsx" },
        { name:"Modal.tsx",     type:"file", depth:2, ext:"tsx" },
      ]},
      { name:"hooks",      type:"folder", depth:1, children:[
        { name:"useAuth.ts",    type:"file", depth:2, ext:"ts" },
        { name:"useFetch.ts",   type:"file", depth:2, ext:"ts" },
      ]},
      { name:"App.tsx",    type:"file", depth:1, ext:"tsx" },
      { name:"main.tsx",   type:"file", depth:1, ext:"tsx" },
    ]},
    { name:"public",     type:"folder", depth:0, children:[] },
    { name:"package.json",type:"file", depth:0, ext:"json" },
    { name:"tsconfig.json",type:"file",depth:0, ext:"json" },
  ];

  const EXT_COLORS: Record<string, string> = {
    tsx:"text-sky-400", ts:"text-blue-400",
    json:"text-amber-400", css:"text-pink-400",
  };

  function renderItems(list: any[], parentOpen: boolean = true): React.ReactNode {
    if (!parentOpen) return null;
    return list.map(item => (
      <div key={item.name}>
        <div
          onClick={() => item.type === "folder" && toggle(item.name)}
          style={{ paddingLeft: `${item.depth * 14 + 12}px` }}
          className={`flex items-center gap-2 py-1 px-2 rounded-lg text-xs cursor-pointer
            hover:bg-slate-800/60 transition group
            ${item.type === "folder" ? "text-slate-300" : EXT_COLORS[item.ext] || "text-slate-400"}`}
        >
          <span className="text-sm flex-shrink-0">
            {item.type === "folder"
              ? (open.has(item.name) ? "" : "")
              : (item.ext === "tsx" || item.ext === "ts" ? "" : "")}
          </span>
          <span className="truncate">{item.name}</span>
        </div>
        {item.children && renderItems(item.children, open.has(item.name))}
      </div>
    ));
  }

  return (
    <div className="h-full bg-slate-950 p-2">
      <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Explorer
      </div>
      {renderItems(items)}
    </div>
  );
}

const CODE = `import { useState } from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "ghost";
}

export function Button({
  label,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={() => {
        setPressed(true);
        onClick();
        setTimeout(() => setPressed(false), 150);
      }}
      className={\`btn btn-\${variant}\${pressed ? " pressed" : ""}\`}
    >
      {label}
    </button>
  );
}`;

function CodeEditor() {
  const [code, setCode] = useState(CODE);
  const lines = code.split("\n");
  return (
    <div className="h-full flex flex-col bg-[#0d1117] font-mono text-xs">
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <span className="text-sky-400">Button.tsx</span>
        <span className="text-slate-600 text-[10px]">TypeScript React</span>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="flex min-h-full">
          {/* Line numbers */}
          <div className="select-none text-slate-600 px-3 pt-3 text-right leading-5 flex-shrink-0"
            style={{ minWidth: "2.5rem" }}>
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          {/* Code area */}
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-transparent text-slate-200 p-3 pt-3 resize-none outline-none
              leading-5 whitespace-pre font-mono text-xs"
            style={{ minHeight: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

function OutputPane() {
  return (
    <div className="h-full bg-[#0f1419] p-4 overflow-auto">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Output / Preview</div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-4">
        <p className="text-xs text-slate-400 mb-3">Component renders to:</p>
        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg
          hover:bg-indigo-700 active:scale-95 transition">
          Click Me
        </button>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Console</p>
        <p className="text-xs text-emerald-400 font-mono">Compiled successfully in 142ms</p>
        <p className="text-xs text-slate-500 font-mono mt-1">No TypeScript errors.</p>
      </div>
    </div>
  );
}

// -- Main component ---------------------------------------------------------
export default function App() {
  const [layout, setLayout] = useState<"ide" | "docs" | "comparison">("ide");

  return (
    <div className="h-screen bg-slate-950 font-sans flex flex-col overflow-hidden">
      {/* Toolbar */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-slate-900
        border-b border-slate-800 flex-shrink-0 gap-3">
        <h1 className="text-sm font-bold text-white">Resizable Split Pane</h1>
        <div className="flex gap-1">
          {(["ide", "docs", "comparison"] as const).map(l => (
            <button key={l} onClick={() => setLayout(l)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize
                ${layout === l ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600">Drag the divider to resize</p>
      </header>

      {/* Layout area */}
      <div className="flex-1 overflow-hidden">
        {layout === "ide" && (
          <SplitPane direction="horizontal" defaultSplit={20} minA={12} minB={30}>
            <FileTree />
            <SplitPane direction="vertical" defaultSplit={65} minA={30} minB={15}>
              <CodeEditor />
              <OutputPane />
            </SplitPane>
          </SplitPane>
        )}

        {layout === "docs" && (
          <SplitPane direction="horizontal" defaultSplit={30} minA={20} minB={30}>
            {/* TOC */}
            <div className="h-full bg-slate-950 p-4 overflow-auto">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contents</p>
              {["Introduction","Getting Started","Components","API Reference","Examples","Changelog"].map(item => (
                <div key={item} className="py-2 px-3 text-sm text-slate-400 hover:text-white
                  hover:bg-slate-800 rounded-lg cursor-pointer transition">
                  {item}
                </div>
              ))}
            </div>
            {/* Content */}
            <div className="h-full bg-slate-950 p-8 overflow-auto">
              <h1 className="text-2xl font-bold mb-4 text-white">Getting Started</h1>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                The SplitPane component lets you build resizable layout panels with
                drag handles. It supports horizontal and vertical splitting, and
                can be nested for complex IDE-style layouts.
              </p>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400">
                {`npm install @nexus/split-pane`}
              </div>
            </div>
          </SplitPane>
        )}

        {layout === "comparison" && (
          <SplitPane direction="horizontal" defaultSplit={50} minA={25} minB={25}>
            <div className="h-full bg-slate-950 p-6 overflow-auto">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4">
                Version A - Current
              </div>
              <div className="space-y-3">
                {["Feature parity with main","Updated dependencies","New dark mode tokens","Improved a11y"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-emerald-400">+</span> {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-full bg-slate-950 p-6 overflow-auto">
              <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-4">
                Version B - Legacy
              </div>
              <div className="space-y-3">
                {["Missing dark mode","Deprecated API usage","No TypeScript types","Poor bundle size"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-red-400">-</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </SplitPane>
        )}
      </div>
    </div>
  );
}