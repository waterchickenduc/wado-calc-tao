import React, { useState, useMemo } from "react";
import runeData from "../data/runes.json";
import statList from "../data/stat.json";
import auraEffects from "../data/auraEffects.json";
import ClassSelector from "./ClassSelector";
import StatsSummary from "./StatsSummary";
import RuneCard from "./RuneCard";

const PAGE_SIZE = 24;

export default function SetupBuilder({ setup, updateSetup, resetSetup, setName }) {
  const [tab, setTab] = useState("runes");
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState([]);
  const [page, setPage] = useState(1);

  const selectedRunes = setup?.runes || [];
  const selectedClasses = setup?.classes || [];

  const grouped = useMemo(() => {
    return selectedRunes.reduce((acc, rune) => {
      acc[rune.name] = acc[rune.name] || { ...rune, count: 0 };
      acc[rune.name].count += 1;
      return acc;
    }, {});
  }, [selectedRunes]);

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

  const filteredRunes = useMemo(() => {
    return runeData.filter((rune) => {
      const nameMatch =
        rune.name.toLowerCase().includes(searchText.toLowerCase()) ||
        rune.runes.some((stone) =>
          stone.toLowerCase().includes(searchText.toLowerCase())
        );

      const statMatch = filters.every((stat) =>
        rune.stats.some((s) => s.Stat.toLowerCase() === stat.toLowerCase())
      );

      return nameMatch && statMatch;
    });
  }, [searchText, filters]);

  const paginatedRunes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRunes.slice(start, start + PAGE_SIZE);
  }, [filteredRunes, page]);

  const totalPages = Math.ceil(filteredRunes.length / PAGE_SIZE);

  const addFilter = (stat) => {
    if (!filters.includes(stat)) setFilters([...filters, stat]);
  };

  const removeFilter = (stat) => {
    setFilters(filters.filter((s) => s !== stat));
  };

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

  const { auraStats, activeAuras } = useMemo(() => {
    const active = {};
    const statSum = {};

    selectedRunes.forEach((rune) => {
      if (rune.aura && rune.aura !== "none") {
        const name = rune.aura;
        active[name] = active[name] || { name, count: 0, stats: {} };
        active[name].count += 1;
      }
    });

    Object.values(active).forEach((aura) => {
      const effect = auraEffects.find((ae) => ae.name === aura.name);
      if (effect) {
        aura.stats = effect.stats;
        Object.entries(effect.stats).forEach(([k, v]) => {
          statSum[k] = (statSum[k] || 0) + v;
        });
      }
    });

    return { auraStats: statSum, activeAuras: Object.values(active) };
  }, [selectedRunes]);

  return (
    <div className="flex flex-col md:flex-row gap-6 text-white">
      <div className="flex-1 space-y-4">
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
            <div className="flex justify-between items-center mt-4">
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
                  <RuneCard
                    key={rune.name}
                    rune={rune}
                    count={rune.count}
                    onRemove={() => handleRemoveRune(rune.name)}
                  />
                ))}
              </div>
            )}

            {/* Filters */}
            <div className="mt-6 space-y-2">
              <input
                type="text"
                placeholder="🔍 Search rune name or stone"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setPage(1);
                }}
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

            {/* PAGINATED RUNE LIST */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
              {paginatedRunes.map((rune, index) => (
                <RuneCard
                  key={`${rune.name}-${index}`}
                  rune={rune}
                  onAdd={() => handleAddRune(rune)}
                  isDisabled={selectedRunes.length >= 6}
                />
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="bg-zinc-700 px-3 py-1 rounded text-white disabled:opacity-30"
                >
                  ◀ Prev
                </button>
                <span className="text-white/70 text-sm mt-1">Page {page} of {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="bg-zinc-700 px-3 py-1 rounded text-white disabled:opacity-30"
                >
                  Next ▶
                </button>
              </div>
            )}
          </>
        )}

        {/* CLASS TAB */}
        {tab === "classes" && (
          <ClassSelector setup={setup} updateSetup={updateSetup} />
        )}
      </div>

      <div className="w-full md:w-[300px] space-y-4">
        <StatsSummary
          runeStats={runeStats}
          classStats={classStats}
          auraStats={auraStats}
          auras={activeAuras}
        />
      </div>
    </div>
  );
}
