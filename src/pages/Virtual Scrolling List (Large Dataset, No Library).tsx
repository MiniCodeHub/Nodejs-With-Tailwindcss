import { useState, useMemo } from "react";

const TOTAL_ITEMS = 10000;
const ITEM_HEIGHT = 60;
const CONTAINER_HEIGHT = 500;

export default function App() {
  const [scrollTop, setScrollTop] = useState(0);

  const data = useMemo(
    () =>
      Array.from(
        { length: TOTAL_ITEMS },
        (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
        })
      ),
    []
  );

  const startIndex = Math.floor(
    scrollTop / ITEM_HEIGHT
  );

  const visibleCount =
    Math.ceil(
      CONTAINER_HEIGHT / ITEM_HEIGHT
    ) + 5;

  const endIndex =
    Math.min(
      startIndex + visibleCount,
      TOTAL_ITEMS
    );

  const visibleItems =
    data.slice(
      startIndex,
      endIndex
    );

  const totalHeight =
    TOTAL_ITEMS * ITEM_HEIGHT;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">

        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white">
            Virtual Scrolling List
          </h1>

          <p className="text-slate-400 mt-2">
            Rendering 10,000 items efficiently
          </p>
        </div>

        <div
          className="
            overflow-y-auto
            bg-slate-900
            rounded-2xl
            border
            border-slate-800
          "
          style={{
            height: CONTAINER_HEIGHT,
          }}
          onScroll={(e) =>
            setScrollTop(
              e.currentTarget.scrollTop
            )
          }
        >
          <div
            style={{
              height: totalHeight,
              position: "relative",
            }}
          >
            {visibleItems.map(
              (item, index) => {

                const actualIndex =
                  startIndex + index;

                return (
                  <div
                    key={item.id}
                    className="
                      absolute
                      left-0
                      right-0
                      px-6
                      flex
                      items-center
                      justify-between
                      border-b
                      border-slate-800
                      hover:bg-slate-800/50
                      transition-colors
                    "
                    style={{
                      height:
                        ITEM_HEIGHT,
                      top:
                        actualIndex *
                        ITEM_HEIGHT,
                    }}
                  >
                    <div>
                      <h3 className="text-white font-semibold">
                        {item.name}
                      </h3>

                      <p className="text-slate-400 text-sm">
                        {item.email}
                      </p>
                    </div>

                    <span
                      className="
                        bg-cyan-500/20
                        text-cyan-400
                        px-3
                        py-1
                        rounded-full
                        text-sm
                      "
                    >
                      #{item.id}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">
              Total Items
            </p>

            <h2 className="text-2xl font-bold text-white mt-1">
              {TOTAL_ITEMS}
            </h2>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">
              Visible Rows
            </p>

            <h2 className="text-2xl font-bold text-white mt-1">
              {visibleItems.length}
            </h2>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">
              Start Index
            </p>

            <h2 className="text-2xl font-bold text-white mt-1">
              {startIndex}
            </h2>
          </div>

        </div>
      </div>
    </div>
  );
}