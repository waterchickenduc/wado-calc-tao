const runes = require('../data/runes.json');

function searchRunes(query) {
  const { name, effect, stones } = query;

  return runes.filter(r => {
    const matchName = !name || r.name.toLowerCase().includes(name.toLowerCase());
    const matchEffect = !effect || r.effect.toLowerCase().includes(effect.toLowerCase());
    const matchStones = !stones || stones.every(s => r.stones.includes(s));
    return matchName && matchEffect && matchStones;
  });
}

module.exports = { searchRunes };
