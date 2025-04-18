import React from "react";
import runeData from "../data/runes.json";
import statList from "../data/stat.json";
import Input from "./ui/Input";

export default function RuneSelector({ selected, onSelect }) {
  const [runeFilter, setRuneFilter] = React.useState("");
  const [statFilter, setStatFilter] = React.useState("");

  const filteredRunes = React.useMemo(() => {
    return runeData.filter((rune) => {
      const matchesName = rune.name.toLowerCase().includes(runeFilter.toLowerCase());
      const matchesStat =
        !statFilter ||
        Object.keys(rune.stats).some(
          (stat) =>
            stat.toLowerCase().includes(statFilter.toLowerCase()) &&
            rune.stats[stat] !== 0
        );
      return matchesName && matchesStat;
    });
  }, [runeFilter, statFilter]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          placeholder="🔍 Search Rune Name"
          value={runeFilter}
          onChange={(e) => setRuneFilter(e.target.value)}
        />
        <select
          value={statFilter}
          onChange={(e) => setStatFilter(e.target.value)}
          className="bg-zinc-800 text-white text-sm border border-zinc-700 rounded-md px-3 py-2"
        >
          <option value="">All Stats</option>
          {statList.map((stat) => (
            <option key={stat} value={stat}>
              {stat}
            </option>
          ))}
        </select>
        <div />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRunes.map((rune) => (
          <div
            key={rune.name}
            onClick={() => onSelect(rune)}
            className="bg-zinc-800 hover:bg-zinc-700 cursor-pointer p-3 rounded-md border border-zinc-700 transition-all duration-150"
          >
            <div className="font-bold text-blue-400 mb-1">{rune.name}</div>
            <div className="flex flex-wrap gap-1 mb-2 text-xs text-zinc-400">
              {rune.runes.map((r, i) => (
                <span key={i} className="bg-zinc-700 text-white px-2 py-0.5 rounded">
                  {r}
                </span>
              ))}
            </div>
            <div className="text-xs text-zinc-300">
              {Object.entries(rune.stats)
                .filter(([_, v]) => v !== 0)
                .map(([k, v]) => (
                  <div key={k}>
                    {k}: {v}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
