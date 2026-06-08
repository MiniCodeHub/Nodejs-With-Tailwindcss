import { useState, useRef, useEffect } from "react";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [leftWidth, setLeftWidth] = useState(40);
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (
      e: MouseEvent
    ) => {
      if (
        !isDragging ||
        !containerRef.current
      ) {
        return;
      }

      const container =
        containerRef.current;

      const rect =
        container.getBoundingClientRect();

      const newWidth =
        ((e.clientX - rect.left) /
          rect.width) *
        100;

      if (
        newWidth >= 20 &&
        newWidth <= 80
      ) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );
    };
  }, [isDragging]);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white">
            Drag to Resize Panel
          </h1>

          <p className="text-slate-400 mt-2">
            Built with useRef and Mouse Events
          </p>
        </div>

        <div
          ref={containerRef}
          className="
            h-[600px]
            flex
            border
            border-slate-800
            rounded-2xl
            overflow-hidden
            bg-slate-900
          "
        >
          {/* Left Panel */}

          <div
            style={{
              width: `${leftWidth}%`,
            }}
            className="
              bg-slate-900
              p-6
              overflow-auto
            "
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Explorer
            </h2>

            <div className="space-y-3">
              {Array.from(
                { length: 15 },
                (_, i) => (
                  <div
                    key={i}
                    className="
                      bg-slate-800
                      p-3
                      rounded-lg
                      text-slate-300
                    "
                  >
                    File-{i + 1}.tsx
                  </div>
                )
              )}
            </div>
          </div>

          {/* Resize Handle */}

          <div
            onMouseDown={
              startDragging
            }
            className="
              w-2
              bg-cyan-500
              cursor-col-resize
              hover:bg-cyan-400
              transition-colors
              flex-shrink-0
            "
          />

          {/* Right Panel */}

          <div
            className="
              flex-1
              bg-slate-950
              p-6
              overflow-auto
            "
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Editor
            </h2>

            <div
              className="
                bg-slate-900
                rounded-xl
                p-5
                border
                border-slate-800
              "
            >
              <pre className="text-green-400 whitespace-pre-wrap">
{`function hello() {
  console.log(
    "Resizable Panels"
  );
}`}
              </pre>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-sm">
                  Left Width
                </p>

                <h3 className="text-white text-2xl font-bold">
                  {leftWidth.toFixed(0)}%
                </h3>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-sm">
                  Right Width
                </p>

                <h3 className="text-white text-2xl font-bold">
                  {(100 - leftWidth).toFixed(0)}%
                </h3>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}