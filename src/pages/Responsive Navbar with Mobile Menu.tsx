'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Work', href: '#work' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#"
              className="relative group"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              <span className="text-2xl font-bold tracking-tighter text-white">
                NOVA
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 group-hover:w-full transition-all duration-300" />
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 group"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {item.name}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <button className="ml-4 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center focus:outline-none group"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                    isOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/95 backdrop-blur-2xl transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`relative h-full flex flex-col justify-center items-center transition-all duration-500 ${
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          <div className="space-y-2 text-center">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-8 py-4 text-4xl font-bold text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  animationDelay: `${index * 100}ms`,
                  animation: isOpen
                    ? `slideUp 0.6s ease-out ${index * 0.1}s both`
                    : 'none',
                }}
              >
                {item.name}
              </a>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-12 px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105"
            style={{
              animation: isOpen ? 'slideUp 0.6s ease-out 0.4s both' : 'none',
            }}
          >
            Get Started
          </button>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Demo Content */}
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h1
              className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Build the
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Future
              </span>
            </h1>
            <p
              className="text-xl text-white/60 max-w-2xl"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              A modern, responsive navbar component with smooth animations and a
              beautiful mobile menu experience.
            </p>
          </div>
        </section>

        {/* Sections for scroll demo */}
        <section id="work" className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-4">Work</h2>
            <p className="text-white/60">Scroll to see the navbar transform</p>
          </div>
        </section>

        <section id="services" className="min-h-screen flex items-center justify-center px-6 bg-white/5">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-4">Services</h2>
            <p className="text-white/60">Mobile menu with smooth animations</p>
          </div>
        </section>

        <section id="about" className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-4">About</h2>
            <p className="text-white/60">Fully responsive design</p>
          </div>
        </section>

        <section id="contact" className="min-h-screen flex items-center justify-center px-6 bg-white/5">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-4">Contact</h2>
            <p className="text-white/60">Built with Next.js & Tailwind CSS</p>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        * {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
        }
      `}} />
    </>
  );
}