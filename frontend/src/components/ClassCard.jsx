import React from "react";

export default function ClassCard({ cls, isSelected, onToggle }) {
  const stats = cls.stats || {};
  const meaningfulStats = Object.entries(stats).filter(
    ([_, val]) => val !== 0 && val !== "0"
  );

  return (
    <button
      onClick={onToggle}
      className={`w-full text-left p-4 rounded-md border transition-all shadow-sm
        ${isSelected
          ? "bg-wado-accent border-wado-accent text-white"
          : "bg-wado-dark border-wado-border text-white hover:border-blue-500"
        }`}
    >
      <div className="font-semibold text-lg mb-2">{cls.class}</div>

      {meaningfulStats.length > 0 && (
        <div className="text-sm text-white grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4">
          {meaningfulStats.map(([stat, value], i) => (
            <div key={i} className="flex justify-between text-gray-300">
              <span title={stat}>{stat}</span>
              <span className="text-white font-medium">
                {typeof value === "number" ? `${value}%` : value}
              </span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
