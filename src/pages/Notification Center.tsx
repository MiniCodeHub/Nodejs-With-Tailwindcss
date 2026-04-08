import { useState, useMemo, useRef, useEffect } from "react";

// -- Types ------------------------------------------------------------------
type NotifType = "info" | "success" | "warning" | "error" | "message" | "system";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: number;
  read: boolean;
  avatar?: string;
  action?: string;
}

// -- Seed data --------------------------------------------------------------
const now = Date.now();
const seed: Notification[] = [
  { id:"1",  type:"message", title:"Alice Walker",       body:"Hey, can you review the PR I opened this morning?", time:now - 2*60*1000,    read:false, avatar:"AW" },
  { id:"2",  type:"success", title:"Deployment complete",body:"v2.4.1 deployed to production successfully.",        time:now - 8*60*1000,    read:false },
  { id:"3",  type:"warning", title:"High CPU usage",     body:"Server CPU has been above 85% for 10 minutes.",      time:now - 15*60*1000,   read:false },
  { id:"4",  type:"message", title:"Bob Kim",            body:"The design files are ready for handoff.",             time:now - 34*60*1000,   read:false, avatar:"BK" },
  { id:"5",  type:"error",   title:"Build failed",       body:"Pipeline #482 failed at the test stage. See logs.",   time:now - 1*3600*1000,  read:false },
  { id:"6",  type:"info",    title:"New feature flag",   body:"'dark-mode-v2' flag is now available in staging.",    time:now - 2*3600*1000,  read:true  },
  { id:"7",  type:"system",  title:"Scheduled downtime", body:"Maintenance window: Sat 02:00-04:00 UTC.",            time:now - 3*3600*1000,  read:true  },
  { id:"8",  type:"message", title:"Carol Mendes",       body:"Thanks for the review! Merging now.",                 time:now - 5*3600*1000,  read:true,  avatar:"CM" },
  { id:"9",  type:"success", title:"Backup complete",    body:"Daily database backup finished (2.3 GB).",            time:now - 8*3600*1000,  read:true  },
  { id:"10", type:"info",    title:"Usage report",       body:"Your monthly API usage report is ready to download.", time:now - 24*3600*1000, read:true  },
];

// -- Helpers ----------------------------------------------------------------
function uid() { return Math.random().toString(36).slice(2,9); }

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const TYPE_META: Record<NotifType, { icon:string; dot:string; badge:string }> = {
  info:    { icon:"",  dot:"bg-blue-400",   badge:"bg-blue-500/15 text-blue-400 border-blue-500/20"    },
  success: { icon:"",  dot:"bg-emerald-400", badge:"bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  warning: { icon:"", dot:"bg-amber-400",   badge:"bg-amber-500/15 text-amber-400 border-amber-500/20" },
  error:   { icon:"",  dot:"bg-red-400",     badge:"bg-red-500/15 text-red-400 border-red-500/20"       },
  message: { icon:"",  dot:"bg-indigo-400",  badge:"bg-indigo-500/15 text-indigo-400 border-indigo-500/20" },
  system:  { icon:"", dot:"bg-slate-400",   badge:"bg-slate-500/15 text-slate-400 border-slate-500/20" },
};

const FILTERS = ["all", "unread", "message", "system", "info", "warning", "error"] as const;
type Filter = typeof FILTERS[number];

// -- Notification Row -------------------------------------------------------
interface RowProps {
  notif: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotifRow({ notif, onRead, onDelete }: RowProps) {
  const meta = TYPE_META[notif.type];

  return (
    <div
      onClick={() => !notif.read && onRead(notif.id)}
      className={`group relative flex gap-3 px-4 py-3.5 border-b border-slate-800/60
        transition cursor-pointer
        ${notif.read ? "opacity-60 hover:opacity-80" : "hover:bg-slate-800/40"}`}
    >
      {/* Unread dot */}
      {!notif.read && (
        <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      )}

      {/* Avatar / Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {notif.avatar ? (
          <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30
            flex items-center justify-center text-xs font-bold text-indigo-400">
            {notif.avatar}
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700
            flex items-center justify-center text-base">
            {meta.icon}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold truncate ${notif.read ? "text-slate-400" : "text-slate-100"}`}>
            {notif.title}
          </p>
          <span className="text-xs text-slate-600 whitespace-nowrap flex-shrink-0">{timeAgo(notif.time)}</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.body}</p>
        <span className={`inline-block mt-1.5 text-xs font-semibold px-1.5 py-0.5 rounded-md border ${meta.badge}`}>
          {notif.type}
        </span>
      </div>

      {/* Delete button */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(notif.id); }}
        className="absolute right-3 top-3 w-6 h-6 rounded-md bg-slate-800
          text-slate-600 hover:bg-red-500/20 hover:text-red-400
          opacity-0 group-hover:opacity-100 transition
          flex items-center justify-center text-xs"
      >
        
      </button>
    </div>
  );
}

// -- Main Component ---------------------------------------------------------
export default function App() {
  const [notifs, setNotifs]     = useState<Notification[]>(seed);
  const [filter, setFilter]     = useState<Filter>("all");
  const [search, setSearch]     = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  // Close panel on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayed = useMemo(() => {
    return notifs.filter(n => {
      if (filter === "unread" && n.read) return false;
      if (filter !== "all" && filter !== "unread" && n.type !== filter) return false;
      if (search && !n.title.toLowerCase().includes(search.toLowerCase()) &&
                    !n.body.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [notifs, filter, search]);

  const markRead = (id: string) =>
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  const markAllRead = () =>
    setNotifs(ns => ns.map(n => ({ ...n, read: true })));

  const deleteNotif = (id: string) =>
    setNotifs(ns => ns.filter(n => n.id !== id));

  const clearAll = () =>
    setNotifs(ns => ns.filter(n => filter === "all" ? false : !displayed.find(d => d.id === n.id)));

  // Simulate incoming notification
  const pushNew = () => {
    const types: NotifType[] = ["info","success","warning","error","message","system"];
    const t = types[Math.floor(Math.random() * types.length)];
    const messages: Record<NotifType, [string,string]> = {
      info:    ["New integration added", "GitHub Actions is now connected to your workspace."],
      success: ["PR merged",             "Your pull request #512 was merged into main."],
      warning: ["Memory usage high",     "Container memory is at 92% capacity."],
      error:   ["Webhook failed",        "POST to /api/webhook returned 503."],
      message: ["Dave Lin",              "Can we sync on the Q2 roadmap this week?"],
      system:  ["License renewed",       "Your annual licence has been automatically renewed."],
    };
    const [title, body] = messages[t];
    setNotifs(ns => [{
      id: uid(), type: t, title, body, time: Date.now(), read: false,
      avatar: t === "message" ? "DL" : undefined,
    }, ...ns]);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex flex-col items-center justify-start pt-12 px-4">

      {/* Demo toolbar */}
      <div className="w-full max-w-lg mb-6 flex items-center justify-between">
        <h1 className="text-white font-bold text-lg">Notification Center</h1>
        <button onClick={pushNew}
          className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl
            hover:bg-indigo-700 transition active:scale-95">
          + Simulate New
        </button>
      </div>

      {/* Bell button */}
      <div ref={panelRef} className="w-full max-w-lg relative">
        <button
          onClick={() => setPanelOpen(o => !o)}
          className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border
            transition font-medium text-sm
            ${panelOpen
              ? "bg-slate-800 border-indigo-500 text-white"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl relative">
              
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full
                  text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </span>
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30
                rounded-full text-xs font-bold">
                {unreadCount} unread
              </span>
            )}
          </div>
          <span className="text-slate-500 text-xs">{panelOpen ? "" : ""}</span>
        </button>

        {/* Panel */}
        {panelOpen && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-slate-900 border border-slate-800
            rounded-2xl shadow-2xl overflow-hidden z-50">

            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div className="relative flex-1 max-w-[200px]">
                <input type="search" value={search} placeholder="Search..."
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg
                    text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-indigo-500 transition" />
                <span className="absolute left-2 top-2 text-slate-600 text-xs"></span>
              </div>
              <div className="flex gap-2 ml-3">
                {unreadCount > 0 && (
                  <button onClick={markAllRead}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition whitespace-nowrap">
                    Mark all read
                  </button>
                )}
                {displayed.length > 0 && (
                  <button onClick={clearAll}
                    className="text-xs text-slate-500 hover:text-red-400 transition">
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-slate-800">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition
                    ${filter === f ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"}`}>
                  {f === "all" ? `All (${notifs.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto">
              {displayed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                  <span className="text-3xl mb-2"></span>
                  <p className="text-sm font-medium">No notifications</p>
                </div>
              ) : (
                displayed.map(n => (
                  <NotifRow key={n.id} notif={n} onRead={markRead} onDelete={deleteNotif} />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-600">
                {displayed.length} notification{displayed.length !== 1 ? "s" : ""}
              </span>
              <button onClick={() => setPanelOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-300 transition">
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats below */}
      <div className="w-full max-w-lg mt-6 grid grid-cols-3 gap-3">
        {[
          { label:"Total",   value: notifs.length },
          { label:"Unread",  value: unreadCount },
          { label:"Read",    value: notifs.length - unreadCount },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}