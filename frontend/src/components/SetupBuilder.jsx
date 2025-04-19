import React, { useState, useMemo, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import runeData from "../data/runes.json";
import statList from "../data/stat.json";
import ClassSelector from "./ClassSelector";
import StatsSummary from "./StatsSummary";
import RuneCard from "./RuneCard";
import InfoPopover from "./InfoPopover";
import { evaluateLogicalSearch } from "../lib/evaluateLogicalSearch";

const PAGE_SIZE = 12;

export default function SetupBuilder({ setup, updateSetup, resetSetup, setName }) {
  const [tab, setTab] = useState("runes");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const selectedRunes = setup?.runes || [];
  const selectedClasses = setup?.classes || [];

  // All search terms (stats + rune names + rune stones)
  const allTerms = useMemo(() => {
    const runeNames = runeData.map((r) => r.name);
    const runeStones = runeData.flatMap((r) => r.runes);
    return Array.from(new Set([...statList, ...runeNames, ...runeStones]));
  }, []);

  const fuse = useMemo(() => new Fuse(allTerms, { threshold: 0.3 }), [allTerms]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    if (searchText.length < 2) {
      setSuggestions([]);
      return;
    }
    const lastTerm = searchText.split(/[\s()]+/).filter(Boolean).pop();
    if (lastTerm?.length < 2) {
      setSuggestions([]);
      return;
    }
    const result = fuse.search(lastTerm).map((r) => r.item);
    setSuggestions(result.slice(0, 5));
  }, [searchText]);

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

  const grouped = useMemo(() => {
    return selectedRunes.reduce((acc, rune) => {
      acc[rune.name] = acc[rune.name] || { ...rune, count: 0 };
      acc[rune.name].count += 1;
      return acc;
    }, {});
  }, [selectedRunes]);

  const uniqueSelectedRunes = Object.values(grouped);

  const filteredRunes = useMemo(() => {
    try {
      return runeData.filter((rune) =>
        evaluateLogicalSearch(debouncedSearch, rune)
      );
    } catch (err) {
      console.warn("❌ Invalid expression:", err.message);
      return runeData;
    }
  }, [debouncedSearch]);

  const paginatedRunes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRunes.slice(start, start + PAGE_SIZE);
  }, [filteredRunes, page]);

  const totalPages = Math.ceil(filteredRunes.length / PAGE_SIZE);

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

  const insertSuggestion = (term) => {
    const parts = searchText.trim().split(/\s+/);
    parts.pop();
    const updated = [...parts, term];
    const newValue = updated.join(" ");
    setSearchText(newValue + " ");
    setSuggestions([]);
    inputRef.current?.focus();
  };

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
            {/* Search */}
            <div className="mt-4 relative">
              <label className="block text-white mb-1">Logical Rune Search</label>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="(cr. dmg AND jara) OR caissor"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded bg-zinc-800 text-white w-full"
                  onKeyDown={(e) => {
                    if (suggestions.length > 0 && e.key === "Enter") {
                      insertSuggestion(suggestions[0]);
                      e.preventDefault();
                    }
                  }}
                />
                <InfoPopover />
              </div>
              {suggestions.length > 0 && (
                <div className="absolute z-50 bg-zinc-900 border border-zinc-700 rounded mt-1 w-full max-w-xl shadow-lg">
                  {suggestions.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => insertSuggestion(s)}
                      className="px-3 py-2 text-sm hover:bg-blue-800 cursor-pointer"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected runes */}
            <h2 className="mt-6 text-lg font-semibold text-blue-300">
              Selected Runes ({selectedRunes.length}/6)
            </h2>
            {selectedRunes.length > 0 && (
              <button
                onClick={handleClearRunes}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
              >
                ✖ Clear All
              </button>
            )}

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
              {uniqueSelectedRunes.map((rune) => (
                <RuneCard
                  key={rune.name}
                  rune={rune}
                  count={rune.count}
                  onRemove={() => handleRemoveRune(rune.name)}
                />
              ))}
            </div>

            {/* Rune Library */}
            <h2 className="text-lg font-semibold mt-8 text-blue-300">
              Rune Library ({filteredRunes.length})
            </h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
              {paginatedRunes.map((rune, index) => (
                <RuneCard
                  key={`${rune.name}-${index}`}
                  rune={rune}
                  onAdd={() => handleAddRune(rune)}
                  isDisabled={selectedRunes.length >= 6}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="bg-zinc-700 px-3 py-1 rounded text-white disabled:opacity-30"
                >
                  ◀ Prev
                </button>
                <span className="text-white/70 text-sm mt-1">
                  Page {page} of {totalPages}
                </span>
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

        {tab === "classes" && (
          <ClassSelector setup={setup} updateSetup={updateSetup} />
        )}
      </div>

      <div className="w-full md:w-[300px] space-y-4">
        <StatsSummary runeStats={runeStats} classStats={classStats} />
      </div>
    </div>
  );
}
