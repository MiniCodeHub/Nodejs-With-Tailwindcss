const images = [
  {
    id: 1,
    height: "h-56",
    title: "Mountain",
  },
  {
    id: 2,
    height: "h-80",
    title: "Ocean",
  },
  {
    id: 3,
    height: "h-64",
    title: "Forest",
  },
  {
    id: 4,
    height: "h-96",
    title: "City",
  },
  {
    id: 5,
    height: "h-52",
    title: "Sunset",
  },
  {
    id: 6,
    height: "h-72",
    title: "Desert",
  },
  {
    id: 7,
    height: "h-60",
    title: "Bridge",
  },
  {
    id: 8,
    height: "h-80",
    title: "River",
  },
  {
    id: 9,
    height: "h-64",
    title: "Valley",
  },
  {
    id: 10,
    height: "h-96",
    title: "Sky",
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Masonry Gallery
          </h1>

          <p className="text-slate-400 text-lg">
            Responsive Pinterest Style Layout
          </p>
        </div>

        <div
          className="
            columns-1
            sm:columns-2
            lg:columns-3
            xl:columns-4
            gap-5
          "
        >
          {images.map((image) => (
            <div
              key={image.id}
              className="
                mb-5
                break-inside-avoid
                group
                cursor-pointer
              "
            >
              <div
                className={`
                  ${image.height}
                  rounded-3xl
                  overflow-hidden
                  relative
                  bg-gradient-to-br
                  from-cyan-500
                  via-blue-600
                  to-violet-700
                  transform
                  transition-all
                  duration-500
                  group-hover:scale-[1.03]
                `}
              >
                {/* Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-black/20
                    group-hover:bg-black/40
                    transition
                  "
                />

                {/* Title */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    p-5
                  "
                >
                  <h2
                    className="
                      text-white
                      font-bold
                      text-xl
                    "
                  >
                    {image.title}
                  </h2>

                  <p
                    className="
                      text-slate-200
                      text-sm
                    "
                  >
                    Explore Collection
                  </p>
                </div>

                {/* Floating Number */}
                <div
                  className="
                    absolute
                    top-4
                    right-4
                    w-10
                    h-10
                    rounded-full
                    bg-white/20
                    backdrop-blur-md
                    flex
                    items-center
                    justify-center
                    text-white
                    font-bold
                  "
                >
                  {image.id}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}