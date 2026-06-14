import { useState } from "react";

const data = [
  { month: "Jan", value: 40 },
  { month: "Feb", value: 65 },
  { month: "Mar", value: 55 },
  { month: "Apr", value: 90 },
  { month: "May", value: 75 },
  { month: "Jun", value: 120 },
  { month: "Jul", value: 105 },
];

export default function App() {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  const width = 800;
  const height = 400;
  const padding = 50;

  const maxValue = Math.max(
    ...data.map((item) => item.value)
  );

  const minValue = Math.min(
    ...data.map((item) => item.value)
  );

  const points = data.map((item, index) => {
    const x =
      padding +
      (index * (width - padding * 2)) /
        (data.length - 1);

    const y =
      height -
      padding -
      ((item.value - minValue) /
        (maxValue - minValue)) *
        (height - padding * 2);

    return { x, y };
  });

  const pathData = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  return (
    <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-slate-900 rounded-3xl p-6 border border-slate-800">

        <h1 className="text-3xl font-bold text-white mb-2">
          Revenue Analytics
        </h1>

        <p className="text-slate-400 mb-8">
          Recharts-Style Line Chart Built From Scratch
        </p>

        <div className="relative">

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full"
          >

            {/* Grid Lines */}
            {[0, 1, 2, 3, 4].map((line) => (
              <line
                key={line}
                x1={padding}
                x2={width - padding}
                y1={
                  padding +
                  (line *
                    (height - padding * 2)) /
                    4
                }
                y2={
                  padding +
                  (line *
                    (height - padding * 2)) /
                    4
                }
                stroke="#334155"
                strokeWidth="1"
              />
            ))}

            {/* Area Fill */}
            <path
              d={`${pathData}
              L ${points[points.length - 1].x}
              ${height - padding}
              L ${points[0].x}
              ${height - padding}
              Z`}
              fill="rgba(6,182,212,0.15)"
            />

            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={activePoint === index ? 10 : 6}
                  fill="#06b6d4"
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() =>
                    setActivePoint(index)
                  }
                  onMouseLeave={() =>
                    setActivePoint(null)
                  }
                />
              </g>
            ))}

            {/* Labels */}
            {data.map((item, index) => (
              <text
                key={index}
                x={points[index].x}
                y={height - 15}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="14"
              >
                {item.month}
              </text>
            ))}
          </svg>

          {/* Tooltip */}
          {activePoint !== null && (
            <div
              className="
                absolute
                bg-slate-800
                border
                border-slate-700
                rounded-xl
                px-4
                py-2
                text-white
                shadow-xl
                pointer-events-none
              "
              style={{
                left: `${(points[activePoint].x / width) * 100}%`,
                top: `${(points[activePoint].y / height) * 100 - 10}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <p className="font-semibold">
                {data[activePoint].month}
              </p>

              <p className="text-cyan-400">
                ${data[activePoint].value}k
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">

          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">
              Highest
            </p>

            <h2 className="text-white text-2xl font-bold">
              ${maxValue}k
            </h2>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">
              Lowest
            </p>

            <h2 className="text-white text-2xl font-bold">
              ${minValue}k
            </h2>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">
              Months
            </p>

            <h2 className="text-white text-2xl font-bold">
              {data.length}
            </h2>
          </div>

        </div>
      </div>
    </div>
  );
}