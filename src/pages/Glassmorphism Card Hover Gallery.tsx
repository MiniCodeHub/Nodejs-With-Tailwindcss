import { useState, useRef } from "react";
import type { CSSProperties } from "react";

/* ─── Types ────────────────────────────────────────────────── */

interface CardData {
  id: number;
  accent: string;
  accentRgb: string;
  icon: string;
  tag: string;
  title: string;
  desc: string;
  stat: string;
  featured?: boolean;
  dualAccent?: string;
}

interface TiltState {
  x: number;
  y: number;
}

/* ─── Data ──────────────────────────────────────────────────── */

const CARDS: CardData[] = [
  {
    id: 1,
    accent: "#c77dff",
    accentRgb: "199,125,255",
    icon: "✦",
    tag: "Featured",
    title: "Celestial Refraction",
    desc: "Light bends through invisible planes, casting spectral shadows across the infinite.",
    stat: "Ethereal",
    featured: true,
  },
  {
    id: 2,
    accent: "#4d96ff",
    accentRgb: "77,150,255",
    icon: "◎",
    tag: "Series I",
    title: "Liquid Horizon",
    desc: "Where ocean meets sky in a perfect blur of cerulean depth.",
    stat: "Aquatic",
  },
  {
    id: 3,
    accent: "#ff6b6b",
    accentRgb: "255,107,107",
    icon: "❋",
    tag: "Series I",
    title: "Ember Veil",
    desc: "A warmth that lingers long after the flame has passed through translucent air.",
    stat: "Thermal",
  },
  {
    id: 4,
    accent: "#6bcb77",
    accentRgb: "107,203,119",
    icon: "⬡",
    tag: "Series II",
    title: "Verdant Signal",
    desc: "The frequency of growth encoded in geometric leaves of glass.",
    stat: "Organic",
  },
  {
    id: 5,
    accent: "#ffd93d",
    accentRgb: "255,217,61",
    icon: "◈",
    tag: "Series II",
    title: "Solar Lattice",
    desc: "Crystallised sunlight frozen in a moment of noon zenith brilliance.",
    stat: "Radiant",
  },
  {
    id: 6,
    accent: "#ff9f43",
    accentRgb: "255,159,67",
    icon: "⟡",
    tag: "Series III",
    title: "Amber Drift",
    desc: "Ancient resins suspended in motion, preserving the warmth of dusk.",
    stat: "Ancient",
  },
  {
    id: 7,
    accent: "#4d96ff",
    accentRgb: "77,150,255",
    icon: "⊕",
    tag: "Final",
    title: "Convergence Point",
    desc: "All frequencies meet at the axis — where blue dissolves into violet and time pauses.",
    stat: "Singular",
    featured: true,
    dualAccent: "#c77dff",
  },
];

/* ─── Orb (typed) ───────────────────────────────────────────── */

interface OrbProps {
  style: CSSProperties;
}

function Orb({ style }: OrbProps) {
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: "50%",
        ...style,
      }}
    />
  );
}

/* ─── GlassCard (typed) ─────────────────────────────────────── */

interface GlassCardProps {
  card: CardData;
  index: number;
}

function GlassCard({ card, index }: GlassCardProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [tilt, setTilt] = useState<TiltState>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -6, y: dx * 6 });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const cardTransform = hovered
    ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-14px) scale(1.025)`
    : "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        gridColumn: card.featured ? "span 2" : "span 1",
        animationDelay: `${0.05 + index * 0.07}s`,
        transform: cardTransform,
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease",
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        background: "rgba(255,255,255,0.055)",
        backdropFilter: "blur(18px) saturate(1.6)",
        WebkitBackdropFilter: "blur(18px) saturate(1.6)",
        border: hovered
          ? `1px solid rgba(${card.accentRgb},0.4)`
          : "1px solid rgba(255,255,255,0.1)",
        boxShadow: hovered
          ? `0 24px 60px rgba(0,0,0,0.5), 0 0 60px rgba(${card.accentRgb},0.15), inset 0 1px 0 rgba(255,255,255,0.15)`
          : "0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
        animation: "cardIn 0.6s ease both",
      }}
    >
      {/* Shimmer sweep */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: hovered ? "160%" : "-100%",
          width: "60%",
          height: "100%",
          background:
            "linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.07) 50%,transparent 70%)",
          transition: "left 0.7s ease",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* Visual panel */}
      <div
        style={{
          position: "relative",
          height: card.featured ? 240 : 190,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Glow background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: card.dualAccent
              ? `linear-gradient(135deg, ${card.accent}, ${card.dualAccent})`
              : `radial-gradient(ellipse at 50% 50%, ${card.accent}, transparent 75%)`,
            opacity: hovered ? 0.28 : 0.15,
            transform: hovered ? "scale(1.1)" : "scale(1)",
            transition: "opacity 0.4s ease, transform 0.6s ease",
          }}
        />

        {/* Bottom glow blob */}
        <div
          style={{
            position: "absolute",
            bottom: hovered ? -20 : -60,
            left: "50%",
            transform: "translateX(-50%)",
            width: 200,
            height: 200,
            background: card.accent,
            borderRadius: "50%",
            filter: "blur(60px)",
            opacity: hovered ? 0.22 : 0,
            transition: "opacity 0.45s ease, bottom 0.45s ease",
            pointerEvents: "none",
          }}
        />

        {/* Index label */}
        <span
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.85rem",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Tag badge */}
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: card.accent,
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 100,
            padding: "4px 10px",
            backdropFilter: "blur(8px)",
          }}
        >
          {card.tag}
        </span>

        {/* Icon */}
        <span
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: card.featured ? "5rem" : "3.5rem",
            lineHeight: 1,
            filter: hovered
              ? `drop-shadow(0 0 35px ${card.accent})`
              : `drop-shadow(0 0 20px ${card.accent})`,
            transform: hovered
              ? "scale(1.18) translateY(-4px)"
              : "scale(1) translateY(0)",
            transition:
              "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), filter 0.4s ease",
            display: "block",
          }}
        >
          {card.icon}
        </span>
      </div>

      {/* Card body */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "1.4rem 1.5rem 1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: hovered ? "#fff" : "rgba(255,255,255,0.92)",
            letterSpacing: "-0.01em",
            marginBottom: "0.35rem",
            transition: "color 0.3s ease",
          }}
        >
          {card.title}
        </h2>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.95rem",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.55,
            marginBottom: "1.2rem",
          }}
        >
          {card.desc}
        </p>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: card.accent,
                boxShadow: `0 0 8px ${card.accent}`,
                display: "inline-block",
              }}
            />
            {card.stat}
          </div>

          <button
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: hovered ? card.accent : "rgba(255,255,255,0.07)",
              border: hovered
                ? `1px solid ${card.accent}`
                : "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: hovered ? "#fff" : "rgba(255,255,255,0.5)",
              fontSize: "1.1rem",
              cursor: "pointer",
              transform: hovered ? "rotate(45deg)" : "rotate(0deg)",
              transition: "all 0.35s ease",
            }}
            aria-label="Explore"
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Main Gallery ──────────────────────────────────────────── */

export default function GlassGallery() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0012",
        overflowX: "hidden",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Syne:wght@400;600;700;800&display=swap');

        @keyframes drift {
          0%   { transform: translate(0,0) scale(1); }
          25%  { transform: translate(40px,-30px) scale(1.05); }
          50%  { transform: translate(-20px,50px) scale(0.95); }
          75%  { transform: translate(-40px,-20px) scale(1.03); }
          100% { transform: translate(0,0) scale(1); }
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Animated mesh background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <Orb style={{
          width: 600, height: 600,
          background: "radial-gradient(circle, #c77dff, transparent 70%)",
          top: -150, left: -100,
          filter: "blur(80px)", opacity: 0.35,
          animation: "drift 18s linear infinite",
        }} />
        <Orb style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, #4d96ff, transparent 70%)",
          top: "20%", right: -120,
          filter: "blur(80px)", opacity: 0.35,
          animation: "drift 22s linear infinite",
          animationDelay: "-6s",
        }} />
        <Orb style={{
          width: 450, height: 450,
          background: "radial-gradient(circle, #ff6b6b, transparent 70%)",
          bottom: "10%", left: "20%",
          filter: "blur(80px)", opacity: 0.35,
          animation: "drift 15s linear infinite",
          animationDelay: "-10s",
        }} />
        <Orb style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, #6bcb77, transparent 70%)",
          bottom: -100, right: "10%",
          filter: "blur(80px)", opacity: 0.35,
          animation: "drift 20s linear infinite",
          animationDelay: "-3s",
        }} />

        {/* Noise grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Page content */}
      <div style={{ position: "relative", zIndex: 10 }}>

        {/* Header */}
        <header style={{ padding: "4rem 2rem 2rem", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "1rem",
            }}
          >
            Visual Showcase · 2026
          </p>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontWeight: 300,
              color: "#fff",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Through the{" "}
            <span
              style={{
                fontStyle: "italic",
                background: "linear-gradient(135deg, #c77dff, #4d96ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Glass
            </span>
          </h1>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.15rem",
              fontStyle: "italic",
              fontWeight: 300,
              color: "rgba(255,255,255,0.45)",
              marginTop: "1rem",
            }}
          >
            A collection suspended between depth and light
          </p>

          <div
            style={{
              width: 60,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              margin: "2rem auto",
            }}
          />
        </header>

        {/* Card grid */}
        <main
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
            padding: "1rem 2.5rem 5rem",
            maxWidth: 1300,
            margin: "0 auto",
          }}
        >
          {CARDS.map((card, i) => (
            <GlassCard key={card.id} card={card} index={i} />
          ))}
        </main>

        <footer
          style={{
            textAlign: "center",
            padding: "2rem",
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.18)",
          }}
        >
          React · TypeScript · Glassmorphism Gallery
        </footer>
      </div>
    </div>
  );
}