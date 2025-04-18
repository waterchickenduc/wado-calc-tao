import React, { useState, useMemo } from "react";
import runesData from "../data/runes.json";
import RuneCard from "./RuneCard";
import stats from "../data/stats.json";

export default function RuneSelector({ selectedRunes, onAddRune }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState([]);

  const toggleFilter = (stat) => {
    setFilters((prev) =>
      prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]
    );
  };

  const filteredRunes = useMemo(() => {
    return runesData.filter((rune) => {
      const matchName = rune.name.toLowerCase().includes(search.toLowerCase());
      const matchStats = filters.every((f) =>
        rune.stats.some((s) => s.Stat === f && s.Value > 0)
      );
      return matchName && matchStats;
    });
  }, [search, filters]);

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          className="bg-night-900 border border-night-700 px-3 py-1.5 text-white rounded w-full sm:w-auto"
          placeholder="🔍 Search rune name or stat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          onChange={(e) => {
            if (e.target.value) toggleFilter(e.target.value);
            e.target.value = "";
          }}
          className="bg-night-800 text-white px-3 py-1.5 rounded border border-night-600"
        >
          <option value="">➕ Add stat filter</option>
          {stats.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        {filters.map((f, i) => (
          <span
            key={i}
            className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full"
          >
            {f}
            <button
              className="ml-2 text-white"
              onClick={() => toggleFilter(f)}
            >
              ×
            </button>
            {i < filters.length - 1 && (
              <span className="ml-2 text-sm font-bold text-white">AND</span>
            )}
          </span>
        ))}
      </div>

      {/* Rune Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredRunes.map((rune, idx) => (
          <RuneCard key={idx} rune={rune} onAdd={onAddRune} />
        ))}
      </div>
    </div>
  );
}
