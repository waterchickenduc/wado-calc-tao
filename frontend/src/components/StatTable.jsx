import React, { useMemo, useState } from "react";
import statList from "../data/stat.json";

export default function StatTable({ runes = [], classes = [] }) {
  const [mode, setMode] = useState("total");

  const combined = useMemo(() => {
    const acc = {};
    statList.forEach((stat) => {
      acc[stat] = 0;
    });

    runes.forEach((rune) => {
      for (const [stat, value] of Object.entries(rune.stats)) {
        if (acc[stat] !== undefined) {
          acc[stat] += Number(value) || 0;
        }
      }
    });

    classes.forEach((cls) => {
      for (const [stat, value] of Object.entries(cls.stats || {})) {
        if (acc[stat] !== undefined) {
          acc[stat] += Number(value) || 0;
        }
      }
    });

    return acc;
  }, [runes, classes]);

  const categorized = useMemo(() => {
    const sources = [...runes, ...classes];
    const bySource = {};

    sources.forEach((item) => {
      if (!item.name && item.class) item.name = item.class;
      if (!item.name) return;

      const name = item.name;
      bySource[name] = bySource[name] || {};

      for (const [stat, value] of Object.entries(item.stats)) {
        bySource[name][stat] = (bySource[name][stat] || 0) + Number(value);
      }
    });

    return bySource;
  }, [runes, classes]);

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setMode("total")}
          className={`px-2 py-1 text-sm rounded ${
            mode === "total"
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-gray-300"
          }`}
        >
          Total
        </button>
        <button
          onClick={() => setMode("category")}
          className={`px-2 py-1 text-sm rounded ${
            mode === "category"
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-gray-300"
          }`}
        >
          By Category
        </button>
      </div>

      {mode === "total" ? (
        <ul className="text-sm text-white">
          {Object.entries(combined).map(([stat, value]) =>
            value ? (
              <li key={stat}>
                {stat}: <strong>{value}</strong>
              </li>
            ) : null
          )}
        </ul>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-white">
            <thead>
              <tr>
                <th className="text-left pr-4">Stat</th>
                {Object.keys(categorized).map((name) => (
                  <th key={name} className="px-2 text-left">
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statList.map((stat) => (
                <tr key={stat}>
                  <td className="text-left pr-4">{stat}</td>
                  {Object.keys(categorized).map((name) => (
                    <td key={name} className="px-2">
                      {categorized[name][stat] || 0}
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
