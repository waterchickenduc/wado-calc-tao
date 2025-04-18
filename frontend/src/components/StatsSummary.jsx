import React from "react";
import statOrder from "../lib/statOrder";

export default function StatsSummary({ runeStats, classStats }) {
  const allStats = [...new Set([...Object.keys(runeStats || {}), ...Object.keys(classStats || {})])];

  const displayStats = statOrder
    .filter((stat) => allStats.includes(stat))
    .map((stat) => ({
      name: stat,
      rune: runeStats?.[stat] || 0,
      class: classStats?.[stat] || 0,
    }))
    .filter(({ rune, class: cls }) => rune !== 0 || cls !== 0);

  return (
    <div className="bg-zinc-900 border border-zinc-700 p-4 rounded w-full md:max-w-xs">
      <h3 className="text-white font-semibold mb-4 text-lg">📊 Stats Summary</h3>
      <div className="grid grid-cols-4 text-sm gap-y-2 text-white/90">
        <span className="col-span-1 font-semibold">Stat</span>
        <span className="text-right font-semibold">Runes</span>
        <span className="text-right font-semibold">Classes</span>
        <span className="text-right font-semibold">Total</span>

        {displayStats.map(({ name, rune, class: cls }) => (
          <React.Fragment key={name}>
            <span className="truncate">{name}</span>
            <span className="text-right">{rune.toFixed(2)}%</span>
            <span className="text-right">{cls.toFixed(2)}%</span>
            <span className="text-right font-semibold">{(rune + cls).toFixed(2)}%</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
