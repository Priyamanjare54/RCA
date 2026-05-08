// src/components/Navbar.js
import React, { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-transparent fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rcaGold flex items-center justify-center text-rcaDark font-bold">
            RCA
          </div>
          <div>
            <div className="text-lg font-semibold text-white">RCA — The Forge</div>
            <div className="text-xs text-white/70">High-performance cricket coaching</div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#programs" className="hover:underline text-white/90">Programs</a>
          <a href="#tech" className="hover:underline text-white/90">Innovation</a>
          <a href="#contact" className="hover:underline text-white/90">Join</a>
          <a
            href="#join"
            className="px-4 py-2 rounded-lg bg-rcaGold text-rcaDark font-semibold shadow"
          >
            Join
          </a>
        </nav>

        {/* Mobile button */}
        <button
          className="md:hidden p-2 rounded-md border border-white/10 bg-black/30"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {open ? (
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-rcaDark/95 backdrop-blur-sm transition-all duration-200 ${
          open ? "max-h-72 py-4" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-3">
          <a href="#programs" className="py-3 border-b border-white/6 text-white">Programs</a>
          <a href="#tech" className="py-3 border-b border-white/6 text-white">Innovation</a>
          <a href="#contact" className="py-3 border-b border-white/6 text-white">Join</a>
          <a href="#tour" className="py-3 text-white">Virtual tour</a>
        </div>
      </div>
    </header>
  );
}
