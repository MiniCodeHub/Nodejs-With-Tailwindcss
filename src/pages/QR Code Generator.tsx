import { useState, useEffect, useRef, useCallback } from "react";

// ── Type declarations ──────────────────────────────────────────────
interface QRCodeOptions {
  text: string;
  width: number;
  height: number;
  colorDark: string;
  colorLight: string;
  correctLevel: number;
}

interface QRCodeConstructor {
  new (el: HTMLElement, opts: QRCodeOptions): unknown;
  CorrectLevel: { L: number; M: number; Q: number; H: number };
}

interface QRWindow extends Window {
  QRCode?: QRCodeConstructor;
}

declare const window: QRWindow;

// ── CDN loader ─────────────────────────────────────────────────────
function useQRLib(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.QRCode) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}

// ── Constants ──────────────────────────────────────────────────────
const PRESETS = [
  { label: "🌐 Website",  value: "https://example.com" },
  { label: "📧 Email",    value: "mailto:hello@example.com" },
  { label: "📞 Phone",    value: "tel:+11234567890" },
  { label: "💬 SMS",      value: "sms:+11234567890?body=Hey!" },
  { label: "📶 WiFi",     value: "WIFI:T:WPA;S:NetworkName;P:password;;" },
  { label: "📍 Location", value: "geo:37.7749,-122.4194" },
];

type Status = "idle" | "generating" | "ready" | "error";

const STATUS_MAP: Record<Status, { cls: string; label: string }> = {
  idle:       { cls: "s-idle",  label: "○ waiting" },
  generating: { cls: "s-gen",   label: "● generating…" },
  ready:      { cls: "s-ready", label: "● ready" },
  error:      { cls: "s-error", label: "● error" },
};

// ── Component ──────────────────────────────────────────────────────
export default function QRGenerator() {
  const [input, setInput]               = useState("https://claude.ai");
  const [size, setSize]                 = useState(240);
  const [status, setStatus]             = useState<Status>("idle");
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [downloaded, setDownloaded]     = useState(false);
  const [copied, setCopied]             = useState(false);

  const qrContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const libReady       = useQRLib();

  const buildQR = useCallback((text: string) => {
    if (!libReady || !qrContainerRef.current || !window.QRCode) return;
    if (!text.trim()) { setStatus("idle"); return; }

    setStatus("generating");
    qrContainerRef.current.innerHTML = "";

    try {
      new window.QRCode(qrContainerRef.current, {
        text,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H,
      });
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [libReady, size]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => buildQR(input), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, buildQR]);

  const handleDownload = () => {
    const canvas = qrContainerRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qrcode-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleCopy = () => {
    const canvas = qrContainerRef.current?.querySelector("canvas");
    if (!canvas) return;
    canvas.toBlob(async (blob: Blob | null) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      } catch {
        navigator.clipboard.writeText(canvas.toDataURL());
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const { cls, label } = STATUS_MAP[status];

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0c0c0f; --surface: #131317; --border: #1e1e26; --border-hi: #2e2e3e;
          --accent: #7c6aff; --accent2: #ff6a9b; --green: #50d28c;
          --text: #e2e2f0; --muted: #4a4a62; --dim: #1a1a24;
        }
        .wrap { width: 100%; max-width: 860px; display: flex; flex-direction: column; gap: 1.4rem; }
        .header { display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 1.2rem; border-bottom: 1px solid var(--border); }
        .logo { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: var(--text); letter-spacing: -0.05em; line-height: 1; }
        .logo em { font-style: normal; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .logo-sub { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--muted); letter-spacing: 0.14em; margin-top: 0.3rem; }
        .s-idle  { background: var(--dim); color: var(--muted); border: 1px solid var(--border-hi); }
        .s-gen   { background: rgba(124,106,255,.12); color: var(--accent); border: 1px solid rgba(124,106,255,.3); animation: blink 1s ease-in-out infinite; }
        .s-ready { background: rgba(80,210,140,.1); color: var(--green); border: 1px solid rgba(80,210,140,.3); }
        .s-error { background: rgba(255,80,80,.1); color: #ff6060; border: 1px solid rgba(255,80,80,.3); }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.5} }
        .pill { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; letter-spacing: .1em; padding: .25rem .75rem; border-radius: 100px; transition: all .3s; }
        .main { display: grid; grid-template-columns: 1fr 300px; gap: 1.2rem; }
        @media(max-width:640px){ .main { grid-template-columns: 1fr; } }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.6rem; display: flex; flex-direction: column; gap: 1.4rem; }
        .lbl { font-family: 'JetBrains Mono', monospace; font-size: .6rem; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); margin-bottom: .55rem; }
        .input-box { position: relative; }
        .qr-ta { width: 100%; background: var(--bg); border: 1px solid var(--border-hi); border-radius: 10px; color: var(--text); font-family: 'JetBrains Mono', monospace; font-size: .82rem; line-height: 1.6; padding: .9rem .9rem 2.2rem; resize: vertical; min-height: 110px; outline: none; transition: border-color .2s, box-shadow .2s; }
        .qr-ta:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,106,255,.15); }
        .qr-ta::placeholder { color: var(--muted); }
        .ta-foot { position: absolute; bottom: .6rem; right: .8rem; }
        .char { font-family: 'JetBrains Mono', monospace; font-size: .6rem; color: var(--muted); }
        .presets { display: grid; grid-template-columns: repeat(3,1fr); gap: .45rem; }
        .pre-btn { background: var(--bg); border: 1px solid var(--border-hi); border-radius: 8px; padding: .5rem .3rem; font-family: 'JetBrains Mono', monospace; font-size: .62rem; color: var(--muted); cursor: pointer; transition: all .18s; text-align: center; }
        .pre-btn:hover { border-color: var(--accent); color: var(--text); background: rgba(124,106,255,.06); }
        .pre-btn.active { border-color: var(--accent); color: var(--accent); background: rgba(124,106,255,.1); }
        .slider-hd { display: flex; justify-content: space-between; align-items: center; margin-bottom: .6rem; }
        .slider-val { font-family: 'JetBrains Mono', monospace; font-size: .72rem; color: var(--accent); }
        .sz-slider { -webkit-appearance:none; width:100%; height:4px; background:var(--dim); border-radius:2px; outline:none; cursor:pointer; }
        .sz-slider::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:var(--accent); cursor:pointer; box-shadow:0 0 10px rgba(124,106,255,.7); transition:transform .15s; }
        .sz-slider::-webkit-slider-thumb:hover { transform:scale(1.25); }
        .sz-marks { display:flex; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:.56rem; color:var(--muted); margin-top:.3rem; }
        .preview { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.6rem; display: flex; flex-direction: column; align-items: center; gap: 1.2rem; }
        .qr-frame { width: 100%; aspect-ratio: 1; background: #fff; border-radius: 12px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid var(--border-hi); }
        .c { position:absolute; width:22px; height:22px; border-style:solid; border-color:var(--accent); pointer-events:none; z-index:2; }
        .c-tl { top:8px; left:8px;     border-width:3px 0 0 3px; border-radius:3px 0 0 0; }
        .c-tr { top:8px; right:8px;    border-width:3px 3px 0 0; border-radius:0 3px 0 0; }
        .c-bl { bottom:8px; left:8px;  border-width:0 0 3px 3px; border-radius:0 0 0 3px; }
        .c-br { bottom:8px; right:8px; border-width:0 3px 3px 0; border-radius:0 0 3px 0; }
        .qr-inner { display:flex; align-items:center; justify-content:center; width:85%; height:85%; }
        .qr-inner canvas, .qr-inner img { max-width:100%; max-height:100%; image-rendering:crisp-edges; }
        .empty-state { display:flex; flex-direction:column; align-items:center; gap:.6rem; opacity:.2; }
        .empty-label { font-family:'JetBrains Mono',monospace; font-size:.62rem; color:var(--muted); letter-spacing:.12em; text-transform:uppercase; }
        .spinner { width:34px; height:34px; border:3px solid rgba(124,106,255,.2); border-top-color:var(--accent); border-radius:50%; animation:spin .8s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .actions { display:flex; flex-direction:column; gap:.55rem; width:100%; }
        .btn { width:100%; padding:.78rem; border-radius:10px; font-family:'Syne',sans-serif; font-size:.82rem; font-weight:700; letter-spacing:.04em; cursor:pointer; border:none; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:.45rem; }
        .btn-dl { background:var(--accent); color:#fff; box-shadow:0 4px 20px rgba(124,106,255,.35); }
        .btn-dl:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 28px rgba(124,106,255,.5); filter:brightness(1.1); }
        .btn-dl:disabled { opacity:.3; cursor:not-allowed; transform:none; box-shadow:none; }
        .btn-cp { background:transparent; color:var(--muted); border:1px solid var(--border-hi); }
        .btn-cp:hover:not(:disabled) { border-color:var(--accent); color:var(--text); }
        .btn-cp:disabled { opacity:.3; cursor:not-allowed; }
        .meta { width:100%; display:flex; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:.58rem; color:var(--muted); border-top:1px solid var(--border); padding-top:.8rem; }
        .footer { font-family:'JetBrains Mono',monospace; font-size:.6rem; color:var(--muted); text-align:center; letter-spacing:.1em; }
      `}</style>

      <div className="wrap">
        <div className="header">
          <div>
            <div className="logo">qr<em>gen</em></div>
            <div className="logo-sub">instant · live · downloadable</div>
          </div>
          <div className={`pill ${cls}`}>{label}</div>
        </div>

        <div className="main">
          <div className="panel">
            <div>
              <div className="lbl">Content</div>
              <div className="input-box">
                <textarea
                  className="qr-ta"
                  value={input}
                  onChange={e => { setInput(e.target.value); setActivePreset(null); }}
                  placeholder="Paste a URL, type any text, or pick a preset…"
                  rows={4}
                />
                <div className="ta-foot">
                  <span className="char">{input.length} chars</span>
                </div>
              </div>
            </div>

            <div>
              <div className="lbl">Quick presets</div>
              <div className="presets">
                {PRESETS.map((p, i) => (
                  <button key={i}
                    className={`pre-btn ${activePreset === i ? "active" : ""}`}
                    onClick={() => { setInput(p.value); setActivePreset(i); }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="slider-hd">
                <div className="lbl" style={{ margin: 0 }}>QR Size</div>
                <div className="slider-val">{size} × {size} px</div>
              </div>
              <input type="range" className="sz-slider" min={128} max={400} step={8}
                value={size} onChange={e => setSize(Number(e.target.value))} />
              <div className="sz-marks"><span>128px</span><span>256px</span><span>400px</span></div>
            </div>
          </div>

          <div className="preview">
            <div className="lbl" style={{ alignSelf: "flex-start" }}>Live preview</div>

            <div className="qr-frame">
              <div className="c c-tl" /><div className="c c-tr" />
              <div className="c c-bl" /><div className="c c-br" />
              <div className="qr-inner">
                {(!libReady || status === "generating") ? (
                  <div className="spinner" />
                ) : (status === "idle" || !input.trim()) ? (
                  <div className="empty-state">
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#7c6aff" strokeWidth="1.2">
                      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/>
                      <rect x="14" y="14" width="3" height="3" rx=".4"/><rect x="18" y="14" width="3" height="3" rx=".4"/>
                      <rect x="14" y="18" width="3" height="3" rx=".4"/><rect x="18" y="18" width="3" height="3" rx=".4"/>
                    </svg>
                    <span className="empty-label">enter content</span>
                  </div>
                ) : null}
                <div ref={qrContainerRef} style={{ display: status === "ready" ? "block" : "none" }} />
              </div>
            </div>

            <div className="actions">
              <button className="btn btn-dl" onClick={handleDownload} disabled={status !== "ready"}>
                {downloaded ? "✓ Downloaded!" : "↓ Download PNG"}
              </button>
              <button className="btn btn-cp" onClick={handleCopy} disabled={status !== "ready"}>
                {copied ? "✓ Copied!" : "⧉ Copy to clipboard"}
              </button>
            </div>

            <div className="meta">
              <span>PNG · {size}×{size}px</span>
              <span>{input.length > 0 ? `${input.length} chars` : "—"}</span>
            </div>
          </div>
        </div>

        <div className="footer">updates live as you type · rendered entirely client-side</div>
      </div>
    </div>
  );
}