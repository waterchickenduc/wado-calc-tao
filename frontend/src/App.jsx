import React, { useState } from "react";
import SetupBuilder from "./components/SetupBuilder";
import CompareView from "./components/CompareView";
import Button from "./components/ui/Button";
import "./index.css";

export default function App() {
  const [setups, setSetups] = useState([
    { id: 1, name: "Setup 1", runes: [], classes: [] },
    { id: 2, name: "Setup 2", runes: [], classes: [] },
    { id: 3, name: "Setup 3", runes: [], classes: [] },
  ]);
  const [activeSetup, setActiveSetup] = useState(0);
  const [mode, setMode] = useState("build");

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
    alert("✅ Presets saved.");
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 border-b border-zinc-700 bg-zinc-900 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-blue-400">
          ⚔️ WadoCalc Tao
        </h1>
        <div className="flex gap-2">
          <Button onClick={savePresets} variant="outline">💾 Save</Button>
          <Button onClick={loadPresets} variant="outline">📂 Load</Button>
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

      {/* Main */}
      <main className="px-4 py-6 max-w-screen-2xl mx-auto">
        {mode === "build" ? (
          <SetupBuilder
            setup={setups[activeSetup]}
            updateSetup={(data) => updateSetup(activeSetup, data)}
            resetSetup={() => resetSetup(activeSetup)}
            setName={(name) =>
              updateSetup(activeSetup, { name: name || `Setup ${activeSetup + 1}` })
            }
          />
        ) : (
          <CompareView setups={setups} />
        )}
      </main>

      {/* Footer - Setup Switcher */}
      {mode === "build" && (
        <footer className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 px-4 py-2 flex justify-center gap-3">
          {setups.map((setup, index) => (
            <Button
              key={setup.id}
              variant={activeSetup === index ? "default" : "outline"}
              onClick={() => setActiveSetup(index)}
            >
              {setup.name}
            </Button>
          ))}
        </footer>
      )}
    </div>
  );
}
