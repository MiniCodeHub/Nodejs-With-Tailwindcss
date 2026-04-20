import { useState, useCallback, useRef } from "react";

// -- Types ------------------------------------------------------------------
interface ColorSwatch { hex: string; name: string; }
interface Palette { name: string; colors: ColorSwatch[]; }

// -- Color math helpers -----------------------------------------------------
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max) {
      case r: h = ((g-b)/d + (g<b?6:0))/6; break;
      case g: h = ((b-r)/d + 2)/6; break;
      case b: h = ((r-g)/d + 4)/6; break;
    }
  }
  return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h/30) % 12;
  const a = s * Math.min(l, 1-l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n), 1)));
  const toHex = (x: number) => Math.round(x*255).toString(16).padStart(2,'0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function isDark(hex: string): boolean {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return (r*299 + g*587 + b*114)/1000 < 128;
}

function randomHex(): string {
  return '#' + Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0');
}

// -- Palette generators -----------------------------------------------------
function generatePalette(baseHex: string, mode: string): ColorSwatch[] {
  const [h, s, l] = hexToHsl(baseHex);

  const make = (hex: string, name: string): ColorSwatch => ({ hex, name });

  switch (mode) {
    case "shades": {
      const steps = [95,85,75,60,45,30,20,12,6];
      return steps.map((lv,i) => make(hslToHex(h,s,lv), `${(i+1)*100}`));
    }
    case "analogous": {
      return [
        make(hslToHex((h-30+360)%360, s, l), "-30"),
        make(hslToHex((h-15+360)%360, s, l), "-15"),
        make(baseHex, "Base"),
        make(hslToHex((h+15)%360, s, l), "+15"),
        make(hslToHex((h+30)%360, s, l), "+30"),
      ];
    }
    case "complementary": {
      const comp = (h+180)%360;
      return [
        make(hslToHex(h, s, Math.min(l+20,95)), "Light"),
        make(baseHex, "Base"),
        make(hslToHex(h, s, Math.max(l-20,5)), "Dark"),
        make(hslToHex(comp, s, Math.min(l+20,95)), "Comp Light"),
        make(hslToHex(comp, s, l), "Complement"),
        make(hslToHex(comp, s, Math.max(l-20,5)), "Comp Dark"),
      ];
    }
    case "triadic": {
      const t1=(h+120)%360, t2=(h+240)%360;
      return [
        make(baseHex, "Primary"),
        make(hslToHex(t1, s, l), "Triadic 1"),
        make(hslToHex(t2, s, l), "Triadic 2"),
        make(hslToHex(h, s, Math.min(l+25,95)), "Light"),
        make(hslToHex(h, s, Math.max(l-25,5)), "Dark"),
      ];
    }
    case "split": {
      const s1=(h+150)%360, s2=(h+210)%360;
      return [
        make(baseHex, "Base"),
        make(hslToHex(s1, s, l), "Split 1"),
        make(hslToHex(s2, s, l), "Split 2"),
      ];
    }
    case "tetradic": {
      return [h, h+90, h+180, h+270].map((hv,i) =>
        make(hslToHex(hv%360, s, l), ["Base","90","180","270"][i])
      );
    }
    default: return [make(baseHex, "Base")];
  }
}

// -- Preset palettes --------------------------------------------------------
const PRESETS: Palette[] = [
  { name:"Ocean",    colors:[{hex:"#03045e",name:"Deep"},{hex:"#0077b6",name:"Mid"},{hex:"#00b4d8",name:"Bright"},{hex:"#90e0ef",name:"Light"},{hex:"#caf0f8",name:"Pale"}] },
  { name:"Sunset",   colors:[{hex:"#6a0572",name:"Plum"},{hex:"#c9184a",name:"Rose"},{hex:"#ff4d6d",name:"Coral"},{hex:"#ff9a00",name:"Amber"},{hex:"#ffcb00",name:"Gold"}] },
  { name:"Forest",   colors:[{hex:"#1b4332",name:"Deep"},{hex:"#2d6a4f",name:"Dark"},{hex:"#52b788",name:"Mid"},{hex:"#95d5b2",name:"Light"},{hex:"#d8f3dc",name:"Pale"}] },
  { name:"Neon",     colors:[{hex:"#7400b8",name:"Purple"},{hex:"#6930c3",name:"Violet"},{hex:"#4cc9f0",name:"Cyan"},{hex:"#f72585",name:"Pink"},{hex:"#4361ee",name:"Blue"}] },
  { name:"Minimal",  colors:[{hex:"#212121",name:"Black"},{hex:"#424242",name:"Dark"},{hex:"#9e9e9e",name:"Gray"},{hex:"#e0e0e0",name:"Light"},{hex:"#fafafa",name:"White"}] },
];

const MODES = ["shades","analogous","complementary","triadic","split","tetradic"] as const;
type Mode = typeof MODES[number];

// -- Copy feedback ----------------------------------------------------------
function useCopied() {
  const [copiedId, setCopied] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = useCallback((hex: string, id: string) => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopied(id);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setCopied(null), 1500);
  }, []);
  return { copiedId, copy };
}

// -- Swatch Card ------------------------------------------------------------
function SwatchCard({ swatch, swatchId, copied, onCopy, size = "md" }:
  { swatch: ColorSwatch; swatchId: string; copied: string|null; onCopy:(hex:string,id:string)=>void; size?:"sm"|"md"|"lg" }) {
  const dark = isDark(swatch.hex);
  const textColor = dark ? "text-white" : "text-slate-800";
  const isCopied = copied === swatchId;

  const heights: Record<string,string> = { sm:"h-20", md:"h-28", lg:"h-36" };

  return (
    <button
      onClick={() => onCopy(swatch.hex, swatchId)}
      className={`${heights[size]} w-full rounded-xl flex flex-col items-center justify-center gap-1
        transition-all duration-150 active:scale-95 relative overflow-hidden group`}
      style={{ background: swatch.hex }}
      title={`Copy ${swatch.hex}`}
    >
      {/* Hover overlay */}
      <div className={`absolute inset-0 transition-opacity duration-150 opacity-0 group-hover:opacity-100
        ${dark ? "bg-white/10" : "bg-black/8"}`} />

      {isCopied ? (
        <span className={`text-lg z-10`}></span>
      ) : (
        <>
          <span className={`text-xs font-mono font-bold z-10 ${textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
            {swatch.hex.toUpperCase()}
          </span>
          <span className={`text-xs font-medium z-10 ${textColor} opacity-70`}>{swatch.name}</span>
        </>
      )}
    </button>
  );
}

// -- Main Component ---------------------------------------------------------
export default function App() {
  const [baseColor, setBaseColor]   = useState("#6c5ce7");
  const [mode, setMode]             = useState<Mode>("shades");
  const [customPalettes, setCustom] = useState<Palette[]>([]);
  const [savedName, setSavedName]   = useState("");
  const { copiedId, copy }          = useCopied();

  const generated = generatePalette(baseColor, mode);
  const [h,s,l]   = hexToHsl(baseColor);

  const savePalette = () => {
    const name = savedName.trim() || `Palette ${customPalettes.length + 1}`;
    setCustom(prev => [{ name, colors: generated }, ...prev]);
    setSavedName("");
  };

  const copyAll = () => {
    const text = generated.map(c => c.hex).join(", ");
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white p-5">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between pt-4 pb-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Color Palette Generator</h1>
            <p className="text-sm text-slate-500 mt-1">Pick a color, choose a harmony mode, copy any hex.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Color picker */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Base Color</label>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-700 flex-shrink-0"
                  style={{ background: baseColor }}>
                  <input type="color" value={baseColor}
                    onChange={e => setBaseColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
                <div>
                  <input type="text" value={baseColor}
                    onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setBaseColor(e.target.value); }}
                    className="w-28 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg
                      font-mono text-sm text-slate-200 outline-none focus:border-indigo-500 transition" />
                  <p className="text-xs text-slate-600 mt-0.5">H:{h} S:{s}% L:{l}%</p>
                </div>
                <button onClick={() => setBaseColor(randomHex())}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs
                    font-semibold text-slate-400 hover:text-white hover:border-slate-600 transition">
                  Random
                </button>
              </div>
            </div>

            {/* Mode */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-400 mb-2">Harmony Mode</label>
              <div className="flex flex-wrap gap-1.5">
                {MODES.map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize
                      ${mode===m ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generated palette */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200 capitalize">{mode} palette</h2>
            <div className="flex gap-2">
              <button onClick={copyAll}
                className="px-3 py-1.5 bg-slate-800 text-slate-400 hover:text-white border border-slate-700
                  rounded-xl text-xs font-semibold transition">
                Copy All Hex
              </button>
              <div className="flex items-center gap-1.5">
                <input type="text" value={savedName} placeholder="Name..."
                  onChange={e => setSavedName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && savePalette()}
                  className="w-24 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs
                    text-slate-300 placeholder-slate-600 outline-none focus:border-indigo-500 transition" />
                <button onClick={savePalette}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold
                    hover:bg-indigo-700 transition">
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Swatches - large strip */}
          <div className="flex gap-2 mb-4">
            {generated.map((sw, i) => (
              <div key={i} className="flex-1">
                <SwatchCard swatch={sw} swatchId={`gen-${i}`} copied={copiedId} onCopy={copy} size="lg" />
                <p className="text-center font-mono text-xs text-slate-500 mt-1.5 truncate">{sw.hex.toUpperCase()}</p>
              </div>
            ))}
          </div>

          {/* Hex codes row */}
          <div className="flex gap-2 flex-wrap">
            {generated.map((sw,i) => (
              <button key={i} onClick={() => copy(sw.hex, `hex-${i}`)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono
                  transition ${copiedId===`hex-${i}` ? "border-emerald-500 text-emerald-400" : "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"}`}>
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{background:sw.hex}}/>
                {sw.hex.toUpperCase()}
                {copiedId===`hex-${i}` && <span className="text-emerald-400"></span>}
              </button>
            ))}
          </div>
        </div>

        {/* Preset palettes */}
        <div>
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Preset Palettes</h2>
          <div className="space-y-3">
            {PRESETS.map(palette => (
              <div key={palette.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-400">{palette.name}</p>
                  <button onClick={() => setBaseColor(palette.colors[2]?.hex || palette.colors[0].hex)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition font-medium">
                    Use as base
                  </button>
                </div>
                <div className="flex gap-2">
                  {palette.colors.map((sw, i) => (
                    <div key={i} className="flex-1">
                      <SwatchCard swatch={sw} swatchId={`pre-${palette.name}-${i}`}
                        copied={copiedId} onCopy={copy} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved palettes */}
        {customPalettes.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-400 mb-3">Saved Palettes</h2>
            <div className="space-y-3">
              {customPalettes.map((palette, pi) => (
                <div key={pi} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-400">{palette.name}</p>
                    <button onClick={() => setCustom(p => p.filter((_,i)=>i!==pi))}
                      className="text-xs text-red-400 hover:text-red-300 transition">Remove</button>
                  </div>
                  <div className="flex gap-2">
                    {palette.colors.map((sw, i) => (
                      <div key={i} className="flex-1">
                        <SwatchCard swatch={sw} swatchId={`saved-${pi}-${i}`}
                          copied={copiedId} onCopy={copy} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}