import React from "react";

export default function SelectedRunes({ runes, onRemove }) {
  return (
    <div className="flex flex-wrap gap-2">
      {runes.map((rune, index) => (
        <div
          key={index}
          onClick={() => onRemove(index)}
          className="px-3 py-1 bg-blue-800 text-white text-sm rounded cursor-pointer hover:bg-red-500 transition"
          title="Click to remove"
        >
          {rune.name}
        </div>
      ))}
    </div>
  );
}
