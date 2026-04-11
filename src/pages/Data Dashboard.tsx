import { useState, useMemo } from "react";

// -- Types ------------------------------------------------------------------
interface KPI { label: string; value: string; change: string; positive: boolean; icon: string; color: string; }
interface DataPoint { label: string; revenue: number; expenses: number; profit: number; }
interface TopProduct { name: string; sales: number; revenue: number; change: string; positive: boolean; }

// -- Data -------------------------------------------------------------------
const KPIS: KPI[] = [
  { label:"Total Revenue",  value:"$284,320", change:"+14.2%", positive:true,  icon:"", color:"indigo" },
  { label:"Net Profit",     value:"$68,940",  change:"+9.1%",  positive:true,  icon:"", color:"emerald" },
  { label:"Active Users",   value:"24,093",   change:"+22.4%", positive:true,  icon:"", color:"violet" },
  { label:"Churn Rate",     value:"2.1%",     change:"-0.4%",  positive:true,  icon:"", color:"amber" },
  { label:"Avg Order Value",value:"$142.50",  change:"+5.3%",  positive:true,  icon:"", color:"rose" },
  { label:"Support Tickets",value:"84",       change:"+12.0%", positive:false, icon:"", color:"slate" },
];

const MONTHLY: DataPoint[] = [
  { label:"Jan", revenue:42000, expenses:28000, profit:14000 },
  { label:"Feb", revenue:48000, expenses:30000, profit:18000 },
  { label:"Mar", revenue:55000, expenses:32000, profit:23000 },
  { label:"Apr", revenue:51000, expenses:31000, profit:20000 },
  { label:"May", revenue:67000, expenses:35000, profit:32000 },
  { label:"Jun", revenue:72000, expenses:38000, profit:34000 },
  { label:"Jul", revenue:69000, expenses:36000, profit:33000 },
  { label:"Aug", revenue:84320, expenses:40000, profit:44320 },
];

const WEEKLY: DataPoint[] = [
  { label:"Mon", revenue:9800,  expenses:5200, profit:4600  },
  { label:"Tue", revenue:12400, expenses:6800, profit:5600  },
  { label:"Wed", revenue:11200, expenses:6100, profit:5100  },
  { label:"Thu", revenue:15600, expenses:7400, profit:8200  },
  { label:"Fri", revenue:18200, expenses:8900, profit:9300  },
  { label:"Sat", revenue:13400, expenses:6200, profit:7200  },
  { label:"Sun", revenue:9200,  expenses:4800, profit:4400  },
];

const PRODUCTS: TopProduct[] = [
  { name:"Wireless Headphones", sales:1284, revenue:102590, change:"+18.2%", positive:true  },
  { name:"Mechanical Keyboard",  sales:892,  revenue:98012,  change:"+9.4%",  positive:true  },
  { name:"USB-C Hub",             sales:1650, revenue:82350,  change:"+24.1%", positive:true  },
  { name:"Laptop Stand",          sales:740,  revenue:25900,  change:"-3.2%",  positive:false },
  { name:"Webcam HD",             sales:510,  revenue:45900,  change:"+11.8%", positive:true  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; bar: string }> = {
  indigo:  { bg:"bg-indigo-500/10",  text:"text-indigo-400",  bar:"#6366f1" },
  emerald: { bg:"bg-emerald-500/10", text:"text-emerald-400", bar:"#10b981" },
  violet:  { bg:"bg-violet-500/10",  text:"text-violet-400",  bar:"#8b5cf6" },
  amber:   { bg:"bg-amber-500/10",   text:"text-amber-400",   bar:"#f59e0b" },
  rose:    { bg:"bg-rose-500/10",    text:"text-rose-400",    bar:"#f43f5e" },
  slate:   { bg:"bg-slate-500/10",   text:"text-slate-400",   bar:"#64748b" },
};

// -- Donut Chart ------------------------------------------------------------
function DonutChart({ data }: { data:{label:string;value:number;color:string}[] }) {
  const [hovered, setHovered] = useState<number|null>(null);
  const total = data.reduce((s,d) => s+d.value, 0);
  const cx=80, cy=80, R=68, r=46;
  let angle = -Math.PI/2;
  const slices = data.map((d,i) => {
    const start=angle, sweep=(d.value/total)*2*Math.PI;
    angle+=sweep;
    const end=angle, mid=start+sweep/2;
    const push=hovered===i?6:0;
    const ox=Math.cos(mid)*push, oy=Math.sin(mid)*push;
    const large=sweep>Math.PI?1:0;
    const path=`M${cx+ox+R*Math.cos(start)} ${cy+oy+R*Math.sin(start)} A${R} ${R} 0 ${large} 1 ${cx+ox+R*Math.cos(end)} ${cy+oy+R*Math.sin(end)} L${cx+ox+r*Math.cos(end)} ${cy+oy+r*Math.sin(end)} A${r} ${r} 0 ${large} 0 ${cx+ox+r*Math.cos(start)} ${cy+oy+r*Math.sin(start)}Z`;
    return {...d,path,i};
  });
  const active = hovered!==null ? data[hovered] : null;
  return (
    <svg viewBox="0 0 160 160" className="w-full" style={{height:160}}>
      {slices.map(s=>(
        <path key={s.i} d={s.path} fill={s.color} stroke="#0f172a" strokeWidth="2"
          style={{cursor:"pointer",transition:"d 0.15s"}}
          onMouseEnter={()=>setHovered(s.i)} onMouseLeave={()=>setHovered(null)}/>
      ))}
      {active ? (
        <>
          <text x={cx} y={cy-8}  textAnchor="middle" fontSize="8"  fill="#94a3b8">{active.label}</text>
          <text x={cx} y={cy+8}  textAnchor="middle" fontSize="13" fill="#f1f5f9" fontWeight="700">{((active.value/total)*100).toFixed(0)}%</text>
        </>
      ) : (
        <text x={cx} y={cy+6} textAnchor="middle" fontSize="10" fill="#94a3b8">Revenue Mix</text>
      )}
    </svg>
  );
}

// -- SVG Bar Chart ----------------------------------------------------------
type BarKey = "revenue" | "expenses" | "profit";

interface BarChartProps { data: DataPoint[]; }

function BarChart({ data }: BarChartProps) {
  const [hovered, setHovered] = useState<number|null>(null);
  const [active, setActive]   = useState<BarKey[]>(["revenue","expenses","profit"]);

  const W=560, H=200;
  const PAD={top:20,right:12,bottom:28,left:52};
  const iW=W-PAD.left-PAD.right, iH=H-PAD.top-PAD.bottom;

  const maxV = Math.max(...data.flatMap(d => [
    active.includes("revenue") ? d.revenue : 0,
    active.includes("expenses") ? d.expenses : 0,
    active.includes("profit") ? d.profit : 0,
  ])) * 1.15;

  const yS = (v:number) => PAD.top + iH - (v/maxV)*iH;
  const slot = iW/data.length;
  const barKeys: BarKey[] = ["revenue","expenses","profit"];
  const barColors: Record<BarKey,string> = { revenue:"#6366f1", expenses:"#f43f5e", profit:"#10b981" };
  const barsActive = barKeys.filter(k => active.includes(k));
  const bw = Math.min(slot*0.22, 18);
  const yTicks = [0, maxV*0.25, maxV*0.5, maxV*0.75, maxV];

  const fmt = (v:number) => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`;

  const toggle = (k: BarKey) =>
    setActive(a => a.includes(k) ? a.filter(x=>x!==k) : [...a,k]);

  return (
    <div>
      {/* Legend toggles */}
      <div className="flex gap-3 mb-3 flex-wrap">
        {barKeys.map(k => (
          <button key={k} onClick={() => toggle(k)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition
              ${active.includes(k) ? "opacity-100" : "opacity-30"}`}>
            <span className="w-2.5 h-2.5 rounded-sm" style={{background: barColors[k]}}/>
            {k.charAt(0).toUpperCase()+k.slice(1)}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{height:200}}>
        {yTicks.map(v=>(
          <g key={v}>
            <line x1={PAD.left} x2={W-PAD.right} y1={yS(v)} y2={yS(v)} stroke="#1e293b" strokeWidth="1"/>
            <text x={PAD.left-6} y={yS(v)+4} textAnchor="end" fontSize="9" fill="#475569">{fmt(v)}</text>
          </g>
        ))}

        {data.map((d,i) => {
          const cx = PAD.left + i*slot + slot/2;
          const totalBars = barsActive.length;
          const groupW = bw*totalBars + (totalBars-1)*3;
          const startX = cx - groupW/2;
          const isH = hovered===i;
          return (
            <g key={i} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
              style={{cursor:"pointer"}}>
              <rect x={cx-slot/2} y={PAD.top} width={slot} height={iH} fill="transparent"/>
              {barsActive.map((k,bi) => {
                const bx = startX + bi*(bw+3);
                const bh = iH - (yS(d[k])-PAD.top);
                return (
                  <rect key={k} x={bx} y={yS(d[k])} width={bw} height={bh}
                    fill={barColors[k]} opacity={isH?1:0.8} rx="2"
                    style={{transition:"opacity 0.15s"}}/>
                );
              })}
              <text x={cx} y={H-8} textAnchor="middle" fontSize="9" fill="#475569">{d.label}</text>
              {isH && (
                <g>
                  <rect x={cx-52} y={PAD.top} width={104} height={barsActive.length*14+10}
                    rx="6" fill="#1e293b" stroke="#334155"/>
                  {barsActive.map((k,bi)=>(
                    <text key={k} x={cx} y={PAD.top+14+bi*14} textAnchor="middle"
                      fontSize="9" fill={barColors[k]} fontWeight="600">
                      {k}: {fmt(d[k])}
                    </text>
                  ))}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// -- Main Component ---------------------------------------------------------
export default function App() {
  const [period, setPeriod] = useState<"weekly"|"monthly">("monthly");

  const chartData = period === "monthly" ? MONTHLY : WEEKLY;

  const donutData = useMemo(() => [
    { label:"Products",    value:142000, color:"#6366f1" },
    { label:"Services",    value:86000,  color:"#8b5cf6" },
    { label:"Subscriptions",value:56320, color:"#a855f7" },
  ], []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white">

      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-950/90 backdrop-blur z-10">
        <div>
          <h1 className="text-lg font-bold">Analytics Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Last updated: just now</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 rounded-xl p-1">
            {(["weekly","monthly"] as const).map(p => (
              <button key={p} onClick={()=>setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
                  ${period===p ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
                {p.charAt(0).toUpperCase()+p.slice(1)}
              </button>
            ))}
          </div>
          <button className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition">
            Export
          </button>
        </div>
      </header>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {KPIS.map(kpi => {
            const c = COLOR_MAP[kpi.color];
            return (
              <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4
                hover:border-slate-700 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-medium leading-tight">{kpi.label}</span>
                  <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center text-sm`}>
                    {kpi.icon}
                  </div>
                </div>
                <p className="text-xl font-bold text-white tracking-tight">{kpi.value}</p>
                <p className={`text-xs font-semibold mt-1 ${kpi.positive ? "text-emerald-400" : "text-red-400"}`}>
                  {kpi.change}
                </p>
              </div>
            );
          })}
        </div>

        {/* Chart row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Bar chart */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-200">Revenue vs Expenses</h2>
              <span className="text-xs text-slate-500 capitalize">{period} view</span>
            </div>
            <BarChart data={chartData}/>
          </div>

          {/* Donut */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">Revenue Mix</h2>
            <DonutChart data={donutData}/>
            <div className="space-y-2 mt-2">
              {donutData.map(d => (
                <div key={d.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{background:d.color}}/>
                    <span className="text-slate-400">{d.label}</span>
                  </div>
                  <span className="font-semibold text-slate-300">
                    ${(d.value/1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top products table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-slate-200">Top Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Product","Units Sold","Revenue","Change","Bar"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((p, i) => {
                  const maxRev = Math.max(...PRODUCTS.map(x=>x.revenue));
                  return (
                    <tr key={p.name} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400">
                            {i+1}
                          </div>
                          <span className="text-sm text-slate-200 font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">{p.sales.toLocaleString()}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-200">${p.revenue.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-bold ${p.positive?"text-emerald-400":"text-red-400"}`}>
                          {p.change}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 w-36">
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full"
                            style={{width:`${(p.revenue/maxRev)*100}%`}}/>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}