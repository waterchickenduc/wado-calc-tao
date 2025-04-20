// src/lib/filterEngine/tokenize.js

export function tokenize(input) {
    const pattern = /(\bAND\b|\bOR\b|\bNOT\b|\(|\))/gi;
    return input
      .split(pattern)
      .map((token) => token.trim())
      .filter((token) => token.length > 0);
  }
  