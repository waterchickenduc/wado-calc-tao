import React, { useState, useMemo } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import statList from "../data/stat.json";
import runeData from "../data/runes.json";
import SelectedRunes from "./SelectedRunes";
import RuneSelector from "./RuneSelector";
import ClassSelector from "./ClassSelector";
import StatTable from "./StatTable";

export default function SetupBuilder({ setup, updateSetup, resetSetup, setName }) {
  const [tab, setTab] = useState("runes");
  const [runeFilter, setRuneFilter] = useState("");
  const [statFilter, setStatFilter] = useState("");

  const filteredRunes = useMemo(() => {
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

  const handleAddRune = (rune) => {
    if (setup.runes.length >= 6) return;
    updateSetup({ runes: [...setup.runes, rune] });
  };

  const handleRemoveRune = (index) => {
    const updated = [...setup.runes];
    updated.splice(index, 1);
    updateSetup({ runes: updated });
  };

  const handleClearRunes = () => {
    updateSetup({ runes: [] });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left side: Setup controls */}
      <div className="flex-1 space-y-6">
        {/* Setup Name + Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Input
            value={setup.name}
            onChange={(e) => setName(e.target.value)}
            className="w-full md:w-auto"
            placeholder="Setup Name"
          />
          <Button onClick={resetSetup} variant="outline">
            🔄 Reset
          </Button>
        </div>

        {/* Selected Runes */}
        <div className="bg-zinc-950 p-4 rounded-md border border-zinc-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-blue-400 font-bold">📦 Selected Runes</h3>
            <button
              onClick={handleClearRunes}
              className="text-red-400 text-sm hover:underline"
            >
              🧹 Clear All
            </button>
          </div>
          <SelectedRunes runes={setup.runes} onRemove={handleRemoveRune} />
        </div>

        {/* Tab Switch */}
        <div className="flex gap-2">
          <Button
            onClick={() => setTab("runes")}
            variant={tab === "runes" ? "default" : "outline"}
          >
            🔮 Runes
          </Button>
          <Button
            onClick={() => setTab("classes")}
            variant={tab === "classes" ? "default" : "outline"}
          >
            🧠 Classes
          </Button>
        </div>

        {/* Tab Content */}
        {tab === "runes" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            </div>

            <RuneSelector
              runes={filteredRunes}
              onAddRune={handleAddRune}
              selectedRunes={setup.runes}
            />
          </>
        )}

        {tab === "classes" && (
          <div className="p-4 border border-zinc-800 bg-zinc-950 rounded-md">
            <ClassSelector setup={setup} updateSetup={updateSetup} />
          </div>
        )}
      </div>

      {/* Right side: Passive Stats */}
      <div className="w-full lg:w-96 bg-zinc-950 p-4 rounded-md border border-zinc-700">
        <StatTable runes={setup.runes} classes={setup.classes} />
      </div>
    </div>
  );
}
