import React from "react";

function StatBlock({ title, stats, color }) {
  if (!stats || Object.keys(stats).length === 0) return null;

  return (
    <>
      <h4 className={`font-bold mt-4 ${color}`}>{title}</h4>
      {Object.entries(stats).map(([key, val]) => (
        <div key={key} className="flex justify-between text-white">
          <span>{key}</span>
          <span>{val.toFixed(2)}%</span>
        </div>
      ))}
    </>
  );
}

export default function StatsSummary({
  totalStats,
  runeStats,
  auraStats,
  classStats,
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 p-4 rounded w-full md:max-w-xs text-sm">
      <h3 className="text-white font-semibold mb-4 text-lg">📊 Stats Summary</h3>

      <StatBlock title="Total" stats={totalStats} color="text-pink-400" />
      <StatBlock title="Total by Runes" stats={runeStats} color="text-green-400" />
      <StatBlock title="Total by Auras" stats={auraStats} color="text-yellow-400" />
      <StatBlock title="Total by Classes" stats={classStats} color="text-blue-400" />
    </div>
  );
}
