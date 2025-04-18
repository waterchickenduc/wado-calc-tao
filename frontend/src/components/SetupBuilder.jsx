import React, { useState, useEffect } from "react";
import runeData from "../data/runes.json";
import classData from "../data/adventureClasses.json";
import statList from "../data/stats.json";
import { cn } from "../lib/utils";
import Button from "./ui/Button";
import Input from "./ui/Input";


const SetupBuilder = ({ setup, updateSetup, resetSetup, setName }) => {
  const [activeTab, setActiveTab] = useState("Runes");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddRune = (rune) => {
    const runes = [...setup.runes];
    if (runes.length >= 6) return;
    runes.push(rune);
    updateSetup({ runes });
  };

  const handleRemoveRune = (index) => {
    const runes = [...setup.runes];
    runes.splice(index, 1);
    updateSetup({ runes });
  };

  const getFilteredRunes = () => {
    if (!searchTerm.trim()) return runeData;
    return runeData.filter((r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getTotalStats = () => {
    const totals = {};
    setup.runes.forEach((rune) => {
      const match = runeData.find((r) => r.name === rune.name);
      if (match) {
        Object.entries(match.stats).forEach(([k, v]) => {
          totals[k] = (totals[k] || 0) + Number(v);
        });
      }
    });
    return totals;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">🛠 Build Your Setup</h2>
          <Button onClick={resetSetup} variant="outline">Reset</Button>
        </div>

        <Input
          value={setup.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Setup Name"
        />

        <div className="flex space-x-2">
          <Button
            variant={activeTab === "Runes" ? "default" : "outline"}
            onClick={() => setActiveTab("Runes")}
          >
            Runes
          </Button>
          <Button
            variant={activeTab === "Classes" ? "default" : "outline"}
            onClick={() => setActiveTab("Classes")}
          >
            Classes
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-medium">
            Selected Runes ({setup.runes.length}/6)
            <span className="text-sm ml-2">— Click to remove</span>
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {setup.runes.map((rune, idx) => (
              <div
                key={idx}
                className="bg-blue-800 text-white px-3 py-1 rounded-full cursor-pointer"
                onClick={() => handleRemoveRune(idx)}
              >
                {rune.name}
              </div>
            ))}
          </div>
        </div>

        {activeTab === "Runes" && (
          <>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search runes..."
              className="my-4"
            />

            <div className="grid md:grid-cols-2 gap-4">
              {getFilteredRunes().map((rune) => (
                <div
                  key={rune.name}
                  className="bg-zinc-800 p-4 rounded-md hover:bg-zinc-700 cursor-pointer"
                  onDoubleClick={() => handleAddRune(rune)}
                >
                  <div className="font-semibold text-white flex justify-between">
                    <span>{rune.name}</span>
                    <span className="text-sm text-zinc-400">
                      {setup.runes.filter(r => r.name === rune.name).length > 1 &&
                        `×${setup.runes.filter(r => r.name === rune.name).length}`}
                    </span>
                  </div>
                  <div className="text-sm mt-2 text-zinc-300">
                    {Object.entries(rune.stats)
                      .filter(([_, v]) => parseFloat(v) > 0)
                      .map(([key, value]) => (
                        <div key={key}>
                          {key}: <strong>{value}%</strong>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Classes" && (
          <div className="p-4 rounded-md bg-zinc-800">
            <p className="text-zinc-300">Class selection UI coming soon.</p>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 p-4 rounded-lg shadow border border-zinc-800">
        <h3 className="text-xl font-bold mb-4">📊 Total Passive Stats</h3>
        <table className="w-full text-left text-sm text-zinc-300">
          <tbody>
            {Object.entries(getTotalStats()).map(([stat, val]) => (
              <tr key={stat}>
                <td className="capitalize py-1">{stat}</td>
                <td className="text-right font-semibold text-white">{val.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SetupBuilder;
