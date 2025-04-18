import React from "react";
import Button from "./ui/Button";

export default function SelectedRunes({ runes, onRemove, onClear }) {
  const grouped = runes.reduce((acc, rune) => {
    const name = rune.name;
    acc[name] = acc[name] ? { ...acc[name], count: acc[name].count + 1 } : { rune, count: 1 };
    return acc;
  }, {});

  return (
    <div className="bg-zinc-900 p-4 rounded-md border border-zinc-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-blue-400 font-bold flex items-center gap-2">
          🧱 Selected Runes
        </h3>
        {runes.length > 0 && (
          <Button variant="ghost" className="text-red-400 text-sm px-2" onClick={onClear}>
            🧹 Clear All
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(grouped).map(([name, { count }]) => (
          <button
            key={name}
            onClick={() => onRemove(name)}
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition-all"
          >
            {name} ×{count}
          </button>
        ))}
      </div>
    </div>
  );
}
