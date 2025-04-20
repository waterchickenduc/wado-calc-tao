import runeAuraList from "../data/runeAuras.json";

/**
 * Aggregates stats from runes, auras, and classes into breakdowns.
 * - Injects auraStats directly into each rune
 */
export function buildStatsSummary(runes, classStats = {}) {
  const totalStats = {};
  const runeStats = {};
  const auraStats = {};

  for (const rune of runes) {
    // 🌟 Attach matching aura metadata
    if (rune.aura) {
      const matched = runeAuraList.find(
        (aura) => aura.name.toLowerCase() === rune.aura.toLowerCase()
      );
      if (matched) {
        rune.auraStats = matched.stats || [];
      } else {
        console.warn(`⚠️ No matching aura metadata found for: ${rune.aura}`);
        rune.auraStats = [];
      }
    } else {
      rune.auraStats = [];
    }

    // 🧮 Add RUNE stats
    for (const { Stat, Value } of rune.stats || []) {
      runeStats[Stat] = (runeStats[Stat] || 0) + Value;
    }

    // 🧮 Add AURA stats
    for (const { Stat, Value } of rune.auraStats || []) {
      auraStats[Stat] = (auraStats[Stat] || 0) + Value;
    }
  }

  // 🧮 Add CLASS stats
  const classStatTotals = {};
  for (const stat in classStats) {
    classStatTotals[stat] = classStats[stat];
  }

  // ✅ Compute TOTAL
  const totalSources = [runeStats, auraStats, classStatTotals];
  for (const src of totalSources) {
    for (const stat in src) {
      totalStats[stat] = (totalStats[stat] || 0) + src[stat];
    }
  }

  return {
    totalStats,
    runeStats,
    auraStats,
    classStats: classStatTotals,
  };
}
