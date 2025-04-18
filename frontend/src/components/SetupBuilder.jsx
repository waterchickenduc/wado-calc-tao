import React, { useState, useMemo } from "react";
import runeData from "../data/runes.json";
import statList from "../data/stat.json";
import auraEffects from "../data/auraEffects.json";

import statLabels from "../lib/statLabels";
import ClassSelector from "./ClassSelector";
import StatsSummary from "./StatsSummary";
import RuneCard from "./RuneCard";

export default function SetupBuilder({ setup, updateSetup, resetSetup, setName }) {
  const [tab, setTab] = useState("runes");
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState([]);

  const selectedRunes = Array.isArray(setup?.runes) ? setup.runes : [];
  const selectedClasses = Array.isArray(setup?.classes) ? setup.classes : [];

  const grouped = selectedRunes.reduce((acc, rune) => {
    acc[rune.name] = acc[rune.name] || { ...rune, count: 0 };
    acc[rune.name].count += 1;
    return acc;
  }, {});
  const uniqueSelectedRunes = Object.values(grouped);

  const filteredRunes = runeData.filter((rune) => {
    const runeMatch = rune.name?.toLowerCase().includes(searchText.toLowerCase());
    const stoneMatch = rune.runes?.some((stone) =>
      stone?.toLowerCase().includes(searchText.toLowerCase())
    );
    const filterMatch = filters.every((stat) =>
      rune.stats?.some((s) => s.Stat.toLowerCase() === stat.toLowerCase())
    );
    return (runeMatch || stoneMatch) && filterMatch;
  });

  const handleAddRune = (rune) => {
    if (selectedRunes.length >= 6) return;
    updateSetup({ runes: [...selectedRunes, rune] });
  };

  const handleRemoveRune = (runeName) => {
    const index = selectedRunes.findIndex((r) => r.name === runeName);
    if (index >= 0) {
      const updated = [...selectedRunes];
      updated.splice(index, 1);
      updateSetup({ runes: updated });
    }
  };

  const handleClearRunes = () => updateSetup({ runes: [] });

  const addFilter = (stat) => {
    if (!filters.includes(stat)) setFilters([...filters, stat]);
  };

  const removeFilter = (stat) => {
    setFilters(filters.filter((s) => s !== stat));
  };

  const runeStats = useMemo(() => {
    const stats = {};
    selectedRunes.forEach((rune) => {
      (rune.stats || []).forEach(({ Stat, Value }) => {
        stats[Stat] = (stats[Stat] || 0) + (parseFloat(Value) || 0);
      });
    });
    return stats;
  }, [selectedRunes]);

  const classStats = useMemo(() => {
    const stats = {};
    selectedClasses.forEach((cls) => {
      const entries = Object.entries(cls?.stats || {});
      entries.forEach(([key, value]) => {
        stats[key] = (stats[key] || 0) + (parseFloat(value) || 0);
      });
    });
    return stats;
  }, [selectedClasses]);

  const auraStats = useMemo(() => {
    const stats = {};
    const activeAuras = [];

    selectedRunes.forEach((rune) => {
      if (!rune.aura || rune.aura.toLowerCase() === "none") return;

      const effect = auraEffects.find((a) => a.name === rune.aura);
      if (!effect || !effect.stats) return;

      const normalizedStats = {};

      Object.entries(effect.stats).forEach(([rawKey, val]) => {
        const label = statLabels[rawKey] || rawKey;
        const num = parseFloat(val) || 0;
        if (num !== 0) {
          stats[label] = (stats[label] || 0) + num;
          normalizedStats[label] = num;
        }
      });

      activeAuras.push({
        name: rune.aura,
        chance: rune.auraChance || 0,
        stats: normalizedStats,
      });
    });

    return { stats, activeAuras };
  }, [selectedRunes]);

  return (
    <div className="flex flex-col md:flex-row gap-6 text-white">
      {/* LEFT SIDE */}
      <div className="flex-1 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <input
            className="bg-zinc-800 text-white px-3 py-2 rounded w-full max-w-sm"
            value={setup.name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={resetSetup}
            className="ml-4 px-3 py-2 rounded bg-blue-700 text-white hover:bg-blue-600"
          >
            🔄 Reset
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("runes")}
            className={`px-4 py-2 rounded ${tab === "runes" ? "bg-blue-600" : "bg-zinc-800"} text-white`}
          >
            Runes
          </button>
          <button
            onClick={() => setTab("classes")}
            className={`px-4 py-2 rounded ${tab === "classes" ? "bg-blue-600" : "bg-zinc-800"} text-white`}
          >
            Classes
          </button>
        </div>

        {/* Runes Tab */}
        {tab === "runes" && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Selected Runes ({selectedRunes.length}/6)</h2>
              {selectedRunes.length > 0 && (
                <button
                  onClick={handleClearRunes}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                >
                  ✖ Clear All
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {uniqueSelectedRunes.map((rune) => (
                <RuneCard
                  key={rune.name}
                  rune={rune}
                  count={rune.count}
                  onRemove={() => handleRemoveRune(rune.name)}
                />
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <input
                type="text"
                placeholder="🔍 Search rune name or stone"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="px-3 py-2 rounded bg-zinc-800 text-white w-full"
              />

              <div className="flex flex-wrap items-center gap-2">
                {filters.map((stat, index) => (
                  <div key={stat} className="flex items-center gap-2">
                    <button
                      onClick={() => removeFilter(stat)}
                      className="bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-2"
                    >
                      {stat} <span className="text-xs">✕</span>
                    </button>
                    {index < filters.length - 1 && (
                      <span className="text-white/50 font-semibold text-sm">AND</span>
                    )}
                  </div>
                ))}

                <select
                  onChange={(e) => {
                    if (e.target.value) addFilter(e.target.value);
                    e.target.selectedIndex = 0;
                  }}
                  className="px-2 py-1 rounded bg-zinc-700 text-white"
                >
                  <option value="">➕ Add stat filter</option>
                  {statList.filter((s) => !filters.includes(s)).map((stat) => (
                    <option key={stat} value={stat}>
                      {stat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
              {filteredRunes.map((rune) => (
                <RuneCard
                  key={rune.name}
                  rune={rune}
                  onAdd={() => handleAddRune(rune)}
                  isDisabled={selectedRunes.length >= 6}
                />
              ))}
            </div>
          </>
        )}

        {/* Classes Tab */}
        {tab === "classes" && (
          <ClassSelector setup={setup} updateSetup={updateSetup} />
        )}
      </div>

      {/* Right Side: Stats Summary */}
      <div className="w-full md:w-[300px] space-y-4">
        <StatsSummary
          runeStats={runeStats}
          classStats={classStats}
          auraStats={auraStats.stats}
          activeAuras={auraStats.activeAuras}
        />
      </div>
    </div>
  );
}
