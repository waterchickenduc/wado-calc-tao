# 🧠 filterEngine

MMORPG-style logic parser for evaluating rune/class/stat conditions using logical expressions.

## Features

✔️ Case-insensitive stat/rune/aura search  
✔️ Supports `AND`, `OR`, `NOT`, and parentheses  
✔️ Handles multi-word terms like `Cr. Dmg`, `Skill CD`  
✔️ Fully tested with Vitest

---

## 📦 Usage

### `evaluateLogicalSearch(query, rune)`

```js
import { evaluateLogicalSearch } from './filterEngine';

const rune = {
  name: 'Toorpiz',
  runes: ['Mehn', 'Jara'],
  stats: [
    { Stat: 'Cr. Dmg', Value: 4 },
    { Stat: 'HP', Value: 0 },
  ],
  aura: 'Sanctuary',
};

evaluateLogicalSearch('Mehn AND NOT HP', rune);
// => true
