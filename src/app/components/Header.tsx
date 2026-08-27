"use client";

import { useState } from "react";
import { NAV_LINKS } from "../constants";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full p-4 bg-transparent z-30">
      <nav className="relative max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-lg font-bold"></div>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-6 text-sm md:text-base">
          {NAV_LINKS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="capitalize text-gray-300 hover:text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {id}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden px-3 py-2 rounded border border-white/20"
          onClick={() => setMenuOpen((s) => !s)}
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* mobile menu panel */}
        <div
          className={`md:hidden absolute right-4 top-full mt-2 z-50 transform transition-all duration-150 ${
            menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          <div className="min-w-[160px] bg-black/90 text-white rounded-lg py-2 shadow-lg border border-white/10">
            <ul className="flex flex-col">
              {NAV_LINKS.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-white/10"
                  >
                    {id}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
