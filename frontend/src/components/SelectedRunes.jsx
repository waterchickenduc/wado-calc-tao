import React from "react";

export default function SelectedRunes({ runes, onRemove }) {
  const runeCounts = runes.reduce((acc, rune) => {
    acc[rune.name] = (acc[rune.name] || 0) + 1;
    return acc;
  }, {});

  const uniqueRunes = [...new Set(runes.map((rune) => rune.name))];

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {uniqueRunes.map((runeName, i) => {
        const idx = runes.findIndex((r) => r.name === runeName);
        return (
          <button
            key={`${runeName}-${i}`}
            onClick={() => onRemove(idx)}
            className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded"
          >
            {runeName} ×{runeCounts[runeName]}
          </button>
        );
      })}
    </div>
  );
}
