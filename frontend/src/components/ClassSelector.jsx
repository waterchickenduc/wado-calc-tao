import React from "react";
import data from "../data/adventureClasses.json";

const statLabels = {
  health: "HP",
  p_atk: "P. Atk",
  p_def: "P. Def",
  m_atk: "M. Atk",
  m_def: "M. Def",
  ele_atk: "Ele. Atk",
  ele_def: "Ele. Def",
  spirit_atk: "Spirit ATK",
  increase_str: "Increase STR",
  increase_agi: "Increase AGI",
  increase_int: "Increase INT",
  cr_rate: "Cr. Rate",
  cr_dmg: "Cr. Dmg",
  skill_cd: "Skill CD",
  atk_delay: "Atk Delay",
  hp_recovery_per_kill: "HP Recovery / Kill",
  hp_recovery: "HP Recovery",
  movementspeed: "Movementspeed",
  inventoryslots: "Inventoryslots",
};

export default function ClassSelector({ setup, updateSetup }) {
  const selected = setup.classes || [];

  const toggleClass = (cls) => {
    const isSelected = selected.find((c) => c.class === cls.class);
    const updated = isSelected
      ? selected.filter((c) => c.class !== cls.class)
      : [...selected, cls];
    updateSetup({ classes: updated });
  };

  const handleSelectAll = () => {
    const all = [];
    for (const group of Object.values(data)) {
      for (const path of group.paths) {
        all.push(...path.path);
      }
    }
    updateSetup({ classes: all });
  };

  const handleReset = () => updateSetup({ classes: [] });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={handleSelectAll} className="px-4 py-1 rounded bg-green-600 text-white text-sm">
          Select All
        </button>
        <button onClick={handleReset} className="px-4 py-1 rounded bg-red-600 text-white text-sm">
          Clear
        </button>
      </div>

      {Object.entries(data).map(([base, { paths }]) => (
        <div key={base} className="mt-6">
          <h4 className="font-semibold text-blue-400 mb-2">{base}</h4>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {paths.flatMap((branch) =>
              branch.path.map((cls) => {
                const isSelected = selected.find((c) => c.class === cls.class);
                const stats = cls.stats || {};
                const meaningfulStats = Object.entries(stats).filter(([_, val]) => val !== 0);

                return (
                  <button
                    key={cls.class}
                    onClick={() => toggleClass(cls)}
                    className={`w-full text-left p-4 rounded-md border transition-all shadow-sm
                      ${
                        isSelected
                          ? "bg-blue-800 border-blue-400 text-white"
                          : "bg-zinc-900 border-zinc-700 text-white hover:border-blue-500"
                      }`}
                  >
                    <div className="font-semibold text-lg mb-2">{cls.class}</div>

                    {meaningfulStats.length > 0 && (
                      <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 text-white/80">
                        {meaningfulStats.map(([stat, value], i) => (
                          <div key={i} className="flex justify-between">
                            <span>{statLabels[stat] || stat}</span>
                            <span className="font-medium">{value}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
