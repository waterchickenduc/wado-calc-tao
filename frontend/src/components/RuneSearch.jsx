import React, { useState, useEffect } from 'react';
import runes from '../data/runes.json';

export default function RuneSearch() {
  const [search, setSearch] = useState('');
  const [statFilter, setStatFilter] = useState('');
  const [runeFilter, setRuneFilter] = useState('');
  const [availableStats, setAvailableStats] = useState([]);
  const [availableStones, setAvailableStones] = useState([]);

  useEffect(() => {
    // Collect only valid stats (>0 somewhere)
    const statKeys = Object.keys(
      runes.reduce((acc, rune) => {
        for (const [key, val] of Object.entries(rune.stats)) {
          if (val > 0) acc[key] = true;
        }
        return acc;
      }, {})
    ).sort(); // sort stats

    setAvailableStats(statKeys);

    // Collect unique rune stones
    const allStones = new Set();
    runes.forEach(r => r.runes.forEach(stone => allStones.add(stone)));
    setAvailableStones([...allStones].sort()); // sort stones
  }, []);

  const filtered = runes.filter((rune) => {
    const matchesName = rune.name.toLowerCase().includes(search.toLowerCase());

    const matchesStat =
      !statFilter || (rune.stats[statFilter] && rune.stats[statFilter] > 0);

    const matchesStone =
      !runeFilter || rune.runes.includes(runeFilter);

    return matchesName && matchesStat && matchesStone;
  });

  return (
    <div className="text-white max-w-screen-xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">🔍 Rune Search Ready! 🧙‍♂️</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rune name..."
          className="px-4 py-2 w-full sm:w-1/3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={statFilter}
          onChange={(e) => setStatFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter by stat</option>
          {availableStats.map((key) => (
            <option key={key} value={key}>
              {key.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        <select
          value={runeFilter}
          onChange={(e) => setRuneFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Filter by rune stone</option>
          {availableStones.map((stone) => (
            <option key={stone} value={stone}>
              {stone}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 italic">No matching runes found.</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((rune, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border border-blue-700 hover:border-blue-500 shadow-lg hover:shadow-blue-600/40 transition-all p-5"
            >
              <h3 className="text-lg font-bold text-blue-300 mb-1">{rune.name}</h3>

              <div className="flex flex-wrap gap-2 mb-2">
                {rune.runes.map((stone, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-700/30 text-blue-200 px-2 py-1 rounded-full font-semibold"
                  >
                    {stone}
                  </span>
                ))}
              </div>

              <ul className="text-sm text-gray-300 font-mono space-y-0.5">
                {Object.entries(rune.stats)
                  .filter(([_, val]) => val > 0)
                  .map(([stat, val]) => (
                    <li key={stat}>• {stat.replace(/_/g, ' ')}: {val}%</li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
