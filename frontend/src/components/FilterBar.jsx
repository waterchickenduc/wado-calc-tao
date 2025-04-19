import React from "react";

export default function FilterBar({ filters, onAddFilter, onRemoveFilter, statList }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((stat, index) => (
          <div key={index} className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700 text-white text-sm">
            {stat}
            <button onClick={() => onRemoveFilter(stat)} className="hover:text-red-300 text-white text-sm">×</button>
          </div>
        ))}

        <select
          onChange={(e) => {
            if (e.target.value) {
              onAddFilter(e.target.value);
              e.target.selectedIndex = 0;
            }
          }}
          className="bg-zinc-800 text-white px-2 py-1 rounded"
        >
          <option value="">➕ Add Stat Filter</option>
          {statList
            .filter((s) => !filters.includes(s))
            .map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
        </select>
      </div>

      {filters.length > 0 && (
        <div className="text-sm text-white/70 pt-2">
          <strong>Filtering:</strong> {filters.join(" AND ")}
        </div>
      )}
    </div>
  );
}
