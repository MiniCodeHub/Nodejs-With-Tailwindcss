import { useState } from "react";

// -- Types ------------------------------------------------------------------
interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string | number;
  children?: NavItem[];
}

interface PageMeta {
  title: string;
  description: string;
  icon: string;
}

// -- Nav config -------------------------------------------------------------
const NAV: NavItem[] = [
  { id:"dashboard", label:"Dashboard", icon:"" },
  {
    id:"analytics", label:"Analytics", icon:"", children:[
      { id:"overview",   label:"Overview",   icon:"" },
      { id:"traffic",    label:"Traffic",    icon:"" },
      { id:"conversions",label:"Conversions",icon:"", badge:"New" },
    ],
  },
  {
    id:"content", label:"Content", icon:"", children:[
      { id:"posts",    label:"Posts",    icon:"", badge:12 },
      { id:"media",    label:"Media",    icon:"" },
      { id:"comments", label:"Comments", icon:"", badge:3 },
    ],
  },
  { id:"users",     label:"Users",     icon:"", badge:247 },
  { id:"products",  label:"Products",  icon:"" },
  { id:"orders",    label:"Orders",    icon:"", badge:"5" },
  {
    id:"settings", label:"Settings", icon:"", children:[
      { id:"general",     label:"General",      icon:"" },
      { id:"security",    label:"Security",     icon:"" },
      { id:"integrations",label:"Integrations", icon:"" },
      { id:"billing",     label:"Billing",      icon:"" },
    ],
  },
];

const PAGES: Record<string, PageMeta> = {
  dashboard:    { title:"Dashboard",    icon:"", description:"Overview of your platform's key metrics and recent activity." },
  overview:     { title:"Analytics Overview",  icon:"", description:"High-level summary across all your traffic sources." },
  traffic:      { title:"Traffic",      icon:"", description:"Deep-dive into where your visitors are coming from." },
  conversions:  { title:"Conversions",  icon:"", description:"Track your funnel and conversion events in real time." },
  posts:        { title:"Posts",        icon:"", description:"Manage, schedule, and publish your content." },
  media:        { title:"Media Library",icon:"", description:"All your uploaded images, videos and files." },
  comments:     { title:"Comments",     icon:"", description:"Moderate and respond to user comments." },
  users:        { title:"Users",        icon:"", description:"Browse and manage your registered user base." },
  products:     { title:"Products",     icon:"", description:"Your full product catalogue and inventory." },
  orders:       { title:"Orders",       icon:"", description:"Recent orders, fulfilment status and history." },
  general:      { title:"General Settings",    icon:"", description:"Configure your site name, timezone and locale." },
  security:     { title:"Security",     icon:"", description:"Two-factor auth, session management and audit logs." },
  integrations: { title:"Integrations", icon:"", description:"Connect third-party tools and manage API keys." },
  billing:      { title:"Billing",      icon:"", description:"Subscription plan, invoices and payment methods." },
};

// -- Badge ------------------------------------------------------------------
function Badge({ value, collapsed }: { value: string | number; collapsed: boolean }) {
  if (collapsed) return null;
  const isNew = value === "New";
  return (
    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ml-auto flex-shrink-0
      ${isNew ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
      {value}
    </span>
  );
}

// -- Nav Item ---------------------------------------------------------------
interface NavItemProps {
  item: NavItem;
  activeId: string;
  collapsed: boolean;
  depth?: number;
  onSelect: (id: string) => void;
}

function NavItemEl({ item, activeId, collapsed, depth = 0, onSelect }: NavItemProps) {
  const isActive   = activeId === item.id || item.children?.some(c => c.id === activeId);
  const hasChildren = !!item.children?.length;
  const [open, setOpen] = useState<boolean>(
    () => !!item.children?.some(c => c.id === activeId)
  );

  const handleClick = () => {
    if (hasChildren) {
      if (!collapsed) setOpen(o => !o);
    } else {
      onSelect(item.id);
    }
  };

  const isLeafActive = activeId === item.id;

  return (
    <div>
      <button
        onClick={handleClick}
        title={collapsed ? item.label : undefined}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
          font-medium transition-all duration-150 relative group
          ${depth > 0 ? "ml-3 w-[calc(100%-12px)]" : ""}
          ${isLeafActive
            ? "bg-indigo-600 text-white"
            : isActive
            ? "bg-slate-800/60 text-slate-200"
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
      >
        <span className="text-base flex-shrink-0 leading-none">{item.icon}</span>

        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            {item.badge !== undefined && <Badge value={item.badge} collapsed={collapsed} />}
            {hasChildren && (
              <span className={`text-xs transition-transform duration-200 text-slate-500
                ${open ? "rotate-90" : ""}`}></span>
            )}
          </>
        )}

        {/* Tooltip when collapsed */}
        {collapsed && (
          <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-700 text-slate-100
            text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none
            whitespace-nowrap z-50 shadow-xl transition-opacity duration-150">
            {item.label}
            {item.badge !== undefined && (
              <span className="ml-2 text-indigo-400 font-bold">{item.badge}</span>
            )}
          </div>
        )}
      </button>

      {/* Children */}
      {hasChildren && !collapsed && open && (
        <div className="mt-1 space-y-0.5 overflow-hidden">
          {item.children!.map(child => (
            <NavItemEl key={child.id} item={child} activeId={activeId}
              collapsed={collapsed} depth={depth + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

// -- Mock stats cards -------------------------------------------------------
const STATS = [
  { label:"Total Revenue", value:"$48,320", change:"+12.4%", pos:true },
  { label:"Active Users",  value:"14,093",  change:"+8.1%",  pos:true },
  { label:"Orders",        value:"1,284",   change:"-2.3%",  pos:false },
  { label:"Uptime",        value:"99.99%",  change:"+0.01%", pos:true },
];

// -- Main Component ---------------------------------------------------------
export default function App() {
  const [activeId, setActiveId]   = useState<string>("dashboard");
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const page = PAGES[activeId] ?? PAGES["dashboard"];

  const handleSelect = (id: string) => {
    setActiveId(id);
    setMobileOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden">

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* -- Sidebar -- */}
      <aside className={`
        fixed md:relative z-30 h-full flex flex-col bg-slate-900 border-r border-slate-800
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? "w-16" : "w-60"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo */}
        <div className={`flex items-center border-b border-slate-800 flex-shrink-0
          ${collapsed ? "justify-center px-3 py-4" : "justify-between px-4 py-4"}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm text-white">N</div>
              <span className="font-semibold text-sm text-white">Nexus</span>
            </div>
          )}
          {collapsed && (
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm text-white">N</div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="hidden md:flex w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700
              items-center justify-center text-slate-400 hover:text-white transition text-xs"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "" : ""}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV.map(item => (
            <NavItemEl key={item.id} item={item} activeId={activeId}
              collapsed={collapsed} onSelect={handleSelect} />
          ))}
        </nav>

        {/* User */}
        <div className={`border-t border-slate-800 p-3 flex items-center gap-3 flex-shrink-0
          ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center
            text-xs font-bold text-white flex-shrink-0">JD</div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Jane Doe</p>
              <p className="text-xs text-slate-500 truncate">Admin</p>
            </div>
          )}
        </div>
      </aside>

      {/* -- Main -- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-5 py-3.5
          flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
              onClick={() => setMobileOpen(o => !o)}>
              <div className="w-5 h-0.5 bg-current mb-1 rounded"></div>
              <div className="w-5 h-0.5 bg-current mb-1 rounded"></div>
              <div className="w-5 h-0.5 bg-current rounded"></div>
            </button>
            <div>
              <h1 className="text-sm font-bold text-white">{page.icon} {page.title}</h1>
              <p className="text-xs text-slate-500 hidden sm:block">{page.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <input type="text" placeholder="Search..."
                className="pl-7 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg
                  text-xs text-slate-300 placeholder-slate-600 outline-none
                  focus:border-indigo-500 transition w-40" />
              <span className="absolute left-2 top-2 text-slate-600 text-xs"></span>
            </div>
            <button className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400
              hover:text-white transition flex items-center justify-center text-base relative">
              
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {activeId === "dashboard" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {STATS.map(s => (
                  <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                    <p className="text-xl font-bold text-white">{s.value}</p>
                    <p className={`text-xs font-semibold mt-1 ${s.pos ? "text-emerald-400" : "text-red-400"}`}>{s.change}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <p className="text-sm font-semibold text-slate-300 mb-3">Quick Navigation</p>
                <p className="text-xs text-slate-500 mb-4">Click any item in the sidebar to navigate. Notice how parent groups expand, active items highlight, and the header title updates instantly.</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(PAGES).map(id => (
                    <button key={id} onClick={() => handleSelect(id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition
                        ${activeId === id
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                      {PAGES[id].icon} {PAGES[id].title}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {activeId !== "dashboard" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-md mx-auto mt-8">
              <div className="text-5xl mb-4">{page.icon}</div>
              <h2 className="text-lg font-bold text-white mb-2">{page.title}</h2>
              <p className="text-sm text-slate-400 mb-6">{page.description}</p>
              <button onClick={() => handleSelect("dashboard")}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                Back to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}