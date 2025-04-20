import runeAuraList from "../data/runeAuras.json";

// Build combined stats from runes + class + auras
export function buildStatsSummary(runes, classStats = {}) {
  const totalStats = {};
  const runeStats = {};
  const auraStats = {};
  const auraBuckets = {}; // grouped by aura type

  runes.forEach((rune) => {
    rune?.stats?.forEach(({ Stat, Value }) => {
      runeStats[Stat] = (runeStats[Stat] || 0) + Value;
      totalStats[Stat] = (totalStats[Stat] || 0) + Value;
    });

    // 👇 Handle Auras
    const auraName = rune.aura;
    if (!auraName) return;

    const auraMeta = runeAuraList.find(
      (a) => a.name && auraName && a.name.toLowerCase() === auraName.toLowerCase()
    );

    if (!auraMeta || !auraMeta.stats) {
      console.warn(`⚠️ No matching aura metadata found for: ${auraName}`);
      return;
    }

    if (!auraBuckets[auraName]) {
      auraBuckets[auraName] = { trigger: 0, stats: {} };
    }

    const triggerChance = parseFloat((parseFloat(auraMeta.trigger) || 0).toFixed(2));
    auraBuckets[auraName].trigger += triggerChance;

    auraMeta.stats.forEach(({ Stat, Value }) => {
      const effective = parseFloat(((Value * (triggerChance / 100))).toFixed(4));
      auraBuckets[auraName].stats[Stat] = (auraBuckets[auraName].stats[Stat] || 0) + effective;
      auraStats[Stat] = (auraStats[Stat] || 0) + effective;
      totalStats[Stat] = (totalStats[Stat] || 0) + effective;
    });
  });

  // Class Stats
  Object.entries(classStats).forEach(([Stat, Value]) => {
    totalStats[Stat] = (totalStats[Stat] || 0) + Value;
  });

  return {
    totalStats,
    runeStats,
    auraStats,
    auraBuckets,
    classStats,
  };
}
