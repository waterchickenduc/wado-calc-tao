import React from "react";

export default function BasicFilterBar({ filters, setFilters, statOptions }) {
  const addStat = (stat) => {
    if (!stat) return;
    setFilters([...filters, { type: "stat", value: stat }]);
  };

  const addOperator = (op) => {
    if (!op) return;
    setFilters([...filters, { type: "operator", value: op }]);
  };

  const removeAt = (index) => {
    const copy = [...filters];
    copy.splice(index, 1);
    setFilters(copy);
  };

  const updateStat = (index, newStat) => {
    const copy = [...filters];
    copy[index].value = newStat;
    setFilters(copy);
  };

  const updateOperator = (index, newOp) => {
    const copy = [...filters];
    copy[index].value = newOp;
    setFilters(copy);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {/* Render current filter sequence */}
      {filters.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {item.type === "stat" ? (
            <select
              value={item.value}
              onChange={(e) => updateStat(index, e.target.value)}
              className="bg-blue-700 text-white px-2 py-1 rounded"
            >
              {statOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={item.value}
              onChange={(e) => updateOperator(index, e.target.value)}
              className="bg-purple-700 text-white px-2 py-1 rounded"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
              <option value="(">(</option>
              <option value=")">)</option>
            </select>
          )}
          <button
            onClick={() => removeAt(index)}
            className="text-red-400 px-1 hover:text-red-500"
          >
            ✖
          </button>
        </div>
      ))}

      {/* Add buttons */}
      <select
        onChange={(e) => {
          addStat(e.target.value);
          e.target.selectedIndex = 0;
        }}
        className="bg-zinc-800 text-white px-2 py-1 rounded"
      >
        <option value="">➕ Add stat filter</option>
        {statOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => {
          addOperator(e.target.value);
          e.target.selectedIndex = 0;
        }}
        className="bg-zinc-800 text-white px-2 py-1 rounded"
      >
        <option value="">➕ Add operator</option>
        <option value="AND">AND</option>
        <option value="OR">OR</option>
        <option value="(">(</option>
        <option value=")">)</option>
      </select>
    </div>
  );
}
