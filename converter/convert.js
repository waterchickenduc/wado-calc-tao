const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.resolve(__dirname, '../raw');
const OUTPUT_DIR = path.resolve(__dirname, '../frontend/src/data');

// Helpers
const normalize = (str) =>
  str.toLowerCase().replace(/\s+/g, '_').replace(/\./g, '').replace(/[^a-z0-9_]/g, '');

const parsePercent = (val) => {
  if (typeof val !== 'string') return 0;
  const num = val.replace(',', '.').replace('%', '').trim();
  return parseFloat(num) || 0;
};

// Convert runes
const convertRunes = () => {
  const raw = require(path.join(SOURCE_DIR, 'rune.json'));

  const runes = raw.map((entry) => {
    const stats = {};
    Object.entries(entry).forEach(([key, value]) => {
      const normKey = normalize(key);
      if (normKey.startsWith('rune_')) return;
      if (['rune_name', 'aura', 'aurachance'].includes(normKey)) return;

      stats[normKey] = parsePercent(value);
    });

    return {
      name: entry['Rune Name'],
      runes: [entry['Rune 1'], entry['Rune 2'], entry['Rune 3'], entry['Rune 4']].filter(Boolean),
      stats,
      aura: entry['Aura'] || null,
      auraChance: parsePercent(entry['Aura Chance']),
    };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'runes.json'), JSON.stringify(runes, null, 2));
  console.log(`✔️ Converted ${runes.length} runes`);
};

// Convert adventure classes
const convertClasses = () => {
  const raw = require(path.join(SOURCE_DIR, 'adventure_class.json'));

  const paths = raw.Adventurer.paths.map((branch) => ({
    branch: branch.branch,
    path: branch.path.map((cls) => ({
      class: cls.class,
      stats: Object.fromEntries(
        Object.entries(cls.stats || {}).map(([k, v]) => [normalize(k), parsePercent(v)])
      ),
    })),
  }));

  const output = {
    Adventurer: {
      description: raw.Adventurer.description,
      paths,
    },
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'adventureClasses.json'), JSON.stringify(output, null, 2));
  console.log(`✔️ Converted adventure classes`);
};

// Convert auras
const convertAuras = () => {
  const raw = require(path.join(SOURCE_DIR, 'rune_aura.json'));

  const auras = raw.map((aura) => {
    const stats = {};
    Object.entries(aura).forEach(([k, v]) => {
      if (k === 'Aura') return;
      stats[normalize(k)] = parsePercent(v);
    });

    return {
      name: aura.Aura,
      stats,
    };
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'auraEffects.json'), JSON.stringify(auras, null, 2));
  console.log(`✔️ Converted auraEffects`);
};

// Convert runestones
const convertRunestones = () => {
  const raw = require(path.join(SOURCE_DIR, 'rune_stone.json'));
  const stones = raw.map((r) => r.Runestone);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'runeStones.json'), JSON.stringify(stones, null, 2));
  console.log(`✔️ Converted runeStones`);
};

// Convert stats list
const convertStats = () => {
  const raw = require(path.join(SOURCE_DIR, 'stat.json'));
  const stats = raw.map((s) => ({
    Stat: s.Stat,
    key: normalize(s.Stat),
  }));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'stat.json'), JSON.stringify(stats, null, 2));
  console.log(`✔️ Converted stat.json`);
};

// RUN ALL
const runAll = () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  convertRunes();
  convertClasses();
  convertAuras();
  convertRunestones();
  convertStats();
};

runAll();
