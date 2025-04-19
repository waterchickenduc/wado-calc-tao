import React from "react";
import statOrder from "../lib/statOrder";

export default function StatsSummary({ runeStats = {}, classStats = {}, auraStats = {}, auras = [] }) {
  const allKeys = new Set([
    ...Object.keys(runeStats),
    ...Object.keys(classStats),
    ...Object.keys(auraStats),
  ]);

  const combined = statOrder
    .filter((stat) => allKeys.has(stat))
    .map((stat) => ({
      name: stat,
      rune: runeStats[stat] || 0,
      class: classStats[stat] || 0,
      aura: auraStats[stat] || 0,
    }))
    .filter(({ rune, class: cls, aura }) => rune || cls || aura);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-md p-4 text-white w-full md:max-w-xs">
      <h3 className="text-white text-lg font-semibold mb-4">📊 Stats Summary</h3>
      <div className="grid grid-cols-4 gap-y-1 text-sm font-medium border-b border-zinc-700 pb-2 mb-2">
        <span className="col-span-1">Stat</span>
        <span className="text-right">Runes</span>
        <span className="text-right">Classes</span>
        <span className="text-right">Total</span>
      </div>

      <div className="grid grid-cols-4 gap-y-2 text-sm text-white/90">
        {combined.map(({ name, rune, class: cls, aura }) => (
          <React.Fragment key={name}>
            <span className="truncate" title={name}>{name}</span>
            <span className="text-right">{(rune || 0).toFixed(2)}%</span>
            <span className="text-right">{(cls || 0).toFixed(2)}%</span>
            <span className="text-right font-semibold">
              {(rune + cls + aura).toFixed(2)}%
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Aura effects section */}
      {auras?.length > 0 && (
        <div className="mt-6">
          <h4 className="text-purple-300 font-semibold mb-2">✨ Active Auras</h4>
          {auras.map((aura, index) => (
            <div key={index} className="mb-3">
              <div className="text-sm font-semibold text-purple-200 mb-1">
                {aura.name} <span className="text-xs text-white/60">×{aura.count}</span>
              </div>
              <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-1 text-white/90">
                {Object.entries(aura.stats)
                  .filter(([_, val]) => val !== 0)
                  .map(([stat, value], i) => (
                    <li key={i}>
                      {statLabel(stat)}:{" "}
                      <span className="font-semibold">{value}%</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 💡 Helper to map internal stat keys to readable format
function statLabel(key) {
  const map = {
    health: "HP",
    p_atk: "P. Atk",
    p_def: "P. Def",
    m_atk: "M. Atk",
    m_def: "M. Def",
    ele_atk: "Ele. Atk",
    ele_def: "Ele. Def",
    spirit_atk: "Spirit Atk",
    increase_str: "Increase STR",
    increase_agi: "Increase AGI",
    increase_int: "Increase INT",
    cr_rate: "Cr. Rate",
    cr_dmg: "Cr. Dmg",
    skill_cd: "Skill CD",
    atk_delay: "Atk Delay",
    hp_recovery_per_kill: "HP Recovery per Kill",
    hp_recovery: "HP Recovery",
    movementspeed: "Movementspeed",
  };
  return map[key] || key;
}
