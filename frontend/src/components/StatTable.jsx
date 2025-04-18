import React, { useState } from "react";

export default function StatTable({ setup }) {
  const [activeTab, setActiveTab] = useState("total");

  const totalStats = {};
  const categorizedStats = {};

  setup.runes.forEach((rune) => {
    const count = rune._count || 1;

    for (const [stat, value] of Object.entries(rune.stats)) {
      const num = parseFloat(value) * count;

      // Total
      totalStats[stat] = (totalStats[stat] || 0) + num;

      // Categorized by rune
      if (!categorizedStats[rune.name]) {
        categorizedStats[rune.name] = {};
      }
      categorizedStats[rune.name][stat] =
        (categorizedStats[rune.name][stat] || 0) + num;
    }
  });

  const formatValue = (val) =>
    typeof val === "number" ? val.toFixed(2).replace(/\.00$/, "") : val;

  return (
    <div className="bg-zinc-950 rounded-md border border-zinc-700 p-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-blue-400 font-bold text-lg">🔢 Passive Stats</h3>
        <div className="space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              activeTab === "total" ? "bg-blue-600 text-white" : "bg-zinc-800"
            }`}
            onClick={() => setActiveTab("total")}
          >
            Total Stats
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              activeTab === "category" ? "bg-blue-600 text-white" : "bg-zinc-800"
            }`}
            onClick={() => setActiveTab("category")}
          >
            By Rune
          </button>
        </div>
      </div>

      {setup.runes.length === 0 ? (
        <p className="text-zinc-500 text-sm italic">No data to display.</p>
      ) : activeTab === "total" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white">
          {Object.entries(totalStats).map(([stat, val]) => (
            <div key={stat}>
              {stat}: <strong>{formatValue(val)}</strong>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(categorizedStats).map(([runeName, stats]) => (
            <div key={runeName}>
              <div className="font-bold text-blue-300 mb-1">{runeName}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white pl-2">
                {Object.entries(stats).map(([stat, val]) => (
                  <div key={`${runeName}-${stat}`}>
                    {stat}: <strong>{formatValue(val)}</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
