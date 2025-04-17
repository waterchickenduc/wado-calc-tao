import React, { useState, useEffect } from "react";
import runeData from "../data/runes.json";
import classData from "../data/adventureClasses.json";
import statList from "../data/stat.json";
import { cn } from "../lib/utils";

const SetupBuilder = ({ setup, updateSetup, resetSetup, setName }) => {
  const [selectedRunes, setSelectedRunes] = useState(setup.runes || []);
  const [selectedClasses, setSelectedClasses] = useState(setup.classes || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statFilter, setStatFilter] = useState("");

  useEffect(() => {
    updateSetup({ runes: selectedRunes, classes: selectedClasses });
  }, [selectedRunes, selectedClasses]);

  const addRune = (rune) => {
    if (selectedRunes.length >= 6) return;
    setSelectedRunes((prev) => [...prev, rune]);
  };

  const removeRune = (index) => {
    const updated = [...selectedRunes];
    updated.splice(index, 1);
    setSelectedRunes(updated);
  };

  const toggleClass = (cls) => {
    const exists = selectedClasses.find((c) => c.class === cls.class);
    if (exists) return; // Already selected
    setSelectedClasses([...selectedClasses, cls]);
  };

  const removeClass = (cls) => {
    setSelectedClasses((prev) =>
      prev.filter((c) => c.class !== cls.class)
    );
  };

  const calculateStats = () => {
    const totals = {};
    statList.forEach(({ Stat }) => {
      totals[Stat] = 0;
    });

    const parseValue = (v) => parseFloat((v || "0").replace(",", ".").replace("%", ""));

    selectedRunes.forEach((rune) => {
      Object.entries(rune.stats).forEach(([key, value]) => {
        if (key in totals) {
          totals[key] += parseValue(value);
        }
      });
    });

    selectedClasses.forEach((cls) => {
      Object.entries(cls.stats).forEach(([key, value]) => {
        if (key in totals) {
          totals[key] += parseValue(value);
        }
      });
    });

    return totals;
  };

  const filteredRunes = runeData.filter((rune) => {
    const matchSearch = rune.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStat = statFilter
      ? Object.entries(rune.stats || {}).some(([k, v]) => k === statFilter && parseFloat(v) !== 0)
      : true;
    return matchSearch && matchStat;
  });

  const totalStats = calculateStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left: Rune Selection */}
      <div className="col-span-2 space-y-4">
        <div className="flex gap-2">
          <input
            className="w-full p-2 bg-zinc-800 text-white rounded"
            placeholder="🔍 Search runes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 bg-zinc-800 text-white rounded"
            value={statFilter}
            onChange={(e) => setStatFilter(e.target.value)}
          >
            <option value="">All Stats</option>
            {statList.map(({ Stat }) => (
              <option key={Stat} value={Stat}>{Stat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
          {filteredRunes.map((rune, i) => (
            <div
              key={i}
              onClick={() => addRune(rune)}
              className="cursor-pointer border border-zinc-700 hover:border-blue-400 bg-zinc-800 rounded p-2 text-sm hover:bg-zinc-700 transition"
            >
              <strong>{rune.name}</strong>
              <div className="text-xs text-gray-400">{rune.runes?.join(" + ")}</div>
              <div className="text-xs">
                {Object.entries(rune.stats)
                  .filter(([_, v]) => parseFloat((v || "0").replace(",", ".").replace("%", "")) !== 0)
                  .map(([k, v]) => (
                    <div key={k}>
                      {k}: {v}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-blue-400 font-semibold mb-2">🧩 Selected Runes ({selectedRunes.length}/6)</h3>
          <div className="flex flex-wrap gap-2">
            {selectedRunes.map((rune, index) => (
              <div
                key={index}
                onClick={() => removeRune(index)}
                className="bg-blue-700 hover:bg-red-700 text-white px-2 py-1 rounded cursor-pointer text-sm"
              >
                {rune.name}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-blue-400 font-semibold mb-2">⚔️ Available Classes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.values(classData.Adventurer.paths).flatMap((p) => p.path).map((cls, i) => (
              <div
                key={i}
                onClick={() => toggleClass(cls)}
                className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-green-500 p-2 rounded"
              >
                {cls.class}
              </div>
            ))}
          </div>

          <h3 className="text-blue-400 font-semibold mt-4">🎓 Selected Classes ({selectedClasses.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedClasses.map((cls, index) => (
              <div
                key={index}
                onClick={() => removeClass(cls)}
                className="bg-green-700 hover:bg-red-700 px-2 py-1 text-sm rounded cursor-pointer"
              >
                {cls.class}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Total Stats */}
      <div className="bg-zinc-800 rounded-lg p-4 h-fit sticky top-4">
        <h3 className="text-xl font-semibold text-blue-400 mb-2">📊 Total Passive Stats</h3>
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(totalStats).map(([key, value]) => (
              <tr key={key} className="border-b border-zinc-700">
                <td className="py-1 text-gray-300">{key}</td>
                <td className="py-1 text-right text-white font-mono">{value.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SetupBuilder;
