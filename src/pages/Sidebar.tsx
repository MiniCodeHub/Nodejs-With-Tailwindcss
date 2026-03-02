import { useState } from "react";

const navItems = [
  { icon: "🏠", label: "Dashboard", badge: null },
  { icon: "📊", label: "Analytics", badge: "New" },
  { icon: "🛍️", label: "Products", badge: "12" },
  { icon: "👥", label: "Customers", badge: null },
  { icon: "📦", label: "Orders", badge: "3" },
  { icon: "💬", label: "Messages", badge: "5" },
  { icon: "⚙️", label: "Settings", badge: null },
];

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-30 h-full flex flex-col
          bg-gray-900 text-white transition-all duration-300 ease-in-out
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm font-bold">
                N
              </div>
              <span className="font-semibold text-lg tracking-tight">Nexus</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm font-bold mx-auto">
              N
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden md:flex items-center justify-center w-7 h-7 rounded-md bg-gray-700 hover:bg-gray-600 transition ${collapsed ? "mx-auto mt-0" : ""}`}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <span className="text-xs">{collapsed ? "→" : "←"}</span>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ icon, label, badge }) => (
            <button
              key={label}
              onClick={() => { setActive(label); setMobileOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
                transition-all duration-150 relative group
                ${active === label
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"}
              `}
            >
              <span className="text-lg flex-shrink-0">{icon}</span>

              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{label}</span>
                  {badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold
                        ${badge === "New" ? "bg-emerald-500 text-white" : "bg-gray-700 text-gray-200"}
                      `}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-700 text-white text-xs rounded-md
                  opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {label}
                  {badge && <span className="ml-1 text-indigo-300">({badge})</span>}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User profile */}
        <div className={`border-t border-gray-700 p-4 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center font-bold text-sm">
            JD
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Jane Doe</p>
              <p className="text-xs text-gray-400 truncate">jane@nexus.io</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-5 h-0.5 bg-gray-600"></div>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">{active}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 w-48"
              />
              <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">🔍</span>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <span>🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Revenue", value: "$48,320", change: "+12%", color: "indigo" },
              { label: "New Orders", value: "284", change: "+8%", color: "emerald" },
              { label: "Active Users", value: "1,093", change: "+5%", color: "violet" },
            ].map(({ label, value, change, color }) => (
              <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className={`text-xs font-medium text-${color}-500 mt-1`}>{change} this month</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                "New order #4821 placed by Alice W.",
                "Product 'Wireless Headphones' went out of stock.",
                "5 new customer signups today.",
                "Monthly report generated successfully.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}