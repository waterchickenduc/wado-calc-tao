import React, { useState, useMemo } from "react";
import runeData from "../data/runes.json";
import statList from "../data/stat.json";
import ClassSelector from "./ClassSelector";
import StatsSummary from "./StatsSummary";

export default function SetupBuilder({ setup, updateSetup, resetSetup, setName }) {
  const [tab, setTab] = useState("runes");
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState([]);

  const selectedRunes = setup?.runes || [];
  const selectedClasses = setup?.classes || [];

  const grouped = selectedRunes.reduce((acc, rune) => {
    acc[rune.name] = acc[rune.name] || { ...rune, count: 0 };
    acc[rune.name].count += 1;
    return acc;
  }, {});
  const uniqueSelectedRunes = Object.values(grouped);

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

  const filteredRunes = runeData.filter((rune) => {
    const nameMatch = rune.name.toLowerCase().includes(searchText.toLowerCase());
    const statMatch = filters.every((stat) =>
      rune.stats.some((s) => s.Stat.toLowerCase() === stat.toLowerCase())
    );
    return nameMatch && statMatch;
  });

  const addFilter = (stat) => {
    if (!filters.includes(stat)) setFilters([...filters, stat]);
  };

  const removeFilter = (stat) => {
    setFilters(filters.filter((s) => s !== stat));
  };

  const runeStats = useMemo(() => {
    const stats = {};
    selectedRunes.forEach((rune) => {
      if (Array.isArray(rune.stats)) {
        rune.stats.forEach(({ Stat, Value }) => {
          stats[Stat] = (stats[Stat] || 0) + Value;
        });
      }
    });
    return stats;
  }, [selectedRunes]);

  const classStats = useMemo(() => {
    const stats = {};
    selectedClasses.forEach((cls) => {
      const list = Array.isArray(cls?.stats) ? cls.stats : [];
      list.forEach(({ Stat, Value }) => {
        stats[Stat] = (stats[Stat] || 0) + Value;
      });
    });
    return stats;
  }, [selectedClasses]);

  return (
    <div className="flex flex-col md:flex-row gap-6 text-white">
      <div className="flex-1 space-y-4">
        {/* Setup Header */}
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
            className={`px-4 py-2 rounded ${tab === "runes" ? "bg-blue-600" : "bg-zinc-800"} text-white`}
            onClick={() => setTab("runes")}
          >
            Runes
          </button>
          <button
            className={`px-4 py-2 rounded ${tab === "classes" ? "bg-blue-600" : "bg-zinc-800"} text-white`}
            onClick={() => setTab("classes")}
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

            {selectedRunes.length === 0 ? (
              <p className="text-sm text-blue-200">No runes selected.</p>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {uniqueSelectedRunes.map((rune) => (
                  <div
                    key={rune.name}
                    className="bg-zinc-900 rounded p-3 border border-zinc-700 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 font-semibold text-white">
                        {rune.name}
                        <span className="text-xs bg-zinc-700 px-2 py-0.5 rounded-full text-white/80">
                          ×{rune.count}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveRune(rune.name)}
                        className="text-gray-400 hover:text-red-500 text-lg"
                      >
                        ×
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {rune.runes.map((r, i) => (
                        <span
                          key={i}
                          className="bg-zinc-800 px-2 py-1 rounded-full text-white/80 border border-zinc-600"
                        >
                          {r}
                        </span>
                      ))}
                    </div>

                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-white/90">
                      {rune.stats
                        .filter(({ Value }) => Value !== 0)
                        .map(({ Stat, Value }, i) => (
                          <li key={i}>
                            {Stat}: <span className="font-semibold">{Value}%</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Filters */}
            <div className="mt-6 space-y-2">
              <input
                type="text"
                placeholder="🔍 Search rune name or stat"
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
                  {statList
                    .filter((s) => !filters.includes(s))
                    .map((stat) => (
                      <option key={stat} value={stat}>
                        {stat}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Rune Library */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
              {filteredRunes.map((rune, index) => {
                const isDisabled = selectedRunes.length >= 6;
                return (
                  <div
                    key={`${rune.name}-${index}`}
                    className="bg-zinc-900 rounded p-3 border border-zinc-700 flex flex-col gap-2"
                  >
                    {/* Header with name + add icon */}
                    <div className="flex justify-between items-center">
                      <div className="text-blue-400 font-semibold">{rune.name}</div>
                      <button
                        onClick={() => handleAddRune(rune)}
                        disabled={isDisabled}
                        className={`text-lg font-bold px-2 rounded-full ${
                          isDisabled ? "text-zinc-700" : "text-blue-400 hover:text-blue-300"
                        }`}
                      >
                        +
                      </button>
                    </div>
                      
                    {/* Rune letters */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {rune.runes.map((r, i) => (
                        <span
                          key={i}
                          className="bg-zinc-800 px-2 py-1 rounded-full text-white/80 border border-zinc-600"
                        >
                          {r}
                        </span>
                      ))}
                    </div>

        {/* Stat grid */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-white/90">
          {rune.stats
            .filter(({ Value }) => Value !== 0)
            .map(({ Stat, Value }, i) => (
              <li key={i}>
                {Stat}: <span className="font-semibold">{Value}%</span>
              </li>
            ))}
        </ul>
      </div>
    );
  })}
</div>

          </>
        )}

        {tab === "classes" && <ClassSelector setup={setup} updateSetup={updateSetup} />}
      </div>

      <div className="w-full md:w-[300px] space-y-4">
        <StatsSummary runeStats={runeStats} classStats={classStats} />
      </div>
    </div>
  );
}
