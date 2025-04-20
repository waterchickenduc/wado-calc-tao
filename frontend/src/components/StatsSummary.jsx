import React from "react";
import statOrder from "../lib/statOrder";

export default function StatsSummary({ runeStats = {}, classStats = {}, runes = [] }) {
  const merged = {};
  const fromRunes = {};
  const fromClasses = {};
  const auraStats = {};
  const auraChanceMap = {};

  // Aggregate stats and aura data
  runes.forEach((rune) => {
    (rune.stats || []).forEach(({ Stat, Value }) => {
      merged[Stat] = (merged[Stat] || 0) + Value;
      fromRunes[Stat] = (fromRunes[Stat] || 0) + Value;
    });

    if (rune.aura && rune.auraChance) {
      auraChanceMap[rune.aura] = (auraChanceMap[rune.aura] || 0) + rune.auraChance;

      // If the aura has its own stats, include those as aura-related stats
      (rune.auraStats || []).forEach(({ Stat, Value }) => {
        auraStats[Stat] = (auraStats[Stat] || 0) + Value;
      });
    }
  });

  Object.entries(classStats).forEach(([Stat, Value]) => {
    merged[Stat] = (merged[Stat] || 0) + Value;
    fromClasses[Stat] = (fromClasses[Stat] || 0) + Value;
  });

  const getDisplayList = (source) => {
    return statOrder
      .filter((key) => source[key] > 0)
      .map((key) => ({ stat: key, value: source[key] }));
  };

  const total = getDisplayList(merged);
  const byRunes = getDisplayList(fromRunes);
  const byClasses = getDisplayList(fromClasses);
  const byAuras = getDisplayList(auraStats);

  return (
    <div className="bg-zinc-900 border border-zinc-700 p-4 rounded w-full md:max-w-xs text-sm">
      <h3 className="text-white font-semibold mb-3 text-lg">📊 Stats Summary</h3>

      {/* Total */}
      {total.length > 0 && (
        <div className="mb-4">
          <h4 className="text-pink-500 font-semibold mb-1">Total</h4>
          {total.map(({ stat, value }) => (
            <div key={stat} className="text-white/90">
              {stat} {value.toFixed(2)}%
            </div>
          ))}
        </div>
      )}

      {/* Total by Auras */}
      {Object.keys(auraStats).length > 0 && (
        <div className="mb-4">
          <h4 className="text-blue-400 font-semibold mb-1">Total by Auras</h4>
          {Object.entries(auraChanceMap).map(([aura, chance]) => (
            <div key={aura} className="text-white/80 italic mb-1">
              {chance.toFixed(1)}% chance to trigger <strong>{aura}</strong>
            </div>
          ))}
          {Object.entries(auraStats).map(([stat, value]) => (
            <div key={stat} className="text-white/90">
              {stat} {value.toFixed(2)}%
            </div>
          ))}
        </div>
      )}

      {/* Total by Runes */}
      {byRunes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-green-400 font-semibold mb-1">Total by Runes</h4>
          {byRunes.map(({ stat, value }) => (
            <div key={stat} className="text-white/90">
              {stat} {value.toFixed(2)}%
            </div>
          ))}
        </div>
      )}

      {/* Total by Classes */}
      {byClasses.length > 0 && (
        <div>
          <h4 className="text-yellow-400 font-semibold mb-1">Total by Classes</h4>
          {byClasses.map(({ stat, value }) => (
            <div key={stat} className="text-white/90">
              {stat} {value.toFixed(2)}%
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
