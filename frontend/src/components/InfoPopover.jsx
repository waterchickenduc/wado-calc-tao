// src/components/InfoPopover.jsx
import React, { useState } from "react";

export default function InfoPopover() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative ml-2 text-white/60 text-xs">
      <button
        onClick={() => setOpen(!open)}
        className="underline hover:text-blue-400"
      >
        ⓘ How to use
      </button>

      {open && (
        <div className="absolute z-50 bg-zinc-900 border border-zinc-700 rounded shadow-lg p-4 text-white text-sm w-72 right-0 top-6">
          <div className="flex justify-between items-center mb-2">
            <strong>Search using logic:</strong>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-red-400 text-sm"
            >
              ×
            </button>
          </div>

          <ul className="list-disc list-inside space-y-1">
            <li>
              Use <code>AND</code>, <code>OR</code>, <code>NOT</code> operators
            </li>
            <li>Group expressions with <code>( )</code></li>
            <li>Match rune name, rune stone, stat, or aura</li>
          </ul>

          <div className="mt-3">
            <strong>Examples:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li><code>(cr. rate AND jara)</code></li>
              <li><code>caissor OR (hp AND NOT cr. dmg)</code></li>
              <li><code>(skill cd OR cr. dmg) AND mehn</code></li>
              <li><code>NOT (menthe OR "hp recovery")</code></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
