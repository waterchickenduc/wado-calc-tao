import React from "react";

const statOrder = [
  "health", "p_atk", "p_def", "m_atk", "m_def",
  "ele_atk", "ele_def", "spirit_atk",
  "increase_str", "increase_agi", "increase_int",
  "cr_rate", "cr_dmg", "skill_cd", "atk_delay",
  "hp_recovery_per_kill", "hp_recovery", "movementspeed"
];

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
  movementspeed: "Movementspeed"
};

export default function CompareView({ builds }) {
  if (!builds || builds.length === 0) return null;

  const maxValuePerStat = {};
  statOrder.forEach((stat) => {
    maxValuePerStat[stat] = Math.max(...builds.map((b) => b.stats?.[stat] || 0));
  });

  return (
    <div className="text-white mt-6 max-w-screen-xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">📊 Setup Comparison</h2>
      <div className="overflow-x-auto rounded-lg border border-[#1E293B] bg-[#020817]">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-[#1E293B]">
            <tr>
              <th className="border-b border-[#1E293B] px-4 py-2 text-left text-gray-300">
                Stat
              </th>
              {builds.map((b, idx) => (
                <th
                  key={idx}
                  className="border-b border-[#1E293B] px-4 py-2 text-center text-gray-300"
                >
                  {b.name || `Setup ${idx + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {statOrder.map((stat) => (
              <tr key={stat} className="hover:bg-[#1E293B] transition">
                <td className="px-4 py-2 text-gray-400 border-b border-[#1E293B]">
                  {statLabels[stat]}
                </td>
                {builds.map((b, idx) => {
                  const value = b.stats?.[stat] || 0;
                  const isMax = value === maxValuePerStat[stat] && value !== 0;
                  return (
                    <td
                      key={idx}
                      className={`px-4 py-2 text-center border-b border-[#1E293B] ${
                        isMax ? "text-green-400 font-semibold" : "text-white"
                      }`}
                    >
                      {value}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
