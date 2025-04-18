import React, { useState } from "react";
import statList from "../data/stat.json";

export default function StatTable({ runes = [], classes = [] }) {
  const [tab, setTab] = useState("total");

  const combineStats = () => {
    const total = {};
    for (const stat of statList) total[stat] = 0;

    [...runes, ...classes].forEach((entry) => {
      for (const stat in entry.stats) {
        if (total.hasOwnProperty(stat)) {
          total[stat] += parseFloat(entry.stats[stat]) || 0;
        }
      }
    });

    return total;
  };

  const totalStats = combineStats();

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setTab("total")}
          className={`text-sm px-2 py-1 rounded ${tab === "total" ? "bg-blue-700 text-white" : "bg-zinc-800 text-zinc-300"}`}
        >
          Total
        </button>
        <button
          onClick={() => setTab("matrix")}
          className={`text-sm px-2 py-1 rounded ${tab === "matrix" ? "bg-blue-700 text-white" : "bg-zinc-800 text-zinc-300"}`}
        >
          By Category
        </button>
      </div>

      {tab === "total" && (
        <table className="text-sm w-full text-left">
          <tbody>
            {Object.entries(totalStats).map(([key, value]) =>
              value !== 0 ? (
                <tr key={key}>
                  <td className="text-zinc-400">{key}</td>
                  <td className="text-white">{value}</td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      )}

      {tab === "matrix" && (
        <div className="overflow-x-auto">
          <table className="text-xs w-full border border-zinc-700 text-left">
            <thead>
              <tr className="bg-zinc-800">
                <th className="p-2">Stat</th>
                {[...runes.map(r => r.name), ...classes.map(c => c.class)].map((label, i) => (
                  <th key={i} className="p-2">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statList.map((stat) => (
                <tr key={stat}>
                  <td className="p-1 text-zinc-400">{stat}</td>
                  {[...runes, ...classes].map((entry, i) => (
                    <td key={i} className="p-1 text-white">
                      {entry.stats?.[stat] || 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
