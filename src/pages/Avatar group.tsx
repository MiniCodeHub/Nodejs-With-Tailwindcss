import { useState, useRef, useEffect } from "react";

// -- Types ------------------------------------------------------------------
interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  status: "online" | "away" | "offline" | "busy";
  avatarUrl?: string;
}

type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Overlap = "tight" | "normal" | "loose";

interface AvatarGroupProps {
  users: User[];
  max?: number;
  size?: Size;
  overlap?: Overlap;
  showTooltip?: boolean;
  showStatus?: boolean;
  onMoreClick?: () => void;
}

// -- Helpers ----------------------------------------------------------------
const SIZE_MAP: Record<Size, { avatar: string; status: string; text: string; border: string }> = {
  xs: { avatar:"w-6 h-6",   status:"w-1.5 h-1.5", text:"text-[9px]",   border:"border" },
  sm: { avatar:"w-8 h-8",   status:"w-2 h-2",     text:"text-[10px]",  border:"border-2" },
  md: { avatar:"w-10 h-10", status:"w-2.5 h-2.5", text:"text-xs",      border:"border-2" },
  lg: { avatar:"w-12 h-12", status:"w-3 h-3",     text:"text-sm",      border:"border-[3px]" },
  xl: { avatar:"w-16 h-16", status:"w-3.5 h-3.5", text:"text-base",    border:"border-4" },
};

const OVERLAP_MAP: Record<Overlap, string> = {
  tight:  "-space-x-4",
  normal: "-space-x-3",
  loose:  "-space-x-1",
};

const STATUS_COLORS: Record<User["status"], string> = {
  online:  "bg-emerald-400",
  away:    "bg-amber-400",
  offline: "bg-slate-500",
  busy:    "bg-red-400",
};

const STATUS_LABELS: Record<User["status"], string> = {
  online:"Online", away:"Away", offline:"Offline", busy:"Busy",
};

// -- Tooltip ----------------------------------------------------------------
function Tooltip({ name, role, status, visible }:
  { name:string; role:string; status:User["status"]; visible:boolean }) {
  return (
    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
      bg-slate-800 border border-slate-700 rounded-xl shadow-xl px-3 py-2
      whitespace-nowrap pointer-events-none transition-all duration-150
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
      <p className="text-xs font-semibold text-white">{name}</p>
      <p className="text-[10px] text-slate-400">{role}</p>
      <div className="flex items-center gap-1 mt-1">
        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[status]}`}/>
        <span className="text-[10px] text-slate-500">{STATUS_LABELS[status]}</span>
      </div>
      {/* Arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
    </div>
  );
}

// -- Single Avatar ----------------------------------------------------------
function Avatar({ user, size, showTooltip, showStatus }:
  { user:User; size:Size; showTooltip?:boolean; showStatus?:boolean }) {
  const [hovered, setHovered] = useState(false);
  const s = SIZE_MAP[size];

  return (
    <div className="relative flex-shrink-0" style={{ zIndex: hovered ? 20 : 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className={`${s.avatar} ${s.border} border-slate-950 rounded-full
        ${user.color} flex items-center justify-center font-bold text-white
        ring-2 ring-transparent hover:ring-white/30 transition-all duration-150
        cursor-pointer select-none`}
        style={{ zIndex: hovered ? 20 : "auto" }}>
        <span className={s.text}>{user.initials}</span>
      </div>

      {showStatus && (
        <span className={`absolute bottom-0 right-0 ${s.status} rounded-full
          ${STATUS_COLORS[user.status]} ring-2 ring-slate-950`} />
      )}

      {showTooltip && (
        <Tooltip name={user.name} role={user.role} status={user.status} visible={hovered} />
      )}
    </div>
  );
}

// -- Overflow Bubble --------------------------------------------------------
function OverflowBubble({ count, size, users, onMoreClick }:
  { count:number; size:Size; users:User[]; onMoreClick?:()=>void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const s = SIZE_MAP[size];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0" style={{ zIndex: open ? 30 : 1 }}>
      <button
        onClick={() => { setOpen(o => !o); onMoreClick?.(); }}
        className={`${s.avatar} ${s.border} border-slate-950 rounded-full
          bg-slate-700 hover:bg-slate-600 flex items-center justify-center
          font-bold text-slate-300 hover:text-white transition-all cursor-pointer`}>
        <span className={s.text}>+{count}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
          bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-2 w-52">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
            {count} more
          </p>
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {users.map(u => (
              <div key={u.id} className="flex items-center gap-2.5 px-2 py-2 rounded-xl
                hover:bg-slate-700 transition cursor-pointer">
                <div className={`w-7 h-7 rounded-full ${u.color} flex items-center justify-center
                  text-[9px] font-bold text-white flex-shrink-0 relative`}>
                  {u.initials}
                  <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full
                    ${STATUS_COLORS[u.status]} ring-1 ring-slate-800`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{u.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{u.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// -- AvatarGroup ------------------------------------------------------------
function AvatarGroup({
  users, max = 5, size = "md", overlap = "normal",
  showTooltip = true, showStatus = false, onMoreClick,
}: AvatarGroupProps) {
  const visible  = users.slice(0, max);
  const overflow = users.slice(max);

  return (
    <div className={`flex items-center ${OVERLAP_MAP[overlap]}`}>
      {visible.map(u => (
        <Avatar key={u.id} user={u} size={size} showTooltip={showTooltip} showStatus={showStatus} />
      ))}
      {overflow.length > 0 && (
        <OverflowBubble count={overflow.length} size={size} users={overflow} onMoreClick={onMoreClick} />
      )}
    </div>
  );
}

// -- Seed data --------------------------------------------------------------
const USERS: User[] = [
  { id:"1",  name:"Alice Walker",  initials:"AW", color:"bg-indigo-500",  role:"Senior Designer",      status:"online"  },
  { id:"2",  name:"Bob Kim",       initials:"BK", color:"bg-emerald-500", role:"Staff Engineer",       status:"online"  },
  { id:"3",  name:"Carol Mendes",  initials:"CM", color:"bg-pink-500",    role:"Product Manager",      status:"busy"    },
  { id:"4",  name:"Dave Lin",      initials:"DL", color:"bg-amber-500",   role:"ML Engineer",          status:"away"    },
  { id:"5",  name:"Eve Rahman",    initials:"ER", color:"bg-violet-500",  role:"Design Lead",          status:"online"  },
  { id:"6",  name:"Frank Chen",    initials:"FC", color:"bg-cyan-500",    role:"Frontend Dev",         status:"offline" },
  { id:"7",  name:"Grace Obi",     initials:"GO", color:"bg-rose-500",    role:"Eng Manager",          status:"online"  },
  { id:"8",  name:"Hiro Tanaka",   initials:"HT", color:"bg-sky-500",     role:"Backend Dev",          status:"away"    },
  { id:"9",  name:"Isla Novak",    initials:"IN", color:"bg-lime-500",    role:"Marketing Lead",       status:"offline" },
  { id:"10", name:"James Adu",     initials:"JA", color:"bg-orange-500",  role:"DevOps Engineer",      status:"online"  },
  { id:"11", name:"Kara Singh",    initials:"KS", color:"bg-teal-500",    role:"Scrum Master",         status:"busy"    },
  { id:"12", name:"Leo Ferreira",  initials:"LF", color:"bg-fuchsia-500", role:"Data Engineer",        status:"online"  },
];

// -- Demo Page --------------------------------------------------------------
const SIZES: Size[] = ["xs","sm","md","lg","xl"];
const OVERLAPS: Overlap[] = ["tight","normal","loose"];

export default function App() {
  const [activeSize, setActiveSize]       = useState<Size>("md");
  const [activeOverlap, setActiveOverlap] = useState<Overlap>("normal");
  const [maxShown, setMaxShown]           = useState(5);
  const [showStatus, setShowStatus]       = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white p-6">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold tracking-tight">Avatar Group</h1>
          <p className="text-sm text-slate-500 mt-1">Hover avatars for tooltips. Click +N to see overflow users.</p>
        </div>

        {/* Interactive controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Playground</p>

          {/* Size */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-slate-500 w-16">Size</span>
            {SIZES.map(s => (
              <button key={s} onClick={() => setActiveSize(s)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition
                  ${activeSize===s ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Overlap */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-slate-500 w-16">Overlap</span>
            {OVERLAPS.map(o => (
              <button key={o} onClick={() => setActiveOverlap(o)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition
                  ${activeOverlap===o ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                {o}
              </button>
            ))}
          </div>

          {/* Max + status toggle */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Max visible</span>
              <input type="range" min={1} max={12} value={maxShown}
                onChange={e => setMaxShown(+e.target.value)}
                className="w-24 accent-indigo-600" />
              <span className="text-xs text-white w-4">{maxShown}</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showStatus}
                onChange={e => setShowStatus(e.target.checked)}
                className="accent-indigo-600" />
              <span className="text-xs text-slate-400">Show status</span>
            </label>
          </div>

          {/* Live preview */}
          <div className="pt-2">
            <AvatarGroup users={USERS} max={maxShown} size={activeSize}
              overlap={activeOverlap} showStatus={showStatus} />
          </div>
        </div>

        {/* All size variants */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">All Sizes</p>
          {SIZES.map(s => (
            <div key={s} className="flex items-center gap-4">
              <span className="text-xs text-slate-600 uppercase w-8">{s}</span>
              <AvatarGroup users={USERS} max={5} size={s} showStatus overlap="normal" />
            </div>
          ))}
        </div>

        {/* Use-case demos */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Use Cases</p>

          {/* Kanban card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Design system audit</p>
              <p className="text-xs text-slate-500 mt-0.5">Due in 3 days</p>
            </div>
            <AvatarGroup users={USERS.slice(0,4)} max={3} size="sm" showStatus overlap="tight" />
          </div>

          {/* Meeting row */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Sprint planning</p>
              <p className="text-xs text-slate-500">Today at 2:00 PM</p>
            </div>
            <AvatarGroup users={USERS.slice(0,8)} max={4} size="sm" showStatus overlap="tight" />
          </div>

          {/* PR reviewer row */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-500 mb-3">feat/dark-mode-v2 -- Reviewers</p>
            <div className="flex items-center justify-between">
              <AvatarGroup users={USERS.slice(0,5)} max={4} size="md" showStatus showTooltip overlap="normal" />
              <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold
                rounded-xl hover:bg-indigo-700 transition">
                + Add reviewer
              </button>
            </div>
          </div>

          {/* Online users */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-300">Online now</p>
              <span className="text-xs text-emerald-400 font-semibold">
                {USERS.filter(u => u.status === "online").length} online
              </span>
            </div>
            <AvatarGroup
              users={USERS.filter(u => u.status === "online")}
              max={6} size="md" showStatus showTooltip overlap="normal" />
          </div>

          {/* Large group */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-500 mb-3">Full team ({USERS.length} members)</p>
            <AvatarGroup users={USERS} max={6} size="lg" showStatus showTooltip overlap="normal" />
          </div>
        </div>

        {/* Status legend */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Status Legend</p>
          <div className="flex flex-wrap gap-4">
            {(["online","away","busy","offline"] as User["status"][]).map(s => (
              <div key={s} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[s]}`}/>
                <span className="text-xs text-slate-400 capitalize">{s}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}