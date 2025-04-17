import React, { useState, useEffect } from "react";
import runeData from "../data/runes.json";
import classData from "../data/adventureClasses.json";
import statList from "../data/stats.json";
import { cn } from "../lib/utils";

const SetupBuilder = ({ setup, updateSetup, resetSetup, setName }) => {
  const [activeTab, setActiveTab] = useState("Runes");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStat, setSelectedStat] = useState("");

  const toggleRune = (rune) => {
    const existing = setup.runes.find((r) => r.name === rune.name);
    if (existing) {
      const updatedRunes = setup.runes.filter((r) => r.name !== rune.name);
      updateSetup({ runes: updatedRunes });
    } else if (setup.runes.length < 6) {
      updateSetup({ runes: [...setup.runes, rune] });
    }
  };

  const toggleClass = (cls) => {
    const exists = setup.classes.includes(cls);
    if (exists) {
      updateSetup({
        classes: setup.classes.filter((c) => c !== cls),
      });
    } else if (setup.classes.length < 4) {
      updateSetup({
        classes: [...setup.classes, cls],
      });
    }
  };

  const getFilteredRunes = () => {
    return runeData.filter((rune) => {
      if (selectedStat && selectedStat !== "All") {
        const statKey = selectedStat.toLowerCase().replace(/ /g, "_");
        return rune.stats?.[statKey] > 0;
      }
      return rune.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  const computeTotalStats = () => {
    const stats = {};
    [...setup.runes, ...setup.classes].forEach((entry) => {
      const source = entry.stats || {};
      Object.entries(source).forEach(([key, val]) => {
        stats[key] = (stats[key] || 0) + Number(val);
      });
    });
    return stats;
  };

  const totalStats = computeTotalStats();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Builder Panel */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            className="px-3 py-1 rounded bg-zinc-800 text-white border border-zinc-600"
            value={setup.name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="bg-red-600 px-3 py-1 rounded text-white"
            onClick={resetSetup}
          >
            Reset
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {["Runes", "Classes"].map((tab) => (
            <button
              key={tab}
              className={cn(
                "px-4 py-2 rounded",
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-700 text-gray-300"
              )}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Selected */}
        <div className="mt-4 text-sm">
          <strong>Selected {activeTab} ({setup[activeTab.toLowerCase()].length}/
            {activeTab === "Runes" ? 6 : 4})</strong>{" "}
          — Click to remove
          <div className="flex flex-wrap mt-2 gap-1">
            {setup[activeTab.toLowerCase()].map((item, idx) => (
              <button
                key={idx}
                onClick={() =>
                  activeTab === "Runes"
                    ? toggleRune(item)
                    : toggleClass(item)
                }
                className="bg-blue-800 hover:bg-blue-600 text-white px-2 py-1 rounded"
              >
                {item.name || item}
              </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Search runes..."
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {activeTab === "Runes" && (
            <select
              className="px-2 py-1 bg-zinc-800 border border-zinc-700 text-white rounded"
              value={selectedStat}
              onChange={(e) => setSelectedStat(e.target.value)}
            >
              <option value="">All</option>
              {statList.map((s, idx) => (
                <option key={idx} value={s.Stat}>
                  {s.Stat}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto space-y-2 mt-4">
          {activeTab === "Runes"
            ? getFilteredRunes().map((rune, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-800 p-3 rounded shadow hover:bg-zinc-700 cursor-pointer"
                  onClick={() => toggleRune(rune)}
                >
                  <h3 className="font-bold text-lg mb-1">{rune.name}</h3>
                  <div className="text-xs text-gray-300">
                    {rune.runes?.join(", ")}
                  </div>
                  <ul className="text-sm mt-1">
                    {Object.entries(rune.stats || {}).map(
                      ([key, val]) =>
                        val > 0 && (
                          <li key={key}>
                            {key.replace(/_/g, " ")}: {val}
                          </li>
                        )
                    )}
                  </ul>
                </div>
              ))
            : Object.entries(classData.Adventurer.paths || {}).flatMap(
                ([_, branch]) =>
                  branch.path.map((cls, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-800 p-3 rounded shadow hover:bg-zinc-700 cursor-pointer"
                      onClick={() => toggleClass(cls.class)}
                    >
                      <h3 className="font-bold text-lg mb-1">{cls.class}</h3>
                      <ul className="text-sm mt-1">
                        {Object.entries(cls.stats).map(([key, val]) => (
                          <li key={key}>
                            {key}: {val}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
              )}
        </div>
      </div>

      {/* Stats Panel */}
      <div className="bg-zinc-800 p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-3">📊 Total Passive Stats</h2>
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(totalStats).map(([key, val]) => (
              <tr key={key} className="border-b border-zinc-700">
                <td className="capitalize p-1">{key.replace(/_/g, " ")}</td>
                <td className="text-right p-1 font-mono">{val.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SetupBuilder;
