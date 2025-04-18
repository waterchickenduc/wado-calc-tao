import React from "react";
import RuneCard from "./RuneCard";

export default function SelectedRuneCard({ rune, count, onRemove }) {
  return (
    <div className="relative bg-night-900 border border-night-700 rounded-md p-4 text-white">
      {/* Title & Stack */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <h4 className="text-blue-400 font-semibold">{rune.name}</h4>
          {count > 1 && (
            <span className="bg-night-700 text-sm px-2 py-0.5 rounded-full">
              ×{count}
            </span>
          )}
        </div>
        <button
          onClick={() => onRemove(rune)}
          className="text-white hover:text-red-400"
          title="Remove one from stack"
        >
          ✕
        </button>
      </div>

      {/* Stones */}
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

      {/* Stats */}
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
