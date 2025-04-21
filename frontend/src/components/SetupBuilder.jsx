import React, { useMemo, useState } from "react";
import ClassSelector from "./ClassSelector";
import RuneCard from "./RuneCard";
import StatsSummary from "./StatsSummary";
import BuilderLayout from "./ui/BuilderLayout"; // 🆕 Import layout wrapper

const PAGE_SIZE = 5;

export default function SetupBuilder({
  setup,
  updateSetup,
  resetSetup,
  setName,
  tab,
  setTab,
  stats,
  filteredRunes = [],
}) {
  const [page, setPage] = useState(1);
  const selectedRunes = setup?.runes || [];

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

  const paginatedRunes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRunes.slice(start, start + PAGE_SIZE);
  }, [filteredRunes, page]);

  const totalPages = Math.ceil(filteredRunes.length / PAGE_SIZE);

  if (tab === "classes") {
    return <ClassSelector setup={setup} updateSetup={updateSetup} />;
  }

  return (
    <BuilderLayout
      left={
        <>
          <h2 className="text-lg font-semibold text-blue-300 mb-2">
            Rune Library ({filteredRunes.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            {paginatedRunes.map((rune, index) => (
              <RuneCard
                key={`${rune.name}-${index}`}
                rune={rune}
                onAdd={() => handleAddRune(rune)}
                isDisabled={selectedRunes.length >= 6}
              />
            ))}
          </div>
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
      }
      middle={
        <>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-blue-300">
              Selected Runes ({selectedRunes.length}/6)
            </h2>
            {selectedRunes.length > 0 && (
              <button
                onClick={handleClearRunes}
                className="px-2 py-1 rounded border border-red-500 text-red-400 hover:bg-red-600 hover:text-white text-sm"
              >
                ✖ Clear all runes
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            {uniqueSelectedRunes.map((rune) => (
              <RuneCard
                key={rune.name}
                rune={rune}
                count={rune.count}
                onRemove={() => handleRemoveRune(rune.name)}
              />
            ))}
          </div>
        </>
      }
      right={
        <StatsSummary
          totalStats={stats.totalStats}
          runeStats={stats.runeStats}
          auraStats={stats.auraStats}
          classStats={stats.classStats}
          runes={stats.runes}
        />
      }
    />
  );
}
