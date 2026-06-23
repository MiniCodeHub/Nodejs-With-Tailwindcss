import { useEffect, useState } from "react";

export default function App() {
  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const [showSubmenu, setShowSubmenu] =
    useState(false);

  useEffect(() => {
    const closeMenu = () => {
      setMenu((prev) => ({
        ...prev,
        visible: false,
      }));
      setShowSubmenu(false);
    };

    window.addEventListener(
      "click",
      closeMenu
    );

    return () =>
      window.removeEventListener(
        "click",
        closeMenu
      );
  }, []);

  const handleContextMenu = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    setMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const menuItemClass =
    `
    px-4
    py-3
    cursor-pointer
    hover:bg-slate-700
    transition
    flex
    items-center
    justify-between
  `;

  return (
    <div
      onContextMenu={handleContextMenu}
      className="
        min-h-screen
        bg-slate-950
        flex
        items-center
        justify-center
        text-white
      "
    >
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">
          Right Click Anywhere
        </h1>

        <p className="text-slate-400">
          Custom Context Menu with Submenu
        </p>
      </div>

      {menu.visible && (
        <div
          className="
            fixed
            bg-slate-800
            border
            border-slate-700
            rounded-xl
            shadow-2xl
            w-56
            overflow-hidden
            z-50
          "
          style={{
            top: menu.y,
            left: menu.x,
          }}
        >
          <div
            className={menuItemClass}
            onClick={() =>
              alert("Open Clicked")
            }
          >
            📂 Open
          </div>

          <div
            className={menuItemClass}
            onClick={() =>
              alert("Rename Clicked")
            }
          >
            ✏️ Rename
          </div>

          <div
            className={`${menuItemClass} relative`}
            onMouseEnter={() =>
              setShowSubmenu(true)
            }
            onMouseLeave={() =>
              setShowSubmenu(false)
            }
          >
            <span>
              🎨 Appearance
            </span>

            <span>▶</span>

            {showSubmenu && (
              <div
                className="
                  absolute
                  left-full
                  top-0
                  ml-1
                  w-48
                  bg-slate-800
                  border
                  border-slate-700
                  rounded-xl
                  overflow-hidden
                  shadow-2xl
                "
              >
                <div
                  className={menuItemClass}
                >
                  🌙 Dark Theme
                </div>

                <div
                  className={menuItemClass}
                >
                  ☀️ Light Theme
                </div>

                <div
                  className={menuItemClass}
                >
                  🎯 System Theme
                </div>
              </div>
            )}
          </div>

          <div
            className={menuItemClass}
            onClick={() =>
              alert("Copy Clicked")
            }
          >
            📋 Copy
          </div>

          <div
            className={menuItemClass}
            onClick={() =>
              alert("Delete Clicked")
            }
          >
            🗑 Delete
          </div>
        </div>
      )}
    </div>
  );
}