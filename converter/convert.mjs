import fs from "fs";
import path from "path";

const rawDir = "./converter/raw";
const outputDir = "./frontend/src/data";

// 📁 Ensure the output folder exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log("📁 Created data directory:", outputDir);
}

function cleanNumber(val) {
  if (!val) return 0;
  return parseFloat(val.toString().replace(",", ".").replace("%", "")) || 0;
}

// ✅ RUNE CONVERTER
function convertRunes() {
  const raw = JSON.parse(fs.readFileSync(`${rawDir}/rune.json`, "utf-8"));
  const cleaned = raw.map((entry) => {
    const name = entry["Rune Name"];
    const runes = ["Rune 1 ", "Rune 2", "Rune 3", "Rune 4"]
      .map((k) => entry[k]?.trim())
      .filter(Boolean)
      .filter((r) => r !== "0%" && r !== "");

    const stats = {};
    for (const [key, value] of Object.entries(entry)) {
      if (key.startsWith("Rune") || key === "Rune Name" || key === "Aura" || key === "Aura Chance") continue;
      stats[key.trim()] = cleanNumber(value);
    }

    return {
      name,
      runes,
      stats,
      aura: entry["Aura"]?.trim() || null,
      auraChance: cleanNumber(entry["Aura Chance"])
    };
  });

  fs.writeFileSync(`${outputDir}/runes.json`, JSON.stringify(cleaned, null, 2));
  console.log(`✅ Wrote ${cleaned.length} runes to runes.json`);
}

// ✅ CLASS CONVERTER
function convertClasses() {
  const raw = JSON.parse(fs.readFileSync(`${rawDir}/adventure_class.json`, "utf-8"));
  const output = {};

  for (const [baseClass, { paths }] of Object.entries(raw)) {
    output[baseClass] = {
      paths: paths.map((branch) => ({
        branch: branch.branch,
        path: branch.path.map((cls) => {
          const stats = {};
          for (const [key, value] of Object.entries(cls.stats || {})) {
            stats[key.trim()] = cleanNumber(value);
          }
          return {
            class: cls.class,
            stats
          };
        })
      }))
    };
  }

  fs.writeFileSync(`${outputDir}/adventureClasses.json`, JSON.stringify(output, null, 2));
  console.log("✅ Converted adventure_class.json → adventureClasses.json");
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
  raw.sort((a, b) => a.Stat.localeCompare(b.Stat));
  fs.writeFileSync(`${outputDir}/stat.json`, JSON.stringify(raw, null, 2));
  console.log(`✅ Sorted and wrote ${raw.length} stats to stat.json`);
}

// ✅ RUNE AURA CONVERTER
function convertAuras() {
  const raw = JSON.parse(fs.readFileSync(`${rawDir}/rune_aura.json`, "utf-8"));
  const cleaned = raw.map((r) => {
    const out = {};
    for (const [k, v] of Object.entries(r)) {
      out[k.trim()] = typeof v === "string" ? v.trim() : cleanNumber(v);
    }
    return out;
  });
  fs.writeFileSync(`${outputDir}/runeAuras.json`, JSON.stringify(cleaned, null, 2));
  console.log(`✅ Wrote ${cleaned.length} auras to runeAuras.json`);
}

// ✅ RUNE STONES CONVERTER
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

// 🚀 Run all
convertRunes();
convertClasses();
convertBuffs();
convertStats();
convertAuras();
convertStones();
