import React from "react";

export default function SetupSelector({
  setups,
  activeIndex,
  onSelect,
  onNew,
  onRename,
  onDelete,
}) {
  const handleDoubleClick = (index) => {
    const newName = prompt("Rename setup:", setups[index].name);
    if (newName && newName.trim()) {
      onRename(index, newName.trim());
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Setup Tabs */}
      {setups.map((setup, index) => (
        <button
          key={setup.id}
          onClick={() => onSelect(index)}
          onDoubleClick={() => handleDoubleClick(index)}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            index === activeIndex
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white"
          }`}
        >
          <span>{setup.name}</span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
            className="text-red-400 hover:text-red-300 ml-1 cursor-pointer"
          >
            ✖
          </span>
        </button>
      ))}

      {/* ＋ New Setup */}
      <button
        onClick={onNew}
        className="px-4 py-2 rounded border border-dashed border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white transition-all text-sm"
      >
        ＋ New Setup
      </button>
    </div>
  );
}
