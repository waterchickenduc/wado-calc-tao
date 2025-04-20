import React, { useState, useEffect } from "react";
import SetupBuilder from "./components/SetupBuilder";
import CompareView from "./components/CompareView";
import SetupSelector from "./components/ui/SetupSelector";
import Button from "./components/ui/Button";
import StatsSummary from "./components/StatsSummary";
import { buildStatsSummary } from "./lib/statHelpers";
import "./index.css";

export default function App() {
  const [setups, setSetups] = useState(() => {
    const saved = localStorage.getItem("wado_setups");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: Date.now(),
            name: "Setup 1",
            runes: [],
            classes: [],
          },
        ];
  });

  const [activeSetup, setActiveSetup] = useState(0);
  const [mode, setMode] = useState("build");

  useEffect(() => {
    localStorage.setItem("wado_setups", JSON.stringify(setups));
  }, [setups]);

  const updateSetup = (index, data) => {
    const updated = [...setups];
    updated[index] = { ...updated[index], ...data };
    setSetups(updated);
  };

  const resetSetup = (index) => {
    const updated = [...setups];
    updated[index] = { ...updated[index], runes: [], classes: [] };
    setSetups(updated);
  };

  const savePresets = () => {
    localStorage.setItem("wado_setups", JSON.stringify(setups));
    alert("💾 Presets saved.");
  };

  const loadPresets = () => {
    const stored = localStorage.getItem("wado_setups");
    if (stored) {
      setSetups(JSON.parse(stored));
      alert("📂 Presets loaded.");
    } else {
      alert("❌ No saved presets found.");
    }
  };

  const currentSetup = setups[activeSetup];
  const { totalStats, runeStats, auraStats, classStats } = buildStatsSummary(
    currentSetup.runes,
    currentSetup.classes || {}
  );

  return (
    <div className="min-h-screen bg-wado-bg text-white font-inter">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-wado-surface border-b border-wado-border shadow px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide text-blue-400">
          ⚔️ WadoCalc Tao
        </h1>

        <div className="flex items-center flex-wrap gap-2">
          <Button onClick={savePresets} variant="outline">
            💾 Save
          </Button>
          <Button onClick={loadPresets} variant="outline">
            📂 Load
          </Button>
          <Button
            variant={mode === "build" ? "default" : "outline"}
            onClick={() => setMode("build")}
          >
            🛠 Build
          </Button>
          <Button
            variant={mode === "compare" ? "default" : "outline"}
            onClick={() => setMode("compare")}
          >
            📊 Compare
          </Button>
        </div>
      </header>

      {/* Setup Tabs */}
      <div className="px-4 py-2 border-b border-wado-border bg-wado-surface flex flex-wrap gap-4 items-center justify-between">
        {mode === "build" && (
          <SetupSelector
            setups={setups}
            activeIndex={activeSetup}
            onSelect={(index) => setActiveSetup(index)}
            onNew={() => {
              const next = setups.length + 1;
              const newSetup = {
                id: Date.now(),
                name: `Setup ${next}`,
                runes: [],
                classes: [],
              };
              setSetups([...setups, newSetup]);
              setActiveSetup(setups.length);
            }}
            onRename={(index, newName) => {
              const updated = [...setups];
              updated[index].name = newName;
              setSetups(updated);
            }}
            onDelete={(index) => {
              const updated = setups.filter((_, i) => i !== index);
              setSetups(updated);
              setActiveSetup((prev) =>
                index === prev ? 0 : index < prev ? prev - 1 : prev
              );
            }}
          />
        )}
      </div>

      {/* Main Panel */}
      <main className="p-4 md:p-6">
        {mode === "build" ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <SetupBuilder
                setup={currentSetup}
                updateSetup={(data) => updateSetup(activeSetup, data)}
                resetSetup={() => resetSetup(activeSetup)}
                setName={(name) =>
                  updateSetup(activeSetup, {
                    name: name || `Setup ${activeSetup + 1}`,
                  })
                }
              />
            </div>
            <div className="w-full md:max-w-xs">
              <StatsSummary
                totalStats={totalStats}
                runeStats={runeStats}
                auraStats={auraStats}
                classStats={classStats}
              />
            </div>
          </div>
        ) : (
          <CompareView setups={setups} />
        )}
      </main>
    </div>
  );
}
