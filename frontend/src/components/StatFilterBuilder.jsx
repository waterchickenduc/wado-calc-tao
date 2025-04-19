import React from "react";
import statList from "../data/stat.json";

export default function StatFilterBuilder({ filters, setFilters }) {
  const update = (newFilters) => setFilters([...newFilters]);

  const addAt = (index, item) => {
    const newFilters = [...filters];
    newFilters.splice(index, 0, item);
    update(newFilters);
  };

  const removeAt = (index) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    update(newFilters);
  };

  const updateStat = (index, stat) => {
    const newFilters = [...filters];
    newFilters[index].stat = stat;
    update(newFilters);
  };

  const updateLogic = (index, logic) => {
    const newFilters = [...filters];
    newFilters[index].logic = logic;
    update(newFilters);
  };

  const renderInsertControls = (index) => (
    <div key={`insert-${index}`} className="flex gap-1 items-center">
      <select
        onChange={(e) => {
          if (!e.target.value) return;
          addAt(index, { stat: e.target.value, logic: "AND" });
          e.target.selectedIndex = 0;
        }}
        className="bg-zinc-700 text-white text-sm px-2 py-1 rounded"
      >
        <option value="">➕ Add stat filter</option>
        {statList.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        onClick={() => addAt(index, { groupStart: true })}
        className="px-2 py-1 rounded bg-zinc-600 text-white text-sm"
        title="Add ( group"
      >
        (
      </button>
      <button
        onClick={() => addAt(index, { groupEnd: true })}
        className="px-2 py-1 rounded bg-zinc-600 text-white text-sm"
        title="Add ) group"
      >
        )
      </button>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Insertion point before all */}
      {renderInsertControls(0)}

      {filters.map((f, index) => {
        if (f.groupStart) {
          return (
            <div key={index} className="flex items-center gap-1">
              <span className="text-white px-2 py-1 border rounded bg-zinc-700">(</span>
              <button
                onClick={() => removeAt(index)}
                className="text-xs text-red-400"
              >
                ❌
              </button>
              {renderInsertControls(index + 1)}
            </div>
          );
        }

        if (f.groupEnd) {
          return (
            <div key={index} className="flex items-center gap-1">
              <span className="text-white px-2 py-1 border rounded bg-zinc-700">)</span>
              <button
                onClick={() => removeAt(index)}
                className="text-xs text-red-400"
              >
                ❌
              </button>
              {renderInsertControls(index + 1)}
            </div>
          );
        }

        return (
          <div key={index} className="flex items-center gap-1 bg-blue-700 text-white px-2 py-1 rounded">
            <select
              value={f.stat}
              onChange={(e) => updateStat(index, e.target.value)}
              className="bg-blue-700 text-white text-sm"
            >
              {statList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button onClick={() => removeAt(index)} className="ml-1 text-xs">
              ✕
            </button>

            {/* Logic selector only if not last AND not followed by groupEnd */}
            {index < filters.length - 1 && !filters[index + 1]?.groupEnd && (
              <select
                value={f.logic}
                onChange={(e) => updateLogic(index, e.target.value)}
                className="ml-2 bg-zinc-800 text-white text-xs rounded"
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            )}

            {/* Insert after this filter */}
            {renderInsertControls(index + 1)}
          </div>
        );
      })}
    </div>
  );
}
