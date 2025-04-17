import React, { useState } from 'react';
import runes from '../data/runes.json';

export default function RuneSelector({ selectedRunes, setSelectedRunes }) {
  const [search, setSearch] = useState('');

  const filtered = runes.filter(rune =>
    rune.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRune = (rune) => {
    const count = selectedRunes.filter(r => r.name === rune.name).length;
    const MAX = 6;

    if (count < MAX) {
      setSelectedRunes([...selectedRunes, rune]);
    }
  };

  return (
    <div className="text-white">
      <p className="text-sm text-gray-400 mb-2">
        Selected Runes ({selectedRunes.length}/6)
      </p>

      <input
        placeholder="Search runes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rune, i) => {
          const count = selectedRunes.filter(r => r.name === rune.name).length;
          return (
            <div
              key={i}
              onClick={() => toggleRune(rune)}
              className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border border-blue-700 hover:border-blue-400 shadow-lg hover:shadow-blue-600/50 transition-all duration-200 cursor-pointer p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-blue-300">
                  {rune.name}
                </h3>
                {count > 0 && (
                  <span className="text-xs bg-blue-600 text-white font-mono px-2 py-0.5 rounded-full shadow-sm">
                    ×{count}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {rune.runes.map((stone, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-600/30 text-blue-200 px-2 py-1 rounded-full font-semibold tracking-wide"
                  >
                    {stone}
                  </span>
                ))}
              </div>

              <ul className="text-sm text-gray-300 space-y-1 font-mono">
                {Object.entries(rune.stats)
                  .filter(([_, val]) => val > 0)
                  .map(([stat, val]) => (
                    <li key={stat}>
                      • {stat.replace(/_/g, ' ')}: {val}%
                    </li>
                  ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
