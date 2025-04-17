import React from 'react';

const statKeys = [
  'health', 'p_atk', 'p_def', 'm_atk', 'm_def',
  'ele_atk', 'ele_def', 'spirit_atk',
  'increase_str', 'increase_agi', 'increase_int',
  'cr_rate', 'cr_dmg', 'skill_cd', 'atk_delay',
  'hp_recovery_per_kill', 'hp_recovery', 'movementspeed',
];

const displayNames = {
  health: 'Health',
  p_atk: 'P. Atk',
  p_def: 'P. Def',
  m_atk: 'M. Atk',
  m_def: 'M. Def',
  ele_atk: 'Ele. Atk',
  ele_def: 'Ele. Def',
  spirit_atk: 'Spirit Atk',
  increase_str: 'Increase STR',
  increase_agi: 'Increase AGI',
  increase_int: 'Increase INT',
  cr_rate: 'Crit Rate',
  cr_dmg: 'Crit Dmg',
  skill_cd: 'Skill CD',
  atk_delay: 'Atk Delay',
  hp_recovery_per_kill: 'HP Recovery / Kill',
  hp_recovery: 'HP Recovery',
  movementspeed: 'Movement Speed',
};

function sumStats(items) {
  const total = {};
  statKeys.forEach((key) => (total[key] = 0));
  items.forEach((item) => {
    const stats = item.stats || {};
    statKeys.forEach((key) => {
      total[key] += Number(stats[key] || 0);
    });
  });
  return total;
}

export default function StatsSummary({ runes, classes }) {
  const total = sumStats([...runes, ...classes]);

  return (
    <div className="text-sm space-y-1">
      {statKeys.map((key) => (
        <div key={key} className="flex justify-between">
          <span className="text-gray-400">{displayNames[key]}</span>
          <span className="font-mono text-right">{total[key].toFixed(2)}%</span>
        </div>
      ))}
    </div>
  );
}
