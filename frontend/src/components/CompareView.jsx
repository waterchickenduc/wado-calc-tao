import React from "react";

const statOrder = [
  "health", "p_atk", "p_def", "m_atk", "m_def",
  "ele_atk", "ele_def", "spirit_atk",
  "increase_str", "increase_agi", "increase_int",
  "cr_rate", "cr_dmg", "skill_cd", "atk_delay",
  "hp_recovery_per_kill", "hp_recovery", "movementspeed"
];

const statLabels = {
  health: "Health",
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
  movementspeed: "Movementspeed"
};

const CompareView = ({ builds }) => {
  if (!builds || builds.length === 0) return null;

  const maxValuePerStat = {};
  statOrder.forEach((stat) => {
    maxValuePerStat[stat] = Math.max(...builds.map((b) => b.stats?.[stat] || 0));
  });

  return (
    <div className="text-white mt-6">
      <h2 className="text-2xl font-bold mb-4">📊 Setup Comparison</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 px-4 py-2 text-left">Stat</th>
              {builds.map((b, idx) => (
                <th key={idx} className="border border-gray-700 px-4 py-2 text-center">
                  {b.name || `Setup ${idx + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {statOrder.map((stat) => (
              <tr key={stat}>
                <td className="border border-gray-700 px-4 py-2">{statLabels[stat]}</td>
                {builds.map((b, idx) => {
                  const value = b.stats?.[stat] || 0;
                  const isMax = value === maxValuePerStat[stat] && value !== 0;
                  return (
                    <td
                      key={idx}
                      className={`border px-4 py-2 text-center ${
                        isMax ? "text-green-400 font-bold" : "text-white"
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
};

export default CompareView;
