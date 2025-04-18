import React from "react";

export default function SelectedItemCard({ name, tags = [], stats = [], count = 1, onRemove, onAdd }) {
  const meaningfulStats = stats.filter(
    (entry) => (entry.Value ?? entry.value ?? 0) !== 0
  );

  return (
    <div className="w-full bg-wado-dark text-white border border-wado-border rounded-md p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-lg mb-1">
            {name} <span className="text-sm">×{count}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs mb-2">
            {tags.map((t, i) => (
              <span key={i} className="bg-wado-surface px-2 py-1 rounded-full text-white">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {onRemove && (
            <button
              onClick={onRemove}
              className="bg-red-600 text-white rounded-full px-2 text-sm hover:bg-red-500"
              title="Remove"
            >
              ✕
            </button>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              className="bg-blue-600 text-white rounded-full px-2 text-sm hover:bg-blue-500"
              title="Add again"
            >
              +
            </button>
          )}
        </div>
      </div>

      {meaningfulStats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mt-2">
          {meaningfulStats.map((entry, idx) => {
            const label = entry.Stat || entry.stat;
            const value = entry.Value ?? entry.value;
            return (
              <div key={idx} className="flex justify-between text-gray-300">
                <span>{label}</span>
                <span className="text-white font-medium">
                  {typeof value === "number" ? `${value}%` : value}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
