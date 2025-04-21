import React, { useState, useEffect, useRef, useMemo } from "react";
import SetupBuilder from "./components/SetupBuilder";
import CompareView from "./components/CompareView";
import SetupSelector from "./components/ui/SetupSelector";
import Button from "./components/ui/Button";
import InfoPopover from "./components/InfoPopover";
import { buildStatsSummary } from "./lib/statHelpers";
import { evaluateLogicalSearch } from "./lib/filterEngine/evaluate";
import statList from "./data/stat.json";
import runeData from "./data/runes.json";
import Fuse from "fuse.js";
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
  const [tab, setTab] = useState("runes");

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const searchBoxRef = useRef(null); // 👈 for outside click detection

  // Setup term source
  const runeNames = runeData.map((r) => r.name);
  const runeStones = runeData.flatMap((r) => r.runes);
  const auras = runeData.map((r) => r.aura).filter(Boolean);
  const allTerms = useMemo(() => [...new Set([...statList, ...runeNames, ...runeStones, ...auras])], []);

  const fuse = useMemo(() => new Fuse(allTerms, { threshold: 0.3 }), [allTerms]);

  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Run fuzzy match
  useEffect(() => {
    const lastTerm = searchText.split(/[\s()]+/).filter(Boolean).pop();
    if (!lastTerm || lastTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    const results = fuse.search(lastTerm).map((r) => r.item);
    setSuggestions(results.slice(0, 6));
    setSelectedIndex(0);
  }, [debouncedSearch]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const insertSuggestion = (term) => {
    const parts = searchText.trim().split(/\s+/);
    parts.pop();
    const updated = [...parts, term];
    setSearchText(updated.join(" ") + " ");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const filteredRunes = useMemo(() => {
    try {
      return runeData.filter((rune) => evaluateLogicalSearch(debouncedSearch, rune));
    } catch (err) {
      console.warn("❌ Invalid expression:", err.message);
      return runeData;
    }
  }, [debouncedSearch]);

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
          <Button onClick={savePresets} variant="outline">💾 Save</Button>
          <Button onClick={loadPresets} variant="outline">📂 Load</Button>
          <Button variant={mode === "build" ? "default" : "outline"} onClick={() => setMode("build")}>🛠 Build</Button>
          <Button variant={mode === "compare" ? "default" : "outline"} onClick={() => setMode("compare")}>📊 Compare</Button>
        </div>
      </header>

      {/* Setup Tabs */}
      <div className="px-4 py-2 border-b border-wado-border bg-wado-surface flex flex-col gap-2">
        {mode === "build" && (
          <>
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <SetupSelector
                setups={setups}
                activeIndex={activeSetup}
                onSelect={(index) => setActiveSetup(index)}
                onNew={() => {
                  const newSetup = {
                    id: Date.now(),
                    name: `Setup ${setups.length + 1}`,
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
              <button
                onClick={() => resetSetup(activeSetup)}
                className="px-3 py-2 rounded border border-red-500 text-red-400 hover:bg-red-600 hover:text-white transition-all text-sm"
              >
                🧹 Empty Setup
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-2">
              <button
                className={`px-4 py-2 rounded-t ${tab === "runes" ? "bg-blue-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                onClick={() => setTab("runes")}
              >
                Runes
              </button>
              <button
                className={`px-4 py-2 rounded-t ${tab === "classes" ? "bg-blue-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                onClick={() => setTab("classes")}
              >
                Classes
              </button>
            </div>

            {/* Logical Rune Search */}
            {tab === "runes" && (
              <div className="bg-wado-surface px-4 pt-4 pb-5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-white font-semibold text-base">Logical Rune Search</label>
                  <InfoPopover />
                </div>
                <div className="relative" ref={searchBoxRef}>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="(cr. dmg AND jara) OR caissor"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (suggestions.length === 0) return;
                      if (e.key === "ArrowDown") {
                        setSelectedIndex((i) => (i + 1) % suggestions.length);
                        e.preventDefault();
                      } else if (e.key === "ArrowUp") {
                        setSelectedIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
                        e.preventDefault();
                      } else if (e.key === "Enter") {
                        insertSuggestion(suggestions[selectedIndex]);
                        e.preventDefault();
                      } else if (e.key === "Escape") {
                        setSuggestions([]); // 🔥 ESC closes dropdown
                      }
                    }}
                    className="px-3 py-2 rounded bg-zinc-800 text-white w-full"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-50 bg-zinc-900 border border-zinc-700 rounded mt-1 w-full shadow-lg">
                      {suggestions.map((s, idx) => (
                        <div
                          key={idx}
                          onClick={() => insertSuggestion(s)}
                          className={`px-3 py-2 text-sm flex justify-between cursor-pointer ${
                            idx === selectedIndex ? "bg-blue-700 text-white" : "hover:bg-blue-800"
                          }`}
                        >
                          <span>{s}</span>
                          <span className="text-xs text-gray-400 ml-2">[auto]</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Main Panel */}
      <main className="p-4 md:p-6">
        {mode === "build" ? (
          <SetupBuilder
            setup={currentSetup}
            updateSetup={(data) => updateSetup(activeSetup, data)}
            resetSetup={() => resetSetup(activeSetup)}
            setName={(name) =>
              updateSetup(activeSetup, {
                name: name || `Setup ${activeSetup + 1}`,
              })
            }
            tab={tab}
            setTab={setTab}
            filteredRunes={filteredRunes}
            stats={{
              totalStats,
              runeStats,
              auraStats,
              classStats,
              runes: currentSetup.runes,
            }}
          />
        ) : (
          <CompareView setups={setups} />
        )}
      </main>
    </div>
  );
}
