import React, { useMemo, useState } from "react";
import statList from "../data/stat.json";

export default function StatTable({ runes = [], classes = [] }) {
  const [tab, setTab] = useState("total");

  const totals = useMemo(() => {
    const sum = {};
    for (const stat of statList) sum[stat] = 0;

    runes.forEach((r) => {
      for (const [k, v] of Object.entries(r.stats || {})) {
        sum[k] = (sum[k] || 0) + v;
      }
    });
    return sum;
  }, [runes]);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          className={`px-3 py-1 rounded ${
            tab === "total" ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-300"
          }`}
          onClick={() => setTab("total")}
        >
          Total Stats
        </button>
        <button
          className={`px-3 py-1 rounded ${
            tab === "matrix" ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-300"
          }`}
          onClick={() => setTab("matrix")}
        >
          By Category
        </button>
      </div>

      {tab === "total" && (
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(totals)
              .filter(([_, val]) => val !== 0)
              .map(([key, val]) => (
                <tr key={key}>
                  <td className="text-zinc-400">{key}</td>
                  <td className="text-right text-white font-mono">{val.toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {tab === "matrix" && (
        <table className="w-full text-xs border-collapse mt-2 border border-zinc-700">
          <thead>
            <tr>
              <th className="border border-zinc-700 p-1 text-left">Stat</th>
              <th className="border border-zinc-700 p-1 text-center">Runes</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(totals).map(([key, val]) => (
              <tr key={key}>
                <td className="border border-zinc-700 p-1 text-zinc-300">{key}</td>
                <td className="border border-zinc-700 p-1 text-right font-mono">
                  {val.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
