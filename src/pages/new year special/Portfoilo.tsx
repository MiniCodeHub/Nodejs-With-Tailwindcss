"use client";
import { useEffect, useState } from "react";

export default function Portfolio() {
  const [dark, setDark] = useState(false);

  // Load theme
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", dark ? "light" : "dark");
  };

  return (
    <main
      className="min-h-screen bg-gray-100 dark:bg-gray-900
                 text-gray-900 dark:text-white
                 transition-colors duration-300"
    >
      {/* ================= NAVBAR ================= */}
      <nav className="fixed w-full top-0 bg-white/80 dark:bg-gray-900/80
                      backdrop-blur border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold text-xl">MiniCodeHub</h1>
          <div className="flex gap-6 items-center">
            <a href="#projects" className="hover:text-cyan-500">Projects</a>
            <a href="#about" className="hover:text-cyan-500">About</a>
            <a href="#contact" className="hover:text-cyan-500">Contact</a>
            <button
              onClick={toggleTheme}
              className="px-4 py-1 rounded-full bg-gray-900 text-white
                         dark:bg-white dark:text-gray-900 transition"
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-24 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
          Hi, I’m <span className="text-cyan-500">MiniCodeHub</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
          I build modern web apps using Next.js, Tailwind CSS & JavaScript.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="#projects"
            className="px-6 py-3 bg-cyan-500 rounded-lg font-semibold hover:scale-105 transition"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            Contact Me
          </a>
        </div>
      </section>

      {/* ================= PROJECTS ================= */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold mb-10 text-center">Projects</h3>

        <div className="grid md:grid-cols-3 gap-8">
          {["Portfolio", "UI Components", "Mini Apps"].map((project) => (
            <div
              key={project}
              className="p-6 rounded-xl bg-white dark:bg-gray-800
                         shadow-lg hover:shadow-2xl hover:-translate-y-2
                         transition"
            >
              <h4 className="text-xl font-semibold mb-2">{project}</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Modern project built using Next.js & Tailwind CSS.
              </p>
              <button className="text-cyan-500 font-semibold">
                View →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="bg-gray-200 dark:bg-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6">About Me</h3>
          <p className="text-gray-700 dark:text-gray-300">
            I’m a developer focused on building clean, responsive and
            user-friendly interfaces. I share coding projects and tutorials
            on YouTube to help beginners grow.
          </p>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h3 className="text-3xl font-bold mb-6">Contact</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Want to work together or have a question?
        </p>
        <a
          href="mailto:example@email.com"
          className="px-8 py-3 bg-cyan-500 rounded-lg font-semibold hover:scale-105 transition"
        >
          Email Me
        </a>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center py-6 text-sm text-gray-500">
        © 2026 MiniCodeHub. All rights reserved.
      </footer>
    </main>
  );
}
