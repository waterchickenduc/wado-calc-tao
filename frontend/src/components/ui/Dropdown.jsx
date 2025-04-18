import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

export default function Dropdown({ label, items = [], onSelect, selected }) {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && highlightIndex < items.length) {
        onSelect(items[highlightIndex]);
        setOpen(false);
        setHighlightIndex(-1);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlightIndex(-1);
    }
  };

  return (
    <div className="relative inline-block w-full md:w-auto" ref={dropdownRef}>
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          setHighlightIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className="w-full flex justify-between items-center px-4 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-white hover:bg-zinc-700"
      >
        {selected || label}
        <svg
          className="ml-2 h-4 w-4 text-zinc-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full md:w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg text-sm">
          {items.map((item, i) => {
            const isHighlighted = i === highlightIndex;
            const isSelected = item === selected;

            return (
              <li
                key={item}
                onMouseEnter={() => setHighlightIndex(i)}
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                  setHighlightIndex(-1);
                }}
                className={cn(
                  "px-4 py-2 cursor-pointer transition-colors",
                  isHighlighted
                    ? "bg-brand text-white"
                    : isSelected
                    ? "bg-zinc-700 text-white"
                    : "hover:bg-zinc-700 text-zinc-300"
                )}
              >
                {item}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
