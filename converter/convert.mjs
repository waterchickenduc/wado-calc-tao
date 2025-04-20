import fs from "fs";
import path from "path";

const rawDir = "./converter/raw";
const outputDir = "./frontend/src/data";

// 📁 Ensure the output folder exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log("📁 Created data directory:", outputDir);
}

// 💡 Utility: Clean numeric values
function cleanNumber(val) {
  if (!val) return 0;
  return parseFloat(val.toString().replace(",", ".").replace("%", "")) || 0;
}

// ✅ RUNE CONVERTER (flat stat list)
function convertRunes() {
  const raw = JSON.parse(fs.readFileSync(`${rawDir}/rune.json`, "utf-8"));
  const cleaned = raw.map((entry) => {
    const name = entry["Rune Name"];
    const runes = ["Rune 1 ", "Rune 2", "Rune 3", "Rune 4"]
      .map((k) => entry[k]?.trim())
      .filter(Boolean)
      .filter((r) => r !== "0%" && r !== "");

    const stats = Object.entries(entry)
      .filter(([key]) => !key.startsWith("Rune") && !["Rune Name", "Aura", "Aura Chance"].includes(key))
      .map(([key, value]) => ({
        Stat: key.trim(),
        Value: cleanNumber(value),
      }))
      .filter(({ Value }) => Value !== 0);

    // Normalize aura field
    const rawAura = entry["Aura"]?.trim().toLowerCase();
    const aura =
      !rawAura || rawAura === "none" || rawAura === "-" ? null : entry["Aura"].trim();

    return {
      name,
      runes,
      stats,
      aura,
      auraChance: cleanNumber(entry["Aura Chance"]),
    };
  });

  fs.writeFileSync(`${outputDir}/runes.json`, JSON.stringify(cleaned, null, 2));
  console.log(`✅ Wrote ${cleaned.length} runes to runes.json`);
}

// ✅ CLASS CONVERTER (flat stats in paths)
function convertClasses() {
  const raw = JSON.parse(fs.readFileSync(`${rawDir}/adventure_class.json`, "utf-8"));
  const output = {};

  for (const [baseClass, { paths }] of Object.entries(raw)) {
    output[baseClass] = {
      paths: paths.map((branch) => ({
        branch: branch.branch,
        path: branch.path.map((cls) => {
          const normalizedStats = {};
          for (const [statKey, statVal] of Object.entries(cls.stats || {})) {
            if (typeof statVal === "object" && statVal !== null) {
              normalizedStats[statKey.trim()] = cleanNumber(statVal.Value);
            } else {
              normalizedStats[statKey.trim()] = cleanNumber(statVal);
            }
          }

          return {
            class: cls.class,
            stats: normalizedStats,
          };
        }),
      })),
    };
  }

  fs.writeFileSync(`${outputDir}/adventureClasses.json`, JSON.stringify(output, null, 2));
  console.log("✅ Normalized adventure_class.json → adventureClasses.json");
}

// ✅ BUFF CONVERTER
function convertBuffs() {
  const raw = JSON.parse(fs.readFileSync(`${rawDir}/buff.json`, "utf-8"));
  const cleaned = raw.map((b) => {
    const out = {};
    for (const [key, value] of Object.entries(b)) {
      out[key.trim()] = cleanNumber(value);
    }
    return out;
  });

  fs.writeFileSync(`${outputDir}/buff.json`, JSON.stringify(cleaned, null, 2));
  console.log(`✅ Wrote ${cleaned.length} buffs to buff.json`);
}

// ✅ STATS CONVERTER
function convertStats() {
  const raw = JSON.parse(fs.readFileSync(`${rawDir}/stat.json`, "utf-8"));
  const sorted = raw.map((e) => e.Stat).sort();
  fs.writeFileSync(`${outputDir}/stat.json`, JSON.stringify(sorted, null, 2));
  console.log(`✅ Sorted and wrote ${sorted.length} stats to stat.json`);
}

// ✅ RUNE AURA CONVERTER
// ✅ RUNE AURA CONVERTER (🔥 patched for buildStatsSummary)
function convertAuras() {
  const raw = JSON.parse(fs.readFileSync(`${rawDir}/rune_aura.json`, "utf-8"));

  const cleaned = raw.map((entry) => {
    const name = entry["Aura"]?.trim();
    if (!name) return null;

    const stats = Object.entries(entry)
      .filter(([k, v]) => k !== "Aura" && v !== "0%" && v !== "0" && v !== "")
      .map(([Stat, Value]) => ({
        Stat: Stat.trim(),
        Value: cleanNumber(Value),
      }));

    return {
      name,
      trigger: 10, // default trigger chance unless you want to customize
      stats,
    };
  }).filter(Boolean); // remove nulls

  fs.writeFileSync(`${outputDir}/runeAuras.json`, JSON.stringify(cleaned, null, 2));
  console.log(`✅ Converted and saved ${cleaned.length} auras → runeAuras.json`);
}


// ✅ RUNE STONE CONVERTER
function convertStones() {
  const raw = JSON.parse(fs.readFileSync(`${rawDir}/rune_stone.json`, "utf-8"));
  const cleaned = raw.map((r) => {
    const out = {};
    for (const [k, v] of Object.entries(r)) {
      out[k.trim()] = typeof v === "string" ? v.trim() : v;
    }
    return out;
  });
  fs.writeFileSync(`${outputDir}/runeStones.json`, JSON.stringify(cleaned, null, 2));
  console.log(`✅ Wrote ${cleaned.length} rune stones to runeStones.json`);
}

// 🚀 Run All Conversions
convertRunes();
convertClasses();
convertBuffs();
convertStats();
convertAuras();
convertStones();
