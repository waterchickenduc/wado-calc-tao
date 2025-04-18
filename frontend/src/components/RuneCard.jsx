import React from "react";

export default function RuneCard({ rune, onAdd }) {
  return (
    <div className="relative bg-night-800 border border-night-600 rounded-md p-4 text-white">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-blue-400 font-semibold">{rune.name}</h4>
        {onAdd && (
          <button
            onClick={() => onAdd(rune)}
            className="text-white bg-blue-600 hover:bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-sm"
            title="Add Rune"
          >
            +
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {rune.runes.map((r, i) => (
          <span
            key={i}
            className="bg-night-700 text-white text-sm px-2 py-0.5 rounded"
          >
            {r}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
        {rune.stats.slice(0, 10).map(({ Stat, Value }, i) => (
          <div key={i} className="flex justify-between whitespace-nowrap">
            <span className="text-gray-300">{Stat}:</span>
            <span className="text-white font-medium">
              {Stat.includes("HP") || Stat.includes("Recovery")
                ? `${parseFloat(Value).toFixed(1)}%`
                : `${parseFloat(Value)}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
