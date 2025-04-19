import React, { useState, useMemo } from "react";
import runeData from "../data/runes.json";
import statList from "../data/stat.json";
import ClassSelector from "./ClassSelector";
import StatsSummary from "./StatsSummary";

export default function SetupBuilder({ setup, updateSetup, resetSetup, setName }) {
  const [tab, setTab] = useState("runes");
  const [filterText, setFilterText] = useState("");

  const selectedRunes = setup.runes || [];
  const selectedClasses = setup.classes || [];

  const groupedSelected = useMemo(() => {
    return selectedRunes.reduce((acc, rune) => {
      acc[rune.name] = acc[rune.name] || { ...rune, count: 0 };
      acc[rune.name].count += 1;
      return acc;
    }, {});
  }, [selectedRunes]);

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

  const filteredRunes = useMemo(() => {
    const query = filterText.toLowerCase();
    return runeData.filter((rune) => {
      const nameMatch = rune.name.toLowerCase().includes(query);
      const stoneMatch = rune.runes?.some((r) => r.toLowerCase().includes(query));
      const statMatch = rune.stats?.some((s) => s.Stat.toLowerCase().includes(query));
      return nameMatch || stoneMatch || statMatch;
    });
  }, [filterText]);

  const runeStats = useMemo(() => {
    const acc = {};
    selectedRunes.forEach((rune) => {
      rune.stats.forEach(({ Stat, Value }) => {
        acc[Stat] = (acc[Stat] || 0) + Value;
      });
    });
    return acc;
  }, [selectedRunes]);

  const classStats = useMemo(() => {
    const acc = {};
    selectedClasses.forEach((cls) => {
      const list = Array.isArray(cls.stats)
        ? cls.stats
        : Object.entries(cls.stats || {}).map(([Stat, Value]) => ({ Stat, Value }));
      list.forEach(({ Stat, Value }) => {
        acc[Stat] = (acc[Stat] || 0) + Value;
      });
    });
    return acc;
  }, [selectedClasses]);

  return (
    <div className="flex flex-col md:flex-row gap-6 text-white">
      {/* LEFT COLUMN */}
      <div className="flex-1 space-y-6">
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

        {/* RUNE TAB */}
        {tab === "runes" && (
          <>
            {/* Selected Runes */}
            <div>
              <h2 className="text-xl font-bold mb-2 text-blue-400">
                Selected Runes ({selectedRunes.length}/6)
              </h2>
              {selectedRunes.length === 0 ? (
                <p className="text-white/50 text-sm">No runes selected yet.</p>
              ) : (
                <>
                  <button
                    onClick={handleClearRunes}
                    className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 mb-3"
                  >
                    ✖ Clear All
                  </button>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Object.values(groupedSelected).map((rune) => (
                      <div
                        key={rune.name}
                        className="bg-zinc-900 p-4 rounded border border-zinc-700"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-blue-300">{rune.name}</h3>
                          <div className="text-sm bg-zinc-700 px-2 py-0.5 rounded-full">
                            ×{rune.count}
                          </div>
                          <button
                            onClick={() => handleRemoveRune(rune.name)}
                            className="text-red-400 ml-3 hover:text-red-300"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 text-xs text-white">
                          {rune.runes?.map((r, i) => (
                            <span key={i} className="bg-zinc-700 px-2 py-0.5 rounded">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 🔍 Filters */}
            <div className="grid md:grid-cols-2 gap-4 items-end mt-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-white/70 font-semibold">
                  Search Rune Name / Rune Stone / Stat
                </label>
                <input
                  type="text"
                  placeholder="e.g. Caissor, Jara, Cr. Dmg"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="bg-zinc-800 text-white px-3 py-2 rounded"
                />
              </div>
            </div>

            {/* Rune Library */}
            <div>
              <h2 className="text-xl font-bold mb-3 text-blue-400">
                Rune Library ({filteredRunes.length})
              </h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredRunes.map((rune) => (
                  <div
                    key={rune.name}
                    className="bg-zinc-800 border border-zinc-700 p-4 rounded"
                  >
                    <h3 className="text-white font-semibold mb-1">{rune.name}</h3>
                    <div className="flex flex-wrap gap-1 text-xs mb-2">
                      {rune.runes.map((r, i) => (
                        <span
                          key={i}
                          className="bg-zinc-700 text-white px-2 py-0.5 rounded"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                    <ul className="text-sm text-white/80 grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                      {rune.stats.map(({ Stat, Value }, i) => (
                        <li key={i}>
                          {Stat}: <span className="font-medium">{Value}%</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleAddRune(rune)}
                      disabled={selectedRunes.length >= 6}
                      className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
                    >
                      ➕ Add Rune
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* CLASS TAB */}
        {tab === "classes" && (
          <ClassSelector setup={setup} updateSetup={updateSetup} />
        )}
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-[300px]">
        <StatsSummary stats={runeStats} classStats={classStats} />
      </div>
    </div>
  );
}
