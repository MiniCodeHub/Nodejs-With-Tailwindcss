"use client";

import { useState } from "react";

const quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "Java is to JavaScript what car is to Carpet.", author: "Chris Heilmann" },
  { text: "Programs must be written for people to read.", author: "Harold Abelson" },
];

export default function RandomQuote() {
  const [quote, setQuote] = useState(quotes[0]);
  const [fade, setFade] = useState(true);

  const getQuote = () => {
    setFade(false);
    setTimeout(() => {
      const random = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(random);
      setFade(true);
    }, 200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div
        className={`w-80 p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20
        shadow-xl transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}
      >
        <p className="text-white text-lg font-semibold mb-4">
          “{quote.text}”
        </p>
        <p className="text-cyan-400 text-sm mb-6">
          — {quote.author}
        </p>

        <button
          onClick={getQuote}
          className="w-full py-2 rounded-lg bg-cyan-400 text-black font-bold
                 hover:bg-cyan-300 transition-all"
        >
          New Quote
        </button>
      </div>
    </div>
  );
}
