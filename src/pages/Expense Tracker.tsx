import { useState, useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Category = "Food" | "Transport" | "Housing" | "Health" | "Shopping" | "Entertainment" | "Other";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: Category;
  date: string;
}

interface FormState {
  description: string;
  amount: string;
  category: Category;
  date: string;
}

interface FormErrors {
  description?: string;
  amount?: string;
  date?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = ["Food", "Transport", "Housing", "Health", "Shopping", "Entertainment", "Other"];

const CAT_META: Record<Category, { icon: string; color: string; bg: string; bar: string }> = {
  Food:          { icon: "🍔", color: "text-orange-600",  bg: "bg-orange-100",  bar: "#f97316" },
  Transport:     { icon: "🚗", color: "text-blue-600",    bg: "bg-blue-100",    bar: "#3b82f6" },
  Housing:       { icon: "🏠", color: "text-violet-600",  bg: "bg-violet-100",  bar: "#8b5cf6" },
  Health:        { icon: "💊", color: "text-emerald-600", bg: "bg-emerald-100", bar: "#10b981" },
  Shopping:      { icon: "🛍️", color: "text-pink-600",    bg: "bg-pink-100",    bar: "#ec4899" },
  Entertainment: { icon: "🎬", color: "text-amber-600",   bg: "bg-amber-100",   bar: "#f59e0b" },
  Other:         { icon: "📦", color: "text-slate-600",   bg: "bg-slate-100",   bar: "#64748b" },
};

const INITIAL_EXPENSES: Expense[] = [
  { id: 1, description: "Grocery run",        amount: 84.50,  category: "Food",          date: "2025-03-01" },
  { id: 2, description: "Monthly rent",       amount: 1200.00, category: "Housing",      date: "2025-03-01" },
  { id: 3, description: "Bus pass",           amount: 32.00,  category: "Transport",     date: "2025-03-02" },
  { id: 4, description: "Netflix",            amount: 15.99,  category: "Entertainment", date: "2025-03-03" },
  { id: 5, description: "Pharmacy",           amount: 22.40,  category: "Health",        date: "2025-03-04" },
  { id: 6, description: "Dinner out",         amount: 58.00,  category: "Food",          date: "2025-03-05" },
  { id: 7, description: "New sneakers",       amount: 110.00, category: "Shopping",      date: "2025-03-06" },
  { id: 8, description: "Gym membership",     amount: 45.00,  category: "Health",        date: "2025-03-07" },
  { id: 9, description: "Uber rides",         amount: 27.80,  category: "Transport",     date: "2025-03-08" },
  { id: 10, description: "Coffee & snacks",   amount: 18.60,  category: "Food",          date: "2025-03-09" },
];

const EMPTY_FORM: FormState = {
  description: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
};

// ── Donut chart (pure SVG) ─────────────────────────────────────────────────
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No data</div>;

  const cx = 80; const cy = 80; const R = 68; const r = 46;
  let angle = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const start = angle;
    const sweep = (d.value / total) * 2 * Math.PI;
    angle += sweep;
    const end = angle;
    const mid = start + sweep / 2;
    const push = hovered === i ? 6 : 0;
    const ox = Math.cos(mid) * push;
    const oy = Math.sin(mid) * push;
    const large = sweep > Math.PI ? 1 : 0;
    const x1 = cx + ox + R * Math.cos(start); const y1 = cy + oy + R * Math.sin(start);
    const x2 = cx + ox + R * Math.cos(end);   const y2 = cy + oy + R * Math.sin(end);
    const xi1 = cx + ox + r * Math.cos(end);  const yi1 = cy + oy + r * Math.sin(end);
    const xi2 = cx + ox + r * Math.cos(start);const yi2 = cy + oy + r * Math.sin(start);
    const path = `M${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${xi1} ${yi1} A${r} ${r} 0 ${large} 0 ${xi2} ${yi2}Z`;
    return { ...d, path, i };
  });

  const active = hovered !== null ? data[hovered] : null;

  return (
    <svg viewBox="0 0 160 160" className="w-full" style={{ height: 160 }}>
      {slices.map(s => (
        <path key={s.i} d={s.path} fill={s.color} stroke="white" strokeWidth="2"
          style={{ cursor: "pointer", transition: "d 0.15s" }}
          onMouseEnter={() => setHovered(s.i)} onMouseLeave={() => setHovered(null)} />
      ))}
      {active ? (
        <>
          <text x={cx} y={cy - 8}  textAnchor="middle" fontSize="8"  fill="#94a3b8">{active.label}</text>
          <text x={cx} y={cy + 8}  textAnchor="middle" fontSize="13" fill="#1e293b" fontWeight="800">
            ${active.value.toFixed(0)}
          </text>
          <text x={cx} y={cy + 20} textAnchor="middle" fontSize="8"  fill="#94a3b8">
            {((active.value / total) * 100).toFixed(1)}%
          </text>
        </>
      ) : (
        <>
          <text x={cx} y={cy - 6}  textAnchor="middle" fontSize="8"  fill="#94a3b8">Total</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="14" fill="#1e293b" fontWeight="800">
            ${total.toFixed(0)}
          </text>
        </>
      )}
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [form, setForm]         = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors]     = useState<FormErrors>({});
  const [filterCat, setFilterCat] = useState<string>("All");
  const [showForm, setShowForm] = useState<boolean>(false);
  let nextId = expenses.length + 11;

  // ── Derived ──
  const total = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  const categoryTotals = useMemo(() => {
    const map: Partial<Record<Category, number>> = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] ?? 0) + e.amount; });
    return CATEGORIES.map(cat => ({
      label: cat, value: map[cat] ?? 0, color: CAT_META[cat].bar,
    })).filter(d => d.value > 0);
  }, [expenses]);

  const filtered = useMemo(() =>
    filterCat === "All" ? expenses : expenses.filter(e => e.category === filterCat as Category),
    [expenses, filterCat]
  );

  // ── Form handlers ──
  const updateForm = (field: keyof FormState, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(err => ({ ...err, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.description.trim())        e.description = "Description is required.";
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0)
                                          e.amount      = "Enter a valid positive amount.";
    if (!form.date)                       e.date        = "Date is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addExpense = () => {
    if (!validate()) return;
    setExpenses(prev => [{
      id: nextId++,
      description: form.description.trim(),
      amount: parseFloat(parseFloat(form.amount).toFixed(2)),
      category: form.category,
      date: form.date,
    }, ...prev]);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const removeExpense = (id: number) => setExpenses(prev => prev.filter(e => e.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Expense Tracker</h1>
            <p className="text-sm text-slate-500 mt-0.5">March 2025</p>
          </div>
          <button onClick={() => setShowForm(f => !f)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white
              rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition">
            {showForm ? "✕ Cancel" : "+ Add Expense"}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">New Expense</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-500 block mb-1">Description</label>
                <input type="text" value={form.description} placeholder="e.g. Coffee with team"
                  onChange={e => updateForm("description", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition
                    focus:ring-2 focus:ring-indigo-300
                    ${errors.description ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"}`} />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>
              {/* Amount */}
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Amount ($)</label>
                <input type="number" value={form.amount} placeholder="0.00" min="0" step="0.01"
                  onChange={e => updateForm("amount", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition
                    focus:ring-2 focus:ring-indigo-300
                    ${errors.amount ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"}`} />
                {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
              </div>
              {/* Date */}
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Date</label>
                <input type="date" value={form.date}
                  onChange={e => updateForm("date", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition
                    focus:ring-2 focus:ring-indigo-300
                    ${errors.date ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"}`} />
                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
              </div>
              {/* Category */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-slate-500 block mb-2">Category</label>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => updateForm("category", cat)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                        border transition
                        ${form.category === cat
                          ? `${CAT_META[cat].bg} ${CAT_META[cat].color} border-transparent`
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                      {CAT_META[cat].icon} {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <button onClick={addExpense}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold
                  hover:bg-indigo-700 active:scale-95 transition">
                Save Expense
              </button>
            </div>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm sm:col-span-2">
            <p className="text-xs text-slate-500 font-medium">Total Spent</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">${total.toFixed(2)}</p>
          </div>
          {categoryTotals.slice(0, 2).map(cat => (
            <div key={cat.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">{CAT_META[cat.label as Category].icon} {cat.label}</p>
              <p className="text-xl font-bold text-slate-800 mt-1">${cat.value.toFixed(2)}</p>
              <p className="text-xs text-slate-400">{((cat.value / total) * 100).toFixed(1)}%</p>
            </div>
          ))}
        </div>

        {/* Chart + breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Donut */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Spending Breakdown</h2>
            <DonutChart data={categoryTotals} />
          </div>

          {/* Bar breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">By Category</h2>
            <div className="space-y-3">
              {categoryTotals.sort((a, b) => b.value - a.value).map(cat => (
                <div key={cat.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">
                      {CAT_META[cat.label as Category].icon} {cat.label}
                    </span>
                    <span className="font-semibold text-slate-800">${cat.value.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(cat.value / total) * 100}%`, background: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expense list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Filter tabs */}
          <div className="flex gap-1 p-4 border-b border-slate-100 overflow-x-auto">
            {["All", ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition
                  ${filterCat === cat
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:bg-slate-100"}`}>
                {cat === "All" ? "All" : `${CAT_META[cat as Category].icon} ${cat}`}
              </button>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No expenses in this category.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map(exp => {
                const meta = CAT_META[exp.category];
                return (
                  <div key={exp.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition group">
                    <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center text-lg flex-shrink-0`}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{exp.description}</p>
                      <p className="text-xs text-slate-400">
                        {exp.category} · {new Date(exp.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">${exp.amount.toFixed(2)}</span>
                    <button onClick={() => removeExpense(exp.id)}
                      className="w-7 h-7 rounded-lg bg-red-50 text-red-400 text-xs font-bold
                        opacity-0 group-hover:opacity-100 hover:bg-red-100 transition flex items-center justify-center">
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}