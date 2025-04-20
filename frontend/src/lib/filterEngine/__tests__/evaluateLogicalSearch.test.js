import { evaluateLogicalSearch } from '../evaluate.js';


const mockRune = (name, runes, stats, aura = '') => ({
  name,
  runes,
  stats: stats.map(([Stat, Value]) => ({ Stat, Value })),
  aura,
});

describe('evaluateLogicalSearch()', () => {
  const runeA = mockRune('Toorpiz', ['Mehn', 'Jara'], [['Cr. Dmg', 4], ['Cr. Rate', 2]]);
  const runeB = mockRune('Menthe', ['Yhing', 'Feoh'], [['HP', 6]]);
  const runeC = mockRune('Concordia', ['Mehn'], [['Skill CD', 3]]);
  const runeD = mockRune('Secretuus', ['Geofa'], [['Cr. Rate', 5], ['M. Atk', 3]]);
  const runeE = mockRune('Grawammen', ['Mehn', 'Peroth'], [['Spirit ATK', 8], ['Cr. Dmg', 4]], 'Sanctuary');

  test('simple stat match', () => {
    expect(evaluateLogicalSearch('Cr. Dmg', runeA)).toBe(true);
    expect(evaluateLogicalSearch('Cr. Dmg', runeB)).toBe(false);
  });

  test('simple rune stone match', () => {
    expect(evaluateLogicalSearch('Mehn', runeA)).toBe(true);
    expect(evaluateLogicalSearch('Mehn', runeB)).toBe(false);
  });

  test('AND logic', () => {
    expect(evaluateLogicalSearch('Cr. Dmg AND Mehn', runeA)).toBe(true);
    expect(evaluateLogicalSearch('Cr. Dmg AND Mehn', runeD)).toBe(false);
  });

  test('OR logic', () => {
    expect(evaluateLogicalSearch('Cr. Dmg OR HP', runeA)).toBe(true);
    expect(evaluateLogicalSearch('Cr. Dmg OR HP', runeB)).toBe(true);
    expect(evaluateLogicalSearch('Cr. Dmg OR HP', runeD)).toBe(false);
  });

  test('grouped expression', () => {
    expect(evaluateLogicalSearch('(Cr. Dmg AND Mehn) OR HP', runeA)).toBe(true);
    expect(evaluateLogicalSearch('(Cr. Dmg AND Mehn) OR HP', runeB)).toBe(true);
    expect(evaluateLogicalSearch('(Cr. Dmg AND Mehn) OR HP', runeD)).toBe(false);
  });

  test('complex chain', () => {
    expect(evaluateLogicalSearch('Mehn AND Skill CD AND Cr. Dmg', runeC)).toBe(false);
    expect(evaluateLogicalSearch('Mehn AND Skill CD AND Cr. Dmg', runeE)).toBe(false);
  });

  test('exact match only', () => {
    expect(evaluateLogicalSearch('Crit Rate', runeA)).toBe(false); // should not match Cr. Rate
  });

  test('no crash on malformed query', () => {
    expect(() => evaluateLogicalSearch('(((((Cr. Dmg', runeA)).not.toThrow();
    expect(() => evaluateLogicalSearch('', runeA)).not.toThrow();
  });
  test('NOT operator', () => {
    expect(evaluateLogicalSearch('NOT Cr. Dmg', runeB)).toBe(true); // HP rune, no Cr. Dmg
    expect(evaluateLogicalSearch('NOT Cr. Dmg', runeA)).toBe(false); // Cr. Dmg is present
  });

  test('AND with NOT', () => {
    expect(evaluateLogicalSearch('Mehn AND NOT Cr. Dmg', runeC)).toBe(true);  // Mehn yes, Cr. Dmg no
    expect(evaluateLogicalSearch('Mehn AND NOT Cr. Dmg', runeA)).toBe(false); // Mehn yes, Cr. Dmg yes
  });

  test('NOT with group', () => {
    expect(evaluateLogicalSearch('NOT (Cr. Dmg OR HP)', runeD)).toBe(true);   // Has Cr. Rate, no Cr. Dmg or HP
    expect(evaluateLogicalSearch('NOT (Cr. Dmg OR HP)', runeA)).toBe(false);  // Has Cr. Dmg
    expect(evaluateLogicalSearch('NOT (Cr. Dmg OR HP)', runeB)).toBe(false);  // Has HP
  });

});
