// src/lib/filterEngine/evaluate.js

import { tokenize } from './tokenize.js';

const normalize = (str) =>
  str.toLowerCase().replace(/[^\w.%\s-]/g, '').trim();

export function evaluateLogicalSearch(query, rune) {
  if (!query?.trim()) return true;

  const tokens = tokenize(query);
  if (!tokens.length) return true;

  const output = [];
  const ops = [];

  const precedence = { OR: 1, AND: 2, NOT: 3 };

  const applyOp = () => {
    const op = ops.pop();

    if (op === 'NOT') {
      const val = output.pop();
      output.push(!val);
    } else {
      const right = output.pop();
      const left = output.pop();
      if (op === 'AND') output.push(left && right);
      else if (op === 'OR') output.push(left || right);
    }
  };

  const match = (token) => {
    const t = normalize(token);

    const statMatch = Array.isArray(rune.stats) &&
      rune.stats.some((s) => normalize(s.Stat) === t);

    const runeStoneMatch = Array.isArray(rune.runes) &&
      rune.runes.some((r) => normalize(r) === t);

    const auraMatch =
      typeof rune.aura === 'string' && normalize(rune.aura) === t;

    return statMatch || runeStoneMatch || auraMatch;
  };

  for (let rawToken of tokens) {
    const token = rawToken.toUpperCase();

    if (token === '(') {
      ops.push(token);
    } else if (token === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') applyOp();
      ops.pop(); // remove '('
    } else if (token === 'AND' || token === 'OR' || token === 'NOT') {
      while (
        ops.length &&
        precedence[ops[ops.length - 1]] >= precedence[token]
      ) {
        applyOp();
      }
      ops.push(token);
    } else {
      output.push(match(rawToken));
    }
  }

  while (ops.length) applyOp();

  return output.length === 1 ? Boolean(output[0]) : false;
}
