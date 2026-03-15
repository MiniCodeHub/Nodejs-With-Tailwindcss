import { useState, useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  status: "Active" | "On Leave" | "Remote";
  salary: number;
  joined: string;
}

type SortDir = "asc" | "desc";
type SortKey = keyof Employee;

// ── Data ───────────────────────────────────────────────────────────────────
const DATA: Employee[] = [
  { id: 1,  name: "Alice Walker",    role: "Frontend Dev",    department: "Engineering", status: "Active",   salary: 95000,  joined: "2021-03-12" },
  { id: 2,  name: "Bob Kim",         role: "Backend Dev",     department: "Engineering", status: "Remote",   salary: 102000, joined: "2020-07-01" },
  { id: 3,  name: "Carol Mendes",    role: "UI/UX Designer",  department: "Design",      status: "Active",   salary: 88000,  joined: "2022-01-15" },
  { id: 4,  name: "Dave Lin",        role: "DevOps Engineer", department: "Engineering", status: "On Leave", salary: 110000, joined: "2019-11-20" },
  { id: 5,  name: "Eve Rahman",      role: "Product Manager", department: "Product",     status: "Active",   salary: 120000, joined: "2020-05-08" },
  { id: 6,  name: "Frank Chen",      role: "Data Analyst",    department: "Analytics",   status: "Remote",   salary: 85000,  joined: "2022-09-01" },
  { id: 7,  name: "Grace Obi",       role: "QA Engineer",     department: "Engineering", status: "Active",   salary: 80000,  joined: "2023-02-14" },
  { id: 8,  name: "Hiro Tanaka",     role: "Backend Dev",     department: "Engineering", status: "Active",   salary: 98000,  joined: "2021-06-30" },
  { id: 9,  name: "Isla Novak",      role: "Marketing Lead",  department: "Marketing",   status: "On Leave", salary: 91000,  joined: "2020-12-01" },
  { id: 10, name: "James Adu",       role: "Frontend Dev",    department: "Engineering", status: "Remote",   salary: 93000,  joined: "2022-04-18" },
  { id: 11, name: "Kara Singh",      role: "Scrum Master",    department: "Product",     status: "Active",   salary: 105000, joined: "2019-08-25" },
  { id: 12, name: "Leo Ferreira",    role: "Data Engineer",   department: "Analytics",   status: "Active",   salary: 108000, joined: "2021-10-10" },
];

const STATUS_STYLES: Record<Employee["status"], string> = {
  "Active":   "bg-emerald-100 text-emerald-700",
  "On Leave": "bg-amber-100   text-amber-700",
  "Remote":   "bg-indigo-100  text-indigo-700",
};

const DEPARTMENTS = ["All", ...Array.from(new Set(DATA.map(d => d.department)))];

const PAGE_SIZES = [5, 10, 20];

// ── Sub-components ─────────────────────────────────────────────────────────
function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className={`ml-1 text-xs transition ${active ? "opacity-100" : "opacity-30"}`}>
      {active ? (dir === "asc" ? "▲" : "▼") : "▲"}
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function App() {
  const [search, setSearch]       = useState<string>("");
  const [dept, setDept]           = useState<string>("All");
  const [sortKey, setSortKey]     = useState<SortKey>("name");
  const [sortDir, setSortDir]     = useState<SortDir>("asc");
  const [page, setPage]           = useState<number>(1);
  const [pageSize, setPageSize]   = useState<number>(5);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let rows = DATA.filter(row => {
      const matchSearch = Object.values(row).some(v =>
        String(v).toLowerCase().includes(search.toLowerCase())
      );
      const matchDept = dept === "All" || row.department === dept;
      return matchSearch && matchDept;
    });

    rows = [...rows].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number")
        return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

    return rows;
  }, [search, dept, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: { key: SortKey; label: string }[] = [
    { key: "name",       label: "Name"       },
    { key: "role",       label: "Role"       },
    { key: "department", label: "Department" },
    { key: "status",     label: "Status"     },
    { key: "salary",     label: "Salary"     },
    { key: "joined",     label: "Joined"     },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} records found</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="search"
              placeholder="Search name, role, department..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200
                rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
            <span className="absolute left-3 top-3 text-gray-400 text-xs">🔍</span>
          </div>

          <select
            value={dept}
            onChange={e => { setDept(e.target.value); setPage(1); }}
            className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
              outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
          >
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            value={pageSize}
            onChange={e => { setPageSize(+e.target.value); setPage(1); }}
            className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
              outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
          >
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s} per page</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {columns.map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500
                        uppercase tracking-wider cursor-pointer hover:text-indigo-600
                        select-none whitespace-nowrap transition"
                    >
                      {col.label}
                      <SortIcon active={sortKey === col.key} dir={sortDir} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      <div className="text-3xl mb-2">🔍</div>
                      No results found.
                    </td>
                  </tr>
                ) : paginated.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-50 hover:bg-indigo-50 transition
                      ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                  >
                    {/* Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600
                          flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {row.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-medium text-gray-800">{row.name}</span>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-5 py-3.5 text-gray-600">{row.role}</td>
                    {/* Department */}
                    <td className="px-5 py-3.5 text-gray-600">{row.department}</td>
                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                        ${STATUS_STYLES[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    {/* Salary */}
                    <td className="px-5 py-3.5 font-semibold text-gray-800">
                      ${row.salary.toLocaleString()}
                    </td>
                    {/* Joined */}
                    <td className="px-5 py-3.5 text-gray-500">
                      {new Date(row.joined).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)} disabled={page === 1}
                className="px-2 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-40
                  hover:bg-indigo-50 hover:border-indigo-300 transition"
              >«</button>
              <button
                onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="px-2 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-40
                  hover:bg-indigo-50 hover:border-indigo-300 transition"
              >‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) => p === "..." ? (
                  <span key={`e${i}`} className="px-2 text-xs text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition font-medium
                      ${page === p
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-gray-200 hover:bg-indigo-50 hover:border-indigo-300"}`}
                  >{p}</button>
                ))}
              <button
                onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                className="px-2 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-40
                  hover:bg-indigo-50 hover:border-indigo-300 transition"
              >›</button>
              <button
                onClick={() => setPage(totalPages)} disabled={page === totalPages}
                className="px-2 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-40
                  hover:bg-indigo-50 hover:border-indigo-300 transition"
              >»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}