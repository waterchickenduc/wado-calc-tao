import React from "react";
import statOrder from "../lib/statOrder";

export default function StatsSummary({ stats = {}, classStats = {} }) {
  const displayStats = statOrder
    .map((stat) => ({
      name: stat,
      fromRunes: stats[stat] ?? 0,
      fromClasses: classStats[stat] ?? 0,
    }))
    .filter(({ fromRunes, fromClasses }) => fromRunes !== 0 || fromClasses !== 0);

  if (displayStats.length === 0) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-700 p-4 rounded w-full md:max-w-xs">
      <h3 className="text-white font-semibold mb-4 text-lg">📊 Stats Summary</h3>
      <div className="grid grid-cols-4 text-sm gap-y-2">
        <span className="col-span-1 font-semibold text-white/70">Stat</span>
        <span className="text-right font-semibold text-white/70">Runes</span>
        <span className="text-right font-semibold text-white/70">Classes</span>
        <span className="text-right font-semibold text-white/70">Total</span>

        {displayStats.map(({ name, fromRunes, fromClasses }) => (
          <React.Fragment key={name}>
            <span className="truncate text-white/80">{name}</span>
            <span className="text-right text-blue-300">{fromRunes.toFixed(2)}%</span>
            <span className="text-right text-green-300">{fromClasses.toFixed(2)}%</span>
            <span className="text-right text-white font-bold">
              {(fromRunes + fromClasses).toFixed(2)}%
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
