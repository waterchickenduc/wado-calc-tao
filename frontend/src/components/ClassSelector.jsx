import React, { useMemo } from "react";
import classData from "../data/adventureClasses.json";
import StatsSummary from "./StatsSummary";

export default function ClassSelector({ setup, updateSetup }) {
  const selectedClasses = setup.classes || [];

  const allClasses = useMemo(() => {
    const root = classData["Adventurer"];
    if (!root || !Array.isArray(root.paths)) return [];

    return root.paths.flatMap(branch =>
      branch.path.map(cls => ({
        name: cls.class,
        stats: cls.stats,
      }))
    );
  }, []);

  const handleToggleClass = (className) => {
    const updated = selectedClasses.includes(className)
      ? selectedClasses.filter((c) => c !== className)
      : [...selectedClasses, className];

    updateSetup({ classes: updated });
  };

  const handleAddAll = () => {
    const all = allClasses.map((cls) => cls.name);
    updateSetup({ classes: all });
  };

  const handleClearAll = () => {
    updateSetup({ classes: [] });
  };

  const stats = {
    totalStats: {},
    classStats: {},
    auraStats: {},
    runeStats: {},
    runes: [],
  };

  const selectedClassObjects = allClasses.filter(cls => selectedClasses.includes(cls.name));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1fr] gap-6 items-start">
      {/* Column 1: All Classes */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-blue-300">
            All Classes
          </h2>
          <button
            onClick={handleAddAll}
            className="text-sm text-blue-400 border border-blue-400 px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition-all"
          >
            + Add all classes
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {allClasses.map((cls) => (
            <div
              key={cls.name}
              onClick={() => handleToggleClass(cls.name)}
              className={`cursor-pointer px-4 py-2 rounded bg-zinc-800 hover:bg-blue-800 transition-all ${
                selectedClasses.includes(cls.name) ? "bg-blue-700" : ""
              }`}
            >
              <div className="font-medium">{cls.name}</div>
              <div className="text-xs text-white/60 grid grid-cols-2 gap-x-4 mt-1">
                {Object.entries(cls.stats)
                  .filter(([_, val]) => val !== 0)
                  .map(([key, val], idx) => (
                    <div key={idx}>
                      {key}: <span className="font-semibold">{val}%</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Selected Class Cards */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-blue-300">
            Selected Classes ({selectedClasses.length})
          </h2>
          {selectedClasses.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-400 border border-red-500 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition-all"
            >
              ✖ Clear all classes
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
          {selectedClassObjects.map((cls) => (
            <div //hier
              key={cls.name}
              className="relative border border-zinc-700 p-4 rounded-md bg-zinc-800 shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-blue-400 text-lg">{cls.name}</h3>
                <button
                  onClick={() => handleToggleClass(cls.name)}
                  className="text-zinc-500 hover:text-red-500 text-lg"
                  title="Remove class"
                >
                  ×
                </button>
              </div>
              <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1 text-white/90">
                {Object.entries(cls.stats)
                  .filter(([_, val]) => val !== 0)
                  .map(([key, val], idx) => (
                    <div key={idx}>
                      {key}: <span className="font-semibold">{val}%</span>
                    </div>
                  ))}
              </div>
            </div> //hier
          ))}
        </div>
      </div>

      {/* Column 3: Stats Summary */}
      <div className="w-full">
        <StatsSummary
          totalStats={stats.totalStats}
          runeStats={stats.runeStats}
          auraStats={stats.auraStats}
          classStats={stats.classStats}
          runes={stats.runes}
        />
      </div>
    </div>
  );
}
