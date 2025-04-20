import React from "react";

function formatValue(value) {
  return `${value.toFixed(2)}%`;
}

function StatBlock({ title, stats, color = "text-white", subTitle = null }) {
  const keys = Object.keys(stats);
  if (keys.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className={`font-bold ${color}`}>{title}</h4>
      {subTitle && <div className="text-yellow-500 text-xs mb-1">{subTitle}</div>}
      {keys.map((key) => (
        <div key={key} className="flex justify-between text-white">
          <span>{key}</span>
          <span>{formatValue(stats[key])}</span>
        </div>
      ))}
    </div>
  );
}

function groupStatsByAura(runes) {
  const grouped = {};
  for (const rune of runes) {
    if (!rune.aura || !rune.auraChance) continue;

    const auraKey = rune.aura;
    if (!grouped[auraKey]) {
      grouped[auraKey] = {
        triggerChance: 0,
        stats: {},
      };
    }

    grouped[auraKey].triggerChance += rune.auraChance;

    const auraStats = rune?.auraStats || [];
    for (const { Stat, Value } of auraStats) {
      grouped[auraKey].stats[Stat] = (grouped[auraKey].stats[Stat] || 0) + Value;
    }
  }

  return grouped;
}

export default function StatsSummary({ totalStats, runeStats, auraStats, classStats, runes = [] }) {
  const groupedAuraStats = groupStatsByAura(runes);

  return (
    <div className="bg-zinc-900 border border-zinc-700 p-4 rounded w-full md:max-w-xs text-sm">
      <h3 className="text-white font-semibold mb-4 text-lg">📊 Stats Summary</h3>

      <StatBlock title="Total" stats={totalStats} color="text-pink-400" />
      <StatBlock title="Total by Runes" stats={runeStats} color="text-green-400" />

      {/* 🌟 Per-Aura Breakdown */}
      {Object.keys(groupedAuraStats).length > 0 && (
        <>
          <h4 className="text-yellow-400 font-bold mt-4">Total by Auras</h4>
          {Object.entries(groupedAuraStats).map(([auraName, data]) => (
            <div key={auraName} className="mt-3">
              <div className="text-yellow-300 font-medium">{auraName}</div>
              <div className="text-yellow-500 text-xs mb-1">
                Trigger Chance: {formatValue(data.triggerChance)}
              </div>
              {Object.entries(data.stats).map(([stat, value]) => (
                <div key={stat} className="flex justify-between text-yellow-200">
                  <span>{stat}</span>
                  <span>{formatValue(value)}</span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      <StatBlock title="Total by Classes" stats={classStats} color="text-blue-400" />
    </div>
  );
}
