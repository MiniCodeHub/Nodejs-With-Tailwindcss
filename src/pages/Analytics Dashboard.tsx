import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface StatCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
  colorClass: string;
}

interface RevenuePoint { month: string; revenue: number; expenses: number; }
interface TrafficPoint { day: string;   visits: number;  conversions: number; }
interface PieSlice     { name: string;  value: number;   color: string; }
interface ActivityItem { id: number;    user: string;    action: string; time: string; avatar: string; }

// ── Data ───────────────────────────────────────────────────────────────────
const STAT_CARDS: StatCard[] = [
  { label: "Total Revenue", value: "$84,320", change: "+12.4%", positive: true,  icon: "💰", colorClass: "bg-indigo-100 text-indigo-600"  },
  { label: "Active Users",  value: "14,093",  change: "+8.1%",  positive: true,  icon: "👥", colorClass: "bg-violet-100 text-violet-600"  },
  { label: "New Orders",    value: "1,284",   change: "-2.3%",  positive: false, icon: "📦", colorClass: "bg-amber-100 text-amber-600"    },
  { label: "Churn Rate",    value: "2.4%",    change: "-0.5%",  positive: true,  icon: "📉", colorClass: "bg-emerald-100 text-emerald-600" },
];

const REVENUE: RevenuePoint[] = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Feb", revenue: 48000, expenses: 30000 },
  { month: "Mar", revenue: 55000, expenses: 32000 },
  { month: "Apr", revenue: 51000, expenses: 29000 },
  { month: "May", revenue: 67000, expenses: 35000 },
  { month: "Jun", revenue: 72000, expenses: 38000 },
  { month: "Jul", revenue: 69000, expenses: 36000 },
  { month: "Aug", revenue: 84320, expenses: 40000 },
];

const TRAFFIC: TrafficPoint[] = [
  { day: "Mon", visits: 1200, conversions: 180 },
  { day: "Tue", visits: 1800, conversions: 240 },
  { day: "Wed", visits: 1500, conversions: 210 },
  { day: "Thu", visits: 2200, conversions: 320 },
  { day: "Fri", visits: 2600, conversions: 390 },
  { day: "Sat", visits: 1900, conversions: 280 },
  { day: "Sun", visits: 1300, conversions: 160 },
];

const PIE_DATA: PieSlice[] = [
  { name: "Organic",  value: 38, color: "#6366f1" },
  { name: "Direct",   value: 25, color: "#8b5cf6" },
  { name: "Referral", value: 20, color: "#a855f7" },
  { name: "Social",   value: 17, color: "#c084fc" },
];

const ACTIVITY: ActivityItem[] = [
  { id: 1, user: "Alice W.",  action: "Placed order #5091",        time: "2 min ago",  avatar: "AW" },
  { id: 2, user: "Bob K.",    action: "Upgraded to Pro plan",       time: "14 min ago", avatar: "BK" },
  { id: 3, user: "Carol M.",  action: "Submitted a support ticket", time: "1 hr ago",   avatar: "CM" },
  { id: 4, user: "Dave L.",   action: "Completed onboarding",       time: "3 hr ago",   avatar: "DL" },
  { id: 5, user: "Eve R.",    action: "Exported monthly report",    time: "5 hr ago",   avatar: "ER" },
];

// ── Pure SVG Line Chart ────────────────────────────────────────────────────
function LineChart() {
  const [hovered, setHovered] = useState<number | null>(null);

  const W = 500; const H = 190;
  const PAD = { top: 20, right: 20, bottom: 30, left: 52 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top  - PAD.bottom;
  const maxV = 90000;
  const yTicks = [0, 20000, 40000, 60000, 80000];

  const xS = (i: number) => PAD.left + (i / (REVENUE.length - 1)) * iW;
  const yS = (v: number) => PAD.top  + iH - (v / maxV) * iH;

  const line = (key: "revenue" | "expenses") =>
    REVENUE.map((d, i) => `${xS(i)},${yS(d[key])}`).join(" ");

  const area = (key: "revenue" | "expenses") => {
    const pts = REVENUE.map((d, i) => `${xS(i)} ${yS(d[key])}`).join(" L ");
    return `M ${xS(0)} ${yS(0)} L ${pts} L ${xS(REVENUE.length - 1)} ${yS(0)} Z`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 190 }}>
      {/* Grid */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={PAD.left} x2={W - PAD.right} y1={yS(v)} y2={yS(v)}
            stroke="#f1f5f9" strokeWidth="1" />
          <text x={PAD.left - 8} y={yS(v) + 4} textAnchor="end" fontSize="9" fill="#94a3b8">
            ${v / 1000}k
          </text>
        </g>
      ))}

      {/* Areas */}
      <path d={area("expenses")} fill="#e2e8f0" opacity="0.3" />
      <path d={area("revenue")}  fill="#6366f1" opacity="0.08" />

      {/* Lines */}
      <polyline points={line("expenses")} fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" />
      <polyline points={line("revenue")}  fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Points + tooltips */}
      {REVENUE.map((d, i) => (
        <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
          style={{ cursor: "pointer" }}>
          <rect x={xS(i) - 12} y={PAD.top} width={24} height={iH} fill="transparent" />
          {/* X label */}
          <text x={xS(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.month}</text>
          {/* Revenue dot */}
          <circle cx={xS(i)} cy={yS(d.revenue)} r={hovered === i ? 5 : 3}
            fill={hovered === i ? "#6366f1" : "#fff"} stroke="#6366f1" strokeWidth="2" />
          {/* Expenses dot */}
          <circle cx={xS(i)} cy={yS(d.expenses)} r={hovered === i ? 4 : 2.5}
            fill={hovered === i ? "#94a3b8" : "#fff"} stroke="#94a3b8" strokeWidth="1.5" />
          {/* Tooltip */}
          {hovered === i && (
            <g>
              <rect x={xS(i) - 44} y={yS(d.revenue) - 50} width={88} height={44}
                rx="7" fill="white" stroke="#e2e8f0" strokeWidth="1"
                style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))" }} />
              <text x={xS(i)} y={yS(d.revenue) - 30} textAnchor="middle" fontSize="10"
                fill="#6366f1" fontWeight="700">Rev ${(d.revenue / 1000).toFixed(0)}k</text>
              <text x={xS(i)} y={yS(d.revenue) - 14} textAnchor="middle" fontSize="9" fill="#94a3b8">
                Exp ${(d.expenses / 1000).toFixed(0)}k
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

// ── Pure SVG Bar Chart ─────────────────────────────────────────────────────
function BarChart() {
  const [hovered, setHovered] = useState<number | null>(null);

  const W = 500; const H = 190;
  const PAD = { top: 20, right: 20, bottom: 30, left: 44 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top  - PAD.bottom;
  const maxV = 3000;
  const yTicks = [0, 500, 1000, 1500, 2000, 2500];

  const yS   = (v: number) => PAD.top + iH - (v / maxV) * iH;
  const slot  = iW / TRAFFIC.length;
  const bw    = slot * 0.28;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 190 }}>
      {yTicks.map(v => (
        <g key={v}>
          <line x1={PAD.left} x2={W - PAD.right} y1={yS(v)} y2={yS(v)}
            stroke="#f1f5f9" strokeWidth="1" />
          <text x={PAD.left - 6} y={yS(v) + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>
        </g>
      ))}

      {TRAFFIC.map((d, i) => {
        const cx  = PAD.left + i * slot + slot / 2;
        const isH = hovered === i;
        const vH  = iH - (yS(d.visits)      - PAD.top);
        const cH  = iH - (yS(d.conversions) - PAD.top);

        return (
          <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}>
            <rect x={cx - bw - 2} y={yS(d.visits)} width={bw} height={vH}
              fill={isH ? "#4f46e5" : "#6366f1"} rx="3" />
            <rect x={cx + 2} y={yS(d.conversions)} width={bw} height={cH}
              fill={isH ? "#818cf8" : "#a5b4fc"} rx="3" />
            <text x={cx} y={H - 8} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.day}</text>
            {isH && (
              <g>
                <rect x={cx - 42} y={PAD.top + 2} width={84} height={40}
                  rx="7" fill="white" stroke="#e2e8f0"
                  style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))" }} />
                <text x={cx} y={PAD.top + 18} textAnchor="middle" fontSize="10"
                  fill="#6366f1" fontWeight="700">Visits {d.visits}</text>
                <text x={cx} y={PAD.top + 33} textAnchor="middle" fontSize="9" fill="#a5b4fc">
                  Conv {d.conversions}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Pure SVG Donut Chart ───────────────────────────────────────────────────
function DonutChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const cx = 80; const cy = 80; const R = 64; const r = 42;
  const total = PIE_DATA.reduce((s, d) => s + d.value, 0);

  let angle = -Math.PI / 2;
  const slices = PIE_DATA.map((d, idx) => {
    const startA = angle;
    const sweep  = (d.value / total) * 2 * Math.PI;
    angle += sweep;
    const endA = angle;
    const scale = hovered === idx ? 1.06 : 1.0;
    const midA  = startA + sweep / 2;
    const ox    = hovered === idx ? Math.cos(midA) * 4 : 0;
    const oy    = hovered === idx ? Math.sin(midA) * 4 : 0;

    const x1 = cx + ox + R * scale * Math.cos(startA);
    const y1 = cy + oy + R * scale * Math.sin(startA);
    const x2 = cx + ox + R * scale * Math.cos(endA);
    const y2 = cy + oy + R * scale * Math.sin(endA);
    const xi1 = cx + ox + r * Math.cos(endA);
    const yi1 = cy + oy + r * Math.sin(endA);
    const xi2 = cx + ox + r * Math.cos(startA);
    const yi2 = cy + oy + r * Math.sin(startA);
    const large = sweep > Math.PI ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${R * scale} ${R * scale} 0 ${large} 1 ${x2} ${y2}`,
      `L ${xi1} ${yi1}`,
      `A ${r} ${r} 0 ${large} 0 ${xi2} ${yi2}`,
      "Z",
    ].join(" ");

    return { ...d, path, idx };
  });

  const active = hovered !== null ? PIE_DATA[hovered] : null;

  return (
    <svg viewBox="0 0 160 160" className="w-full" style={{ height: 160 }}>
      {slices.map(s => (
        <path key={s.idx} d={s.path} fill={s.color} stroke="white" strokeWidth="2"
          style={{ cursor: "pointer", transition: "d 0.15s ease" }}
          onMouseEnter={() => setHovered(s.idx)}
          onMouseLeave={() => setHovered(null)} />
      ))}
      {active ? (
        <>
          <text x={cx} y={cy - 7}  textAnchor="middle" fontSize="9"  fill="#94a3b8">{active.name}</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="16" fill="#1e293b" fontWeight="800">{active.value}%</text>
        </>
      ) : (
        <>
          <text x={cx} y={cy - 7}  textAnchor="middle" fontSize="9"  fill="#94a3b8">Total</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="16" fill="#1e293b" fontWeight="800">100%</text>
        </>
      )}
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState<"revenue" | "traffic">("revenue");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <aside className="w-56 bg-gray-900 text-white flex flex-col flex-shrink-0">
          <div className="px-5 py-5 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm">N</div>
              <span className="font-semibold text-sm">Nexus HQ</span>
            </div>
          </div>
          <nav className="flex-1 py-4">
            {[
              { icon: "📊", label: "Dashboard", active: true  },
              { icon: "📦", label: "Orders",    active: false },
              { icon: "👥", label: "Users",     active: false },
              { icon: "💬", label: "Messages",  active: false },
              { icon: "⚙️", label: "Settings",  active: false },
            ].map(item => (
              <div key={item.label}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium cursor-pointer transition
                  ${item.active ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
          <div className="px-5 py-4 border-t border-gray-700 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">JD</div>
            <div>
              <p className="text-xs font-medium">Jane Doe</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-400">Welcome back, Jane!</p>
            </div>
            <button className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition">
              Export Report
            </button>
          </header>

          <div className="p-6 space-y-6">

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STAT_CARDS.map(card => (
                <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${card.colorClass}`}>
                      {card.icon}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className={`text-xs font-semibold mt-1 ${card.positive ? "text-emerald-500" : "text-red-400"}`}>
                    {card.change} vs last month
                  </p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Line / Bar toggle */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-gray-800 text-sm">Performance Overview</h2>
                  <div className="flex gap-1">
                    {(["revenue", "traffic"] as const).map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition
                          ${activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Legend */}
                <div className="flex gap-4 mb-1">
                  {activeTab === "revenue" ? (
                    <>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-4 h-0.5 bg-indigo-500 inline-block rounded" />Revenue
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-4 h-0.5 bg-gray-300 inline-block rounded" />Expenses
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-3 h-2.5 bg-indigo-500 inline-block rounded-sm" />Visits
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-3 h-2.5 bg-indigo-300 inline-block rounded-sm" />Conversions
                      </span>
                    </>
                  )}
                </div>
                {activeTab === "revenue" ? <LineChart /> : <BarChart />}
              </div>

              {/* Donut */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h2 className="font-semibold text-gray-800 text-sm mb-1">Traffic Sources</h2>
                <DonutChart />
                <div className="space-y-2 mt-1">
                  {PIE_DATA.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        <span className="text-gray-600">{d.name}</span>
                      </div>
                      <span className="font-semibold text-gray-800">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="font-semibold text-gray-800 text-sm mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {ACTIVITY.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {item.avatar}
                    </div>
                    <p className="flex-1 text-sm text-gray-800">
                      <span className="font-semibold">{item.user}</span> {item.action}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}