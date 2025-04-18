import React from "react";
import classData from "../data/adventureClasses.json";

export default function ClassSelector({ setup, updateSetup }) {
  const toggleClass = (cls) => {
    const isSelected = setup.classes.includes(cls);
    const updated = isSelected
      ? setup.classes.filter((c) => c !== cls)
      : [...setup.classes, cls];
    updateSetup({ classes: updated });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(classData).map(([base, obj]) => (
        <div key={base}>
          <h4 className="text-blue-400 font-semibold mb-1">{base}</h4>
          {obj.paths.map((branch) =>
            branch.path.map((cls) => {
              const isSelected = setup.classes.includes(cls.class);
              return (
                <div
                  key={cls.class}
                  onClick={() => toggleClass(cls.class)}
                  className={`cursor-pointer px-3 py-1 mb-1 rounded-md text-sm border 
                    ${isSelected ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}
                  `}
                >
                  {cls.class}
                </div>
              );
            })
          )}
        </div>
      ))}
    </div>
  );
}
