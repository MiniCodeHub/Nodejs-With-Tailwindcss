import { useEffect, useState } from "react";

const themes = {
  NeoScope: {
    primary: "#06b6d4",
    secondary: "#0891b2",
    accent: "#67e8f9",
    background: "#020617",
    card: "#0f172a",
  },
  MiniCodeHub: {
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    accent: "#c4b5fd",
    background: "#111827",
    card: "#1f2937",
  },
  FinTech: {
    primary: "#22c55e",
    secondary: "#16a34a",
    accent: "#86efac",
    background: "#052e16",
    card: "#14532d",
  },
};

type ThemeName = keyof typeof themes;

export default function App() {
  const [theme, setTheme] =
    useState<ThemeName>("NeoScope");

  useEffect(() => {
    const current = themes[theme];

    document.documentElement.style.setProperty(
      "--primary",
      current.primary
    );

    document.documentElement.style.setProperty(
      "--secondary",
      current.secondary
    );

    document.documentElement.style.setProperty(
      "--accent",
      current.accent
    );

    document.documentElement.style.setProperty(
      "--background",
      current.background
    );

    document.documentElement.style.setProperty(
      "--card",
      current.card
    );
  }, [theme]);

  return (
    <div
      style={{
        background: "var(--background)",
      }}
      className="min-h-screen transition-all duration-500 p-8"
    >
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-wrap gap-4 justify-center mb-10">
          {(Object.keys(themes) as ThemeName[]).map(
            (item) => (
              <button
                key={item}
                onClick={() => setTheme(item)}
                className="px-6 py-3 rounded-xl text-white font-semibold transition hover:scale-105"
                style={{
                  background:
                    theme === item
                      ? "var(--primary)"
                      : "#334155",
                }}
              >
                {item}
              </button>
            )
          )}
        </div>

        <div
          className="rounded-3xl p-8 transition-all duration-500"
          style={{
            background: "var(--card)",
          }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-4xl font-bold"
                style={{
                  color: "var(--primary)",
                }}
              >
                {theme} Dashboard
              </h1>

              <p className="text-slate-400 mt-2">
                Multi-Tenant Theme Switching using CSS Variables
              </p>
            </div>

            <div
              className="w-16 h-16 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg,var(--primary),var(--secondary))",
              }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="rounded-2xl p-6 border border-white/10 transition-all hover:-translate-y-2"
                style={{
                  background:
                    "rgba(255,255,255,0.05)",
                }}
              >
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{
                    color: "var(--accent)",
                  }}
                >
                  Card {card}
                </h2>

                <p className="text-slate-300 mb-5">
                  Theme colors update instantly using CSS variables.
                </p>

                <button
                  className="px-5 py-2 rounded-xl font-semibold text-white"
                  style={{
                    background:
                      "var(--primary)",
                  }}
                >
                  View Details
                </button>
              </div>
            ))}

          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">

            <div
              className="p-6 rounded-2xl"
              style={{
                background:
                  "rgba(255,255,255,0.04)",
              }}
            >
              <h3
                className="text-xl font-bold mb-3"
                style={{
                  color: "var(--accent)",
                }}
              >
                Active Theme
              </h3>

              <p className="text-slate-300">
                {theme}
              </p>
            </div>

            <div
              className="p-6 rounded-2xl"
              style={{
                background:
                  "rgba(255,255,255,0.04)",
              }}
            >
              <h3
                className="text-xl font-bold mb-3"
                style={{
                  color: "var(--accent)",
                }}
              >
                Primary Color
              </h3>

              <div
                className="w-full h-12 rounded-xl"
                style={{
                  background:
                    "var(--primary)",
                }}
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}