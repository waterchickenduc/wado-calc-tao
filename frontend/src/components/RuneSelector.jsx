import React from "react";

export default function RuneSelector({ runes, onAddRune, selectedRunes }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {runes.map((rune) => (
        <div
          key={rune.name}
          onClick={() => onAddRune(rune)}
          className="bg-zinc-800 hover:bg-zinc-700 cursor-pointer p-3 rounded-md border border-zinc-700 transition-all duration-150"
        >
          <div className="font-bold text-blue-400 mb-1">{rune.name}</div>
          <div className="flex flex-wrap gap-1 mb-2 text-xs text-zinc-400">
            {rune.runes.map((r, i) => (
              <span key={i} className="bg-zinc-700 text-white px-2 py-0.5 rounded">
                {r}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
