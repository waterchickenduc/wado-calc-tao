import React from "react";
import data from "../data/adventureClasses.json";

export default function ClassSelector({ setup, updateSetup }) {
  const selected = setup.classes || [];

  const toggleClass = (cls) => {
    const isSelected = selected.find((c) => c.class === cls.class);
    const updated = isSelected
      ? selected.filter((c) => c.class !== cls.class)
      : [...selected, cls];
    updateSetup({ classes: updated });
  };

  const handleSelectAll = () => {
    const all = [];
    for (const group of Object.values(data)) {
      for (const path of group.paths) {
        all.push(...path.path);
      }
    }
    updateSetup({ classes: all });
  };

  const handleReset = () => updateSetup({ classes: [] });

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={handleSelectAll} className="px-3 py-1 rounded bg-green-600 text-white">
          Select All
        </button>
        <button onClick={handleReset} className="px-3 py-1 rounded bg-red-600 text-white">
          Clear
        </button>
      </div>
      {Object.entries(data).map(([base, { paths }]) => (
        <div key={base}>
          <h4 className="font-semibold text-pink-300">{base}</h4>
          {paths.map((branch, i) => (
            <div key={i}>
              {branch.path.map((cls) => {
                const isSelected = selected.find((c) => c.class === cls.class);
                return (
                  <button
                    key={cls.class}
                    onClick={() => toggleClass(cls)}
                    className={`block w-full text-left px-3 py-1 mb-1 rounded ${
                      isSelected ? "bg-blue-700 text-white" : "bg-zinc-800 text-white"
                    }`}
                  >
                    {cls.class}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
