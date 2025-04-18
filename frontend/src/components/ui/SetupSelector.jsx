// frontend/components/ui/SetupSelector.jsx
import React, { useState } from "react";

export default function SetupSelector({
  setups = [],
  activeIndex = 0,
  onSelect = () => {},
  onNew = () => {},
  onRename = () => {},
  onDelete = () => {},
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempName, setTempName] = useState("");

  const startEditing = (index, currentName) => {
    setEditingIndex(index);
    setTempName(currentName);
  };

  const confirmRename = (index) => {
    if (tempName.trim() !== "") {
      onRename(index, tempName.trim());
    }
    setEditingIndex(null);
  };

  return (
    <div className="flex items-center flex-wrap gap-2">
      {setups.map((setup, i) => {
        const isActive = i === activeIndex;
        const isEditing = i === editingIndex;

        return (
          <div
            key={setup.id}
            className={`flex items-center text-sm rounded px-3 py-1 cursor-pointer transition-all ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            {isEditing ? (
              <input
                type="text"
                value={tempName}
                autoFocus
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => confirmRename(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmRename(i);
                  if (e.key === "Escape") setEditingIndex(null);
                }}
                className="bg-transparent text-white border-none outline-none w-24"
              />
            ) : (
              <button
                onClick={() => onSelect(i)}
                onDoubleClick={() => startEditing(i, setup.name)}
                className="mr-1"
                title="Double-click to rename"
              >
                {setup.name || `Setup ${i + 1}`}
              </button>
            )}

            <button
              onClick={() => onDelete(i)}
              title="Delete setup"
              className="text-white hover:text-red-300 ml-1 text-sm"
            >
              ×
            </button>
          </div>
        );
      })}

      <button
        onClick={onNew}
        className="px-4 py-1 text-sm rounded border border-dashed border-zinc-600 text-white hover:border-blue-400"
      >
        ➕ New Setup
      </button>
    </div>
  );
}
