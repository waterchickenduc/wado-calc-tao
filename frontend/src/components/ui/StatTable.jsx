import React, { useState } from "react";
import { cn } from "../../lib/utils";
import Button from "./Button";

export default function StatMatrix({ setups = [] }) {
  const [visibleIndexes, setVisibleIndexes] = useState(
    setups.map((_, i) => i) // All setups visible by default
  );

  const toggleColumn = (index) => {
    setVisibleIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index].sort()
    );
  };

  if (!setups.length) return null;

  const allStats = Array.from(
    new Set(setups.flatMap((s) => Object.keys(s.stats || {})))
  ).sort();

  const getDeltaClass = (stat, colIndex) => {
    const ref = setups[0]?.stats?.[stat] ?? 0;
    const current = setups[colIndex]?.stats?.[stat] ?? 0;
    if (colIndex === 0) return "";
    if (current > ref) return "text-green-400";
    if (current < ref) return "text-red-400";
    return "";
  };

  return (
    <div className="space-y-4">
      {/* Toggle Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {setups.map((s, i) => (
          <Button
            key={i}
            variant={visibleIndexes.includes(i) ? "default" : "outline"}
            onClick={() => toggleColumn(i)}
          >
            {s.name || `Setup ${i + 1}`}
          </Button>
        ))}
        {visibleIndexes.length !== setups.length && (
          <Button
            variant="ghost"
            className="text-sm underline text-zinc-400"
            onClick={() => setVisibleIndexes(setups.map((_, i) => i))}
          >
            Show All
          </Button>
        )}
      </div>

      {/* Stat Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-700 text-left">
              <th className="py-1 pr-2 text-zinc-400">Stat</th>
              {visibleIndexes.map((i) => (
                <th key={i} className="py-1 px-2 text-zinc-300">
                  {setups[i].name || `Setup ${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allStats.map((stat) => (
              <tr key={stat} className="border-b border-zinc-800">
                <td className="py-1 pr-2 capitalize text-zinc-400">{stat}</td>
                {visibleIndexes.map((i) => (
                  <td
                    key={i}
                    className={cn(
                      "py-1 px-2 text-right",
                      getDeltaClass(stat, i)
                    )}
                  >
                    {(setups[i].stats?.[stat] ?? 0).toFixed(2)}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
