import React from "react";

export default function RuneSelector({ runes, onAddRune, selectedRunes }) {
  const runeCounts = selectedRunes.reduce((acc, rune) => {
    acc[rune.name] = (acc[rune.name] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {runes.map((rune, index) => (
        <div
          key={`${rune.name}-${index}`}
          className="p-3 bg-zinc-900 border border-zinc-700 rounded-md"
        >
          <h4 className="text-blue-400 font-semibold">
            {rune.name}
            {runeCounts[rune.name] ? (
              <span className="ml-2 text-white">×{runeCounts[rune.name]}</span>
            ) : null}
          </h4>
          <div className="flex flex-wrap gap-1 text-xs text-white mt-1">
            {rune.runes.map((r, i) => (
              <span
                key={i}
                className="bg-zinc-700 text-white px-2 py-1 rounded"
              >
                {r}
              </span>
            ))}
          </div>
          <ul className="text-sm mt-2 text-white">
            {Object.entries(rune.stats).map(([stat, value]) =>
              value ? (
                <li key={stat}>
                  {stat}: <span className="font-medium">{value}</span>
                </li>
              ) : null
            )}
          </ul>
          <button
            onClick={() => onAddRune(rune)}
            className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded"
          >
            ➕ Add
          </button>
        </div>
      ))}
    </div>
  );
}
