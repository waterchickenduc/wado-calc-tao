import { describe, test, expect } from 'vitest';
import { evaluateLogicalSearch } from '../evaluate.js';

const mockRune = (name, runes, stats, aura = '') => ({
  name,
  runes,
  stats: stats.map(([Stat, Value]) => ({ Stat, Value })),
  aura,
});

const runeA = mockRune('Rabhor', ['Beorc', 'Jara', 'Mehn'], [['Cr. Rate', 5], ['HP', 6]]);
const runeB = mockRune('Despero', ['Beorc', 'Jara', 'Mehn'], [['Cr. Dmg', 4], ['HP', 8]]);
const runeC = mockRune('Menthe', ['Yhing'], [['HP', 4]]);
const runeD = mockRune('Toorpiz', ['Jara'], [['Skill CD', 2]]);
const runeE = mockRune('Piettas', ['Mehn'], [['Cr. Dmg', 6], ['Skill CD', 2]]);

describe('evaluateLogicalSearch()', () => {
  test('simple stat match', () => {
    expect(evaluateLogicalSearch('Cr. Rate', runeA)).toBe(true);
    expect(evaluateLogicalSearch('Cr. Dmg', runeA)).toBe(false);
  });

  test('simple rune stone match', () => {
    expect(evaluateLogicalSearch('Mehn', runeA)).toBe(true);
    expect(evaluateLogicalSearch('Mehn', runeC)).toBe(false);
  });

  test('AND logic', () => {
    expect(evaluateLogicalSearch('Cr. Rate AND Mehn', runeA)).toBe(true);
    expect(evaluateLogicalSearch('Cr. Rate AND Mehn', runeC)).toBe(false);
  });

  test('OR logic', () => {
    expect(evaluateLogicalSearch('Cr. Dmg OR HP', runeA)).toBe(true);
    expect(evaluateLogicalSearch('Cr. Dmg OR HP', runeB)).toBe(true);
    expect(evaluateLogicalSearch('Cr. Dmg OR HP', runeC)).toBe(true);
  });

  test('grouped expression', () => {
    expect(evaluateLogicalSearch('(Cr. Rate AND Mehn) OR HP', runeA)).toBe(true);
    expect(evaluateLogicalSearch('(Cr. Dmg AND Mehn) OR HP', runeB)).toBe(true);
    expect(evaluateLogicalSearch('(Cr. Dmg AND Mehn) OR HP', runeC)).toBe(true);
  });

  test('complex chain', () => {
    expect(evaluateLogicalSearch('Mehn AND Skill CD AND Cr. Dmg', runeE)).toBe(true);
    expect(evaluateLogicalSearch('Mehn AND Skill CD AND Cr. Dmg', runeC)).toBe(false);
  });

  test('exact match only', () => {
    expect(evaluateLogicalSearch('Crit Rate', runeA)).toBe(false); // no such stat
  });

  test('no crash on malformed query', () => {
    expect(() => evaluateLogicalSearch('(', runeA)).not.toThrow();
    expect(() => evaluateLogicalSearch(')', runeA)).not.toThrow();
  });

  // 🚨 NEW: NOT operator support
  test('NOT operator', () => {
    expect(evaluateLogicalSearch('NOT Cr. Dmg', runeA)).toBe(true);
    expect(evaluateLogicalSearch('NOT Cr. Dmg', runeB)).toBe(false);
  });

  test('AND with NOT', () => {
    expect(evaluateLogicalSearch('Mehn AND NOT Despero', runeA)).toBe(true);
    expect(evaluateLogicalSearch('Mehn AND NOT Despero', runeB)).toBe(false);
  });

  test('NOT with group', () => {
    expect(evaluateLogicalSearch('NOT (Cr. Dmg OR Despero)', runeA)).toBe(true);
    expect(evaluateLogicalSearch('NOT (Cr. Dmg OR Despero)', runeB)).toBe(false);
  });
});
