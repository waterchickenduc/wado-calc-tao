import React from "react";
import statOrder from "../lib/statOrder";

const isValid = (val) =>
  typeof val === "number" && !isNaN(val) && isFinite(val);

export default function StatsSummary({
  runeStats = {},
  classStats = {},
  auraStats = {},
  activeAuras = [],
}) {
  const allStatKeys = [
    ...new Set([
      ...Object.keys(runeStats || {}),
      ...Object.keys(classStats || {}),
      ...Object.keys(auraStats || {}),
    ]),
  ];

  const displayStats = statOrder
    .filter((stat) => allStatKeys.includes(stat))
    .map((stat) => {
      const rune = isValid(Number(runeStats[stat])) ? Number(runeStats[stat]) : 0;
      const cls = isValid(Number(classStats[stat])) ? Number(classStats[stat]) : 0;
      const aura = isValid(Number(auraStats[stat])) ? Number(auraStats[stat]) : 0;
      return {
        stat,
        rune,
        cls,
        aura,
        total: rune + cls + aura,
      };
    })
    .filter((row) => row.total !== 0);

  return (
    <div className="bg-zinc-900 border border-zinc-700 p-4 rounded w-full md:max-w-xs">
      <h3 className="text-white font-semibold mb-4 text-lg">📊 Stats Summary</h3>

      <div className="grid grid-cols-5 gap-y-1 text-sm text-white/90 mb-2">
        <span className="font-semibold col-span-1">Stat</span>
        <span className="text-right font-semibold">Runes</span>
        <span className="text-right font-semibold">Classes</span>
        <span className="text-right font-semibold">Auras</span>
        <span className="text-right font-semibold">Total</span>

        {displayStats.map(({ stat, rune, cls, aura, total }) => (
          <React.Fragment key={stat}>
            <span className="truncate">{stat}</span>
            <span className="text-right">{rune.toFixed(2)}%</span>
            <span className="text-right">{cls.toFixed(2)}%</span>
            <span className="text-right">{aura.toFixed(2)}%</span>
            <span className="text-right font-semibold">{total.toFixed(2)}%</span>
          </React.Fragment>
        ))}
      </div>

      {/* Aura breakdown */}
      {Array.isArray(activeAuras) && activeAuras.length > 0 && (
        <div className="mt-4 border-t border-zinc-700 pt-3 space-y-3">
          <h4 className="text-purple-300 font-semibold text-sm">✨ Active Auras</h4>

          {activeAuras.map((aura, i) => {
            if (
              !aura ||
              typeof aura !== "object" ||
              !aura.stats ||
              typeof aura.stats !== "object"
            )
              return null;

            const entries = Object.entries(aura.stats)
              .filter(([_, val]) => isValid(Number(val)) && Number(val) !== 0);

            if (entries.length === 0) return null;

            return (
              <div key={i} className="text-sm text-white/90">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-purple-400 font-medium">{aura.name}</span>
                  <span className="text-purple-200 text-sm">
                    {isValid(Number(aura.chance)) ? `${Number(aura.chance)}% chance` : ""}
                  </span>
                </div>
                <ul className="grid grid-cols-2 gap-x-4 text-xs text-white/70">
                  {entries.map(([stat, val]) => (
                    <li key={stat}>
                      {stat}:{" "}
                      <span className="font-semibold">
                        {Number(val).toFixed(2)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
