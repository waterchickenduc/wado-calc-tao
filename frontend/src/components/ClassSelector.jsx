import React from "react";
import data from "../data/adventureClasses.json";
import ClassCard from "./ClassCard";

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
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={handleSelectAll} className="px-4 py-1 rounded bg-green-600 text-white text-sm">
          Select All
        </button>
        <button onClick={handleReset} className="px-4 py-1 rounded bg-red-600 text-white text-sm">
          Clear
        </button>
      </div>

      {Object.entries(data).map(([base, { paths }]) => (
        <div key={base} className="mt-6">
          <h4 className="font-semibold text-blue-400 mb-2">{base}</h4>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {paths.flatMap((branch) =>
              branch.path.map((cls) => (
                <ClassCard
                  key={cls.class}
                  cls={cls}
                  isSelected={!!selected.find((c) => c.class === cls.class)}
                  onToggle={() => toggleClass(cls)}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
