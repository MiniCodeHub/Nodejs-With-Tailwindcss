import { useState, useMemo } from "react";

// -- Types ------------------------------------------------------------------
type EventType = "commit" | "deploy" | "pr" | "review" | "issue" | "comment" | "merge" | "alert";

interface ActivityEvent {
  id: string;
  type: EventType;
  actor: string;
  initials: string;
  avatarColor: string;
  action: string;
  target: string;
  targetUrl?: string;
  timestamp: number;
  branch?: string;
  repo?: string;
  tags?: string[];
  expanded?: boolean;
  details?: string;
}

// -- Seed data --------------------------------------------------------------
const now = Date.now();
const mins  = (n: number) => now - n * 60000;
const hours = (n: number) => now - n * 3600000;
const days  = (n: number) => now - n * 86400000;

const EVENTS: ActivityEvent[] = [
  { id:"1",  type:"alert",   actor:"System",       initials:"SY", avatarColor:"bg-red-500",    action:"raised a critical alert",        target:"High memory usage on prod-3",  timestamp:mins(2),    repo:"infra",  tags:["critical","production"] },
  { id:"2",  type:"deploy",  actor:"Alice Walker",  initials:"AW", avatarColor:"bg-indigo-500", action:"deployed",                        target:"v2.4.1 to production",         timestamp:mins(8),    repo:"nexus-web", branch:"main", tags:["success"] },
  { id:"3",  type:"pr",      actor:"Bob Kim",       initials:"BK", avatarColor:"bg-emerald-500",action:"opened pull request",             target:"feat/dark-mode-v2",            timestamp:mins(22),   repo:"nexus-web", branch:"feat/dark-mode-v2", details:"Implements the new dark mode system using CSS variables. Closes #482." },
  { id:"4",  type:"commit",  actor:"Carol Mendes",  initials:"CM", avatarColor:"bg-pink-500",   action:"pushed 3 commits to",            target:"fix/pagination-bug",           timestamp:mins(45),   repo:"nexus-api",  branch:"fix/pagination-bug" },
  { id:"5",  type:"review",  actor:"Dave Lin",      initials:"DL", avatarColor:"bg-amber-500",  action:"approved pull request",          target:"#512 - Add rate limiting",     timestamp:hours(1),   repo:"nexus-api" },
  { id:"6",  type:"merge",   actor:"Alice Walker",  initials:"AW", avatarColor:"bg-indigo-500", action:"merged",                          target:"feat/auth-improvements into main", timestamp:hours(2), repo:"nexus-web", branch:"main" },
  { id:"7",  type:"issue",   actor:"Frank Chen",    initials:"FC", avatarColor:"bg-cyan-500",   action:"opened issue",                    target:"#523 - Mobile nav breaks on iOS 17", timestamp:hours(3), repo:"nexus-web", tags:["bug","mobile"], details:"Steps to reproduce: Open on iPhone 15 with iOS 17.2. Tap the hamburger menu. Nothing happens." },
  { id:"8",  type:"comment", actor:"Grace Obi",     initials:"GO", avatarColor:"bg-rose-500",   action:"commented on issue",             target:"#498 - Improve onboarding UX", timestamp:hours(5),   repo:"nexus-web", details:"I think we should prioritise the empty state screens first. They have the highest drop-off rate." },
  { id:"9",  type:"commit",  actor:"Bob Kim",       initials:"BK", avatarColor:"bg-emerald-500",action:"pushed 1 commit to",             target:"main",                         timestamp:hours(8),   repo:"nexus-api",  branch:"main" },
  { id:"10", type:"deploy",  actor:"System",        initials:"SY", avatarColor:"bg-slate-500",  action:"deployed",                        target:"v2.4.0 to staging",            timestamp:hours(12),  repo:"nexus-web", branch:"staging", tags:["staging"] },
  { id:"11", type:"pr",      actor:"Carol Mendes",  initials:"CM", avatarColor:"bg-pink-500",   action:"opened pull request",            target:"docs/update-api-reference",    timestamp:days(1),    repo:"nexus-docs", branch:"docs/api-ref" },
  { id:"12", type:"issue",   actor:"Dave Lin",      initials:"DL", avatarColor:"bg-amber-500",  action:"closed issue",                   target:"#501 - Search performance",    timestamp:days(1.5),  repo:"nexus-api",  tags:["resolved"] },
  { id:"13", type:"merge",   actor:"Alice Walker",  initials:"AW", avatarColor:"bg-indigo-500", action:"merged",                          target:"hotfix/xss-vulnerability into main", timestamp:days(2), repo:"nexus-web", tags:["security"] },
  { id:"14", type:"review",  actor:"Frank Chen",    initials:"FC", avatarColor:"bg-cyan-500",   action:"requested changes on",           target:"#519 - New payment flow",      timestamp:days(2.5),  repo:"nexus-web", details:"The loading state is missing. Users will see a blank screen for ~300ms." },
];

// -- Helpers ----------------------------------------------------------------
function timeAgo(ts: number): string {
  const d = Date.now() - ts;
  const m = Math.floor(d/60000), h = Math.floor(d/3600000), dy = Math.floor(d/86400000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${dy}d ago`;
}

function dateLabel(ts: number): string {
  const d = Date.now() - ts;
  if (d < 86400000) return "Today";
  if (d < 172800000) return "Yesterday";
  const date = new Date(ts);
  return date.toLocaleDateString("en-US", { month:"long", day:"numeric" });
}

const TYPE_META: Record<EventType, { icon:string; color:string; dot:string }> = {
  commit:  { icon:"git-commit", color:"text-slate-400",   dot:"bg-slate-500" },
  deploy:  { icon:"rocket",     color:"text-indigo-400",  dot:"bg-indigo-500" },
  pr:      { icon:"git-pr",     color:"text-emerald-400", dot:"bg-emerald-500" },
  review:  { icon:"check",      color:"text-amber-400",   dot:"bg-amber-500" },
  issue:   { icon:"issue",      color:"text-red-400",     dot:"bg-red-500" },
  comment: { icon:"comment",    color:"text-sky-400",     dot:"bg-sky-500" },
  merge:   { icon:"merge",      color:"text-violet-400",  dot:"bg-violet-500" },
  alert:   { icon:"alert",      color:"text-rose-400",    dot:"bg-rose-500" },
};

const TAG_STYLES: Record<string, string> = {
  critical:   "bg-red-500/15 text-red-400 border-red-500/20",
  production: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  success:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  staging:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  bug:        "bg-red-500/15 text-red-400 border-red-500/20",
  mobile:     "bg-sky-500/15 text-sky-400 border-sky-500/20",
  resolved:   "bg-slate-500/15 text-slate-400 border-slate-500/20",
  security:   "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

function EventIcon({ type }: { type: EventType }) {
  const icons: Record<EventType, string> = {
    commit:  "", deploy: "", pr: "", review: "",
    issue:   "", comment:"", merge:"",  alert: "",
  };
  return <span>{icons[type]}</span>;
}

const ALL_TYPES: (EventType | "all")[] = ["all","commit","deploy","pr","review","issue","comment","merge","alert"];
const ALL_REPOS = ["all","nexus-web","nexus-api","nexus-docs","infra"];

// -- Event Row --------------------------------------------------------------
interface RowProps { event: ActivityEvent; isLast: boolean; onToggle:(id:string)=>void; expanded:boolean; }

function EventRow({ event, isLast, onToggle, expanded }: RowProps) {
  const meta = TYPE_META[event.type];

  return (
    <div className="flex gap-3 group">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0 w-8">
        <div className={`w-3 h-3 rounded-full flex-shrink-0 z-10 mt-1 ring-2 ring-slate-950 ${meta.dot}`} />
        {!isLast && <div className="w-0.5 flex-1 bg-slate-800 mt-1" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-5">
        <div className="flex items-start gap-2 flex-wrap">
          {/* Actor avatar */}
          <div className={`w-6 h-6 rounded-full ${event.avatarColor} flex items-center justify-center
            text-[9px] font-bold text-white flex-shrink-0 mt-0.5`}>
            {event.initials}
          </div>

          {/* Main text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-200 leading-snug">
              <span className="font-semibold">{event.actor}</span>
              {" "}{event.action}{" "}
              <span className={`font-medium ${meta.color}`}>{event.target}</span>
              {event.branch && (
                <span className="text-slate-500 text-xs ml-1 font-mono">on {event.branch}</span>
              )}
            </p>

            {/* Repo + time */}
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {event.repo && (
                <span className="text-xs text-slate-600 font-mono">{event.repo}</span>
              )}
              <span className="text-xs text-slate-600">{timeAgo(event.timestamp)}</span>

              {/* Tags */}
              {event.tags?.map(tag => (
                <span key={tag} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border
                  ${TAG_STYLES[tag] || "bg-slate-800 text-slate-500 border-slate-700"}`}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Expandable details */}
            {event.details && (
              <div>
                <button onClick={() => onToggle(event.id)}
                  className="text-xs text-slate-600 hover:text-slate-400 transition mt-1 font-medium">
                  {expanded ? "Hide details " : "Show details "}
                </button>
                {expanded && (
                  <div className="mt-2 p-3 bg-slate-900 border border-slate-800 rounded-xl
                    text-xs text-slate-400 leading-relaxed">
                    {event.details}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Type badge */}
          <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
            bg-slate-800/60 ${meta.color} flex-shrink-0`}>
            <EventIcon type={event.type} />
            <span className="hidden sm:inline">{event.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -- Main Component ---------------------------------------------------------
export default function App() {
  const [typeFilter, setTypeFilter]     = useState<EventType | "all">("all");
  const [repoFilter, setRepoFilter]     = useState("all");
  const [actorSearch, setActorSearch]   = useState("");
  const [expanded, setExpanded]         = useState<Set<string>>(new Set());
  const [showAll, setShowAll]           = useState(false);

  const filtered = useMemo(() => EVENTS.filter(e => {
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    if (repoFilter !== "all" && e.repo !== repoFilter) return false;
    if (actorSearch && !e.actor.toLowerCase().includes(actorSearch.toLowerCase())) return false;
    return true;
  }), [typeFilter, repoFilter, actorSearch]);

  const displayed = showAll ? filtered : filtered.slice(0, 8);

  const toggleExpand = (id: string) => setExpanded(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  // Group by date label
  const grouped = useMemo(() => {
    const map = new Map<string, ActivityEvent[]>();
    displayed.forEach(e => {
      const label = dateLabel(e.timestamp);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(e);
    });
    return map;
  }, [displayed]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold">Activity Feed</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} events</p>
        </div>

        {/* Filters */}
        <div className="space-y-2 mb-6">
          {/* Type filter */}
          <div className="flex gap-1.5 flex-wrap">
            {ALL_TYPES.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition
                  ${typeFilter === t ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Repo + search */}
          <div className="flex gap-2 flex-wrap">
            <select value={repoFilter} onChange={e => setRepoFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs
                text-slate-300 outline-none focus:border-indigo-500 transition cursor-pointer">
              {ALL_REPOS.map(r => <option key={r} value={r}>{r === "all" ? "All repos" : r}</option>)}
            </select>
            <div className="relative">
              <input type="search" placeholder="Filter by actor..." value={actorSearch}
                onChange={e => setActorSearch(e.target.value)}
                className="pl-7 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs
                  text-slate-300 placeholder-slate-600 outline-none focus:border-indigo-500 transition w-44" />
              <span className="absolute left-2.5 top-2 text-slate-600 text-xs"></span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <div className="text-3xl mb-2"></div>
            <p>No events match your filters.</p>
          </div>
        ) : (
          <div>
            {Array.from(grouped.entries()).map(([label, events]) => (
              <div key={label} className="mb-2">
                {/* Date divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-slate-800" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {label}
                  </span>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>

                {events.map((event, i) => (
                  <EventRow key={event.id} event={event}
                    isLast={i === events.length - 1 && label === Array.from(grouped.keys()).slice(-1)[0]}
                    onToggle={toggleExpand}
                    expanded={expanded.has(event.id)} />
                ))}
              </div>
            ))}

            {filtered.length > 8 && (
              <button onClick={() => setShowAll(s => !s)}
                className="w-full py-2.5 text-sm text-slate-500 hover:text-slate-300
                  border border-slate-800 rounded-xl transition mt-2 font-medium">
                {showAll ? "Show less " : `Show ${filtered.length - 8} more events `}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}