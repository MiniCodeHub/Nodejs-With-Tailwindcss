import { useState, useEffect, useCallback, useRef } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Photo {
  id: number;
  emoji: string;
  title: string;
  category: string;
  width: number;
  height: number;
  bg: string;
}

// ── Data (emoji stand-ins for real images) ─────────────────────────────────
const PHOTOS: Photo[] = [
  { id: 1,  emoji: "🏔️", title: "Mountain Peak",      category: "Nature",       width: 400, height: 300, bg: "from-slate-700 to-slate-900"   },
  { id: 2,  emoji: "🌊", title: "Ocean Waves",         category: "Nature",       width: 400, height: 300, bg: "from-blue-700 to-blue-900"     },
  { id: 3,  emoji: "🌆", title: "City at Dusk",        category: "Urban",        width: 400, height: 300, bg: "from-orange-700 to-rose-900"   },
  { id: 4,  emoji: "🌸", title: "Cherry Blossom",      category: "Nature",       width: 400, height: 300, bg: "from-pink-500 to-pink-900"     },
  { id: 5,  emoji: "🏛️", title: "Ancient Temple",      category: "Architecture", width: 400, height: 300, bg: "from-stone-600 to-stone-900"   },
  { id: 6,  emoji: "🦋", title: "Blue Morpho",         category: "Wildlife",     width: 400, height: 300, bg: "from-sky-600 to-indigo-900"    },
  { id: 7,  emoji: "🌌", title: "Milky Way",            category: "Space",        width: 400, height: 300, bg: "from-indigo-900 to-black"      },
  { id: 8,  emoji: "🦁", title: "Lion Portrait",        category: "Wildlife",     width: 400, height: 300, bg: "from-amber-700 to-amber-900"   },
  { id: 9,  emoji: "🗼", title: "Night Tower",          category: "Urban",        width: 400, height: 300, bg: "from-violet-700 to-violet-900" },
  { id: 10, emoji: "🌺", title: "Tropical Flower",     category: "Nature",       width: 400, height: 300, bg: "from-red-600 to-rose-900"      },
  { id: 11, emoji: "🏙️", title: "Skyline View",        category: "Urban",        width: 400, height: 300, bg: "from-cyan-700 to-slate-900"    },
  { id: 12, emoji: "🐋", title: "Blue Whale",           category: "Wildlife",     width: 400, height: 300, bg: "from-teal-700 to-teal-900"     },
];

const CATEGORIES = ["All", ...Array.from(new Set(PHOTOS.map(p => p.category)))];

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

// ── Lightbox ───────────────────────────────────────────────────────────────
interface LightboxProps {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}

function Lightbox({ photos, index, onClose, onNav }: LightboxProps) {
  const [zoom, setZoom]     = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);

  const photo = photos[index];

  // Reset zoom/offset on photo change
  useEffect(() => { setZoom(1); setOffset({ x: 0, y: 0 }); }, [index]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowRight")  onNav(Math.min(index + 1, photos.length - 1));
      if (e.key === "ArrowLeft")   onNav(Math.max(index - 1, 0));
      if (e.key === "+")           setZoom(z => Math.min(z + 0.5, MAX_ZOOM));
      if (e.key === "-")           setZoom(z => Math.max(z - 0.5, MIN_ZOOM));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, photos.length, onClose, onNav]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z - e.deltaY * 0.005)));
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !dragStart.current) return;
    setOffset({
      x: dragStart.current.ox + e.clientX - dragStart.current.mx,
      y: dragStart.current.oy + e.clientY - dragStart.current.my,
    });
  };

  const onMouseUp = () => { setDragging(false); dragStart.current = null; };

  const zoomPct = Math.round(zoom * 100);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
        <div>
          <p className="font-semibold text-white text-sm">{photo.title}</p>
          <p className="text-xs text-gray-400">{photo.category} · {index + 1} / {photos.length}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button onClick={() => setZoom(z => Math.max(MIN_ZOOM, z - 0.5))}
            className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition text-sm font-bold">
            −
          </button>
          <span className="text-xs text-gray-300 w-12 text-center">{zoomPct}%</span>
          <button onClick={() => setZoom(z => Math.min(MAX_ZOOM, z + 0.5))}
            className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition text-sm font-bold">
            +
          </button>
          <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
            className="px-3 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition text-xs">
            Reset
          </button>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-red-500/80 transition text-sm ml-2">
            ✕
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div
        className="flex-1 overflow-hidden flex items-center justify-center relative"
        onWheel={handleWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
      >
        <div
          className={`bg-gradient-to-br ${photo.bg} rounded-2xl flex items-center justify-center select-none`}
          style={{
            width: 520, height: 380,
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
            transition: dragging ? "none" : "transform 0.2s ease",
          }}
        >
          <span className="text-[120px]" style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}>
            {photo.emoji}
          </span>
        </div>

        {/* Prev / Next */}
        <button
          onClick={() => onNav(Math.max(index - 1, 0))}
          disabled={index === 0}
          className="absolute left-4 w-10 h-10 rounded-full bg-white/10 text-white
            hover:bg-white/25 transition disabled:opacity-20 text-lg"
        >‹</button>
        <button
          onClick={() => onNav(Math.min(index + 1, photos.length - 1))}
          disabled={index === photos.length - 1}
          className="absolute right-4 w-10 h-10 rounded-full bg-white/10 text-white
            hover:bg-white/25 transition disabled:opacity-20 text-lg"
        >›</button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 px-6 py-4 overflow-x-auto flex-shrink-0">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => onNav(i)}
            className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${p.bg}
              flex items-center justify-center text-2xl transition border-2
              ${i === index ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-80"}`}
          >
            {p.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxIndex,  setLightboxIndex]  = useState<number | null>(null);

  const filtered: Photo[] = activeCategory === "All"
    ? PHOTOS
    : PHOTOS.filter(p => p.category === activeCategory);

  const openLightbox  = (i: number) => setLightboxIndex(i);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const navLightbox   = useCallback((i: number) => setLightboxIndex(i), []);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  return (
    <div className="min-h-screen bg-gray-950 font-sans text-white">

      {/* Header */}
      <header className="px-8 pt-10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Photo Gallery</h1>
        <p className="text-sm text-gray-400">Click any photo to open the lightbox. Scroll or use +/- to zoom.</p>
      </header>

      {/* Category filters */}
      <div className="flex gap-2 px-8 pb-6 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
              ${activeCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-8 pb-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(i)}
            className={`bg-gradient-to-br ${photo.bg} rounded-2xl aspect-square
              flex flex-col items-center justify-center gap-2 group
              hover:scale-[1.03] hover:shadow-2xl transition-all duration-200`}
          >
            <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
              {photo.emoji}
            </span>
            <span className="text-xs font-medium text-white/70 group-hover:text-white transition">
              {photo.title}
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNav={navLightbox}
        />
      )}
    </div>
  );
}