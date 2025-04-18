import React, { useState, useEffect } from "react";
import runeData from "../data/runes.json";
import classData from "../data/adventureClasses.json";
import statList from "../data/stats.json";
import { cn } from "../lib/utils";

const SetupBuilder = ({ setup, updateSetup, resetSetup, setName }) => {
  const [activeTab, setActiveTab] = useState("Runes");
  const [searchTerm, setSearchTerm] = useState("");
  const [statFilter, setStatFilter] = useState("");

  const allRunes = runeData || [];
  const allStats = statList || [];
  const selectedRunes = setup.runes || [];
  const selectedClasses = setup.classes || [];

  const handleRuneClick = (runeName) => {
    if (selectedRunes.length >= 6) return;
    updateSetup({ runes: [...selectedRunes, runeName] });
  };

  const removeRune = (runeName) => {
    const index = selectedRunes.indexOf(runeName);
    if (index !== -1) {
      const updated = [...selectedRunes];
      updated.splice(index, 1);
      updateSetup({ runes: updated });
    }
  };

  const handleClassClick = (clsName) => {
    if (selectedClasses.includes(clsName)) return;
    updateSetup({ classes: [...selectedClasses, clsName] });
  };

  const removeClass = (clsName) => {
    updateSetup({ classes: selectedClasses.filter((c) => c !== clsName) });
  };

  const getFilteredRunes = () => {
    let filtered = allRunes;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(term) ||
        r.runes.some((stone) => (stone || "").toLowerCase().includes(term))
      );
    }
    if (statFilter) {
      filtered = filtered.filter((r) => r.stats[statFilter] > 0);
    }
    return filtered;
  };

  const calculateStats = () => {
    const result = {};
    [...selectedRunes, ...selectedClasses].forEach((name) => {
      const rune = allRunes.find((r) => r.name === name);
      const cls = Object.values(classData).flatMap((b) => b.paths).flatMap((p) => p.path).find((c) => c.class === name);
      const source = rune || cls;

      if (source?.stats) {
        for (const [k, v] of Object.entries(source.stats)) {
          result[k] = (result[k] || 0) + v;
        }
      }
    });
    return result;
  };

  const totalStats = calculateStats();

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Side: Builder */}
      <div className="w-full md:w-3/4">
        <h2 className="text-xl font-semibold mb-2">WadoCalc Tao</h2>
        <div className="flex items-center gap-3 mb-2">
          <input
            className="bg-zinc-800 px-2 py-1 rounded text-white"
            value={setup.name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={resetSetup}>
            Reset
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            className={cn("px-4 py-2 rounded", activeTab === "Runes" ? "bg-blue-600 text-white" : "bg-zinc-700")}
            onClick={() => setActiveTab("Runes")}
          >
            Runes
          </button>
          <button
            className={cn("px-4 py-2 rounded", activeTab === "Classes" ? "bg-blue-600 text-white" : "bg-zinc-700")}
            onClick={() => setActiveTab("Classes")}
          >
            Classes
          </button>
        </div>

        {/* Runes / Classes tab */}
        {activeTab === "Runes" ? (
          <>
            <div className="mb-2 text-sm">
              Selected Runes ({selectedRunes.length}/6) — <span className="text-blue-400">Click to remove</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedRunes.map((r, idx) => (
                <button key={`${r}-${idx}`} onClick={() => removeRune(r)} className="bg-blue-500 px-2 py-1 rounded">
                  {r}
                </button>
              ))}
            </div>

            <input
              className="bg-zinc-800 px-3 py-1 rounded w-full mb-3"
              placeholder="Search runes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="bg-zinc-800 px-3 py-1 rounded w-full mb-4"
              value={statFilter}
              onChange={(e) => setStatFilter(e.target.value)}
            >
              <option value="">Filter by stat</option>
              {Object.keys(allRunes[0]?.stats || {}).sort().map((stat) => (
                <option key={stat} value={stat}>
                  {stat}
                </option>
              ))}
            </select>

            <div className="grid md:grid-cols-2 gap-3">
              {getFilteredRunes().map((rune) => (
                <div key={rune.name} className="bg-zinc-800 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">{rune.name}</div>
                    <button onClick={() => handleRuneClick(rune.name)} className="text-sm bg-blue-600 px-2 py-1 rounded">
                      +
                    </button>
                  </div>
                  <div className="text-sm text-gray-300">{rune.runes.join(", ")}</div>
                  <ul className="text-xs mt-1">
                    {Object.entries(rune.stats)
                      .filter(([, v]) => v !== 0)
                      .map(([k, v]) => (
                        <li key={k}>
                          {k}: {v}%
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-2 text-sm">
              Selected Classes ({selectedClasses.length}) — <span className="text-blue-400">Click to remove</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedClasses.map((c) => (
                <button key={c} onClick={() => removeClass(c)} className="bg-purple-600 px-2 py-1 rounded">
                  {c}
                </button>
              ))}
            </div>

            {Object.entries(classData).map(([base, { paths }]) => (
              <div key={base} className="mb-4">
                <h3 className="font-bold text-lg">{base}</h3>
                {paths.map((branch, i) => (
                  <div key={i} className="flex flex-wrap gap-2 my-1">
                    {branch.path.map((cls) => (
                      <button
                        key={cls.class}
                        onClick={() => handleClassClick(cls.class)}
                        disabled={selectedClasses.includes(cls.class)}
                        className={cn(
                          "px-2 py-1 rounded",
                          selectedClasses.includes(cls.class)
                            ? "bg-zinc-700 text-gray-500"
                            : "bg-purple-600 text-white"
                        )}
                      >
                        {cls.class}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Right Side: Total Stats */}
      <div className="w-full md:w-1/4 bg-zinc-800 rounded p-4 h-fit sticky top-4">
        <h2 className="text-lg font-bold mb-2">📊 Total Passive Stats</h2>
        <table className="text-sm w-full">
          <tbody>
            {Object.entries(totalStats)
              .sort()
              .map(([k, v]) => (
                <tr key={k} className="border-b border-zinc-700">
                  <td className="pr-2">{k}</td>
                  <td className="text-right">{v.toFixed(2)}%</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SetupBuilder;
