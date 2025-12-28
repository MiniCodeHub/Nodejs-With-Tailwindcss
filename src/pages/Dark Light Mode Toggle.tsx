import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
    }
  }, []);

  // Save theme when it changes
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="container mx-auto px-4 py-12">
        {/* Toggle Button */}
        <div className="flex justify-end mb-12">
          <button
            onClick={toggleTheme}
            className={`relative w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
              isDark 
                ? 'bg-gray-800 text-yellow-300' 
                : 'bg-white text-indigo-600'
            }`}
            aria-label="Toggle theme"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {isDark ? (
                <svg className="w-7 h-7 transition-transform duration-300 rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 transition-transform duration-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-5xl font-bold mb-6 transition-colors duration-500 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Theme Switcher
          </h1>
          
          <p className={`text-xl mb-8 transition-colors duration-500 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Click the button above to toggle between light and dark modes. Your preference is saved automatically!
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { title: 'Smooth Transitions', desc: 'Animated color changes for a polished feel' },
              { title: 'Persistent Storage', desc: 'Theme saved in localStorage' },
              { title: 'React State', desc: 'useState hook manages theme state' }
            ].map((feature, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl shadow-lg transition-all duration-500 ${
                  isDark 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-white text-gray-900'
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={`transition-colors duration-500 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Code Explanation */}
          <div className={`mt-12 p-6 rounded-xl transition-all duration-500 ${
            isDark 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              How It Works
            </h2>
            <div className={`space-y-3 transition-colors duration-500 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <p className="font-mono text-sm">
                <span className="font-bold">State:</span> const [isDark, setIsDark] = useState(false)
              </p>
              <p>
                The <code className="px-2 py-1 rounded bg-opacity-50 bg-gray-500">isDark</code> state controls all theme styling throughout the component.
              </p>
              <p>
                Click the toggle → <code className="px-2 py-1 rounded bg-opacity-50 bg-gray-500">setIsDark(!isDark)</code> → entire UI transforms instantly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}