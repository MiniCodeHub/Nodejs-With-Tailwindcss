export default function App() {
  const sections = [
    {
      title: "Welcome",
      subtitle: "Scroll Down",
      bg: "from-cyan-500 to-blue-700",
    },
    {
      title: "About Us",
      subtitle: "Building Amazing Experiences",
      bg: "from-violet-500 to-purple-700",
    },
    {
      title: "Services",
      subtitle: "Modern Web Solutions",
      bg: "from-emerald-500 to-green-700",
    },
    {
      title: "Contact",
      subtitle: "Let's Build Together",
      bg: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div
      className="
        h-screen
        overflow-y-scroll
        snap-y
        snap-mandatory
        scroll-smooth
      "
    >
      {sections.map((section, index) => (
        <section
          key={index}
          className={`
            h-screen
            snap-start
            flex
            items-center
            justify-center
            bg-gradient-to-br
            ${section.bg}
            relative
            overflow-hidden
          `}
        >
          {/* Background Glow */}
          <div
            className="
              absolute
              w-[500px]
              h-[500px]
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          {/* Content */}
          <div className="text-center z-10 px-6">
            <h1
              className="
                text-6xl
                md:text-8xl
                font-bold
                text-white
                mb-6
              "
            >
              {section.title}
            </h1>

            <p
              className="
                text-xl
                md:text-2xl
                text-white/80
              "
            >
              {section.subtitle}
            </p>

            {index < sections.length - 1 && (
              <div
                className="
                  mt-16
                  text-white
                  animate-bounce
                  text-4xl
                "
              >
                ↓
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}