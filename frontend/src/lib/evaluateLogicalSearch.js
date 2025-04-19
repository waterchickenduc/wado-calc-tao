export function evaluateLogicalSearch(query, rune) {
    if (!query?.trim()) return true;
  
    const lowerQuery = query.toLowerCase();
    const tokens = lowerQuery.match(/[\w.\-]+|[()]/g);
    if (!tokens) return true;
  
    const output = [];
    const ops = [];
  
    const precedence = { or: 1, and: 2 };
    const applyOp = () => {
      const op = ops.pop();
      const right = output.pop();
      const left = output.pop();
      if (op === "and") output.push(left && right);
      if (op === "or") output.push(left || right);
    };
  
    const match = (token) => {
      return (
        rune.name.toLowerCase().includes(token) ||
        rune.runes.some((r) => r.toLowerCase().includes(token)) ||
        rune.stats.some((s) => s.Stat.toLowerCase().includes(token))
      );
    };
  
    for (let token of tokens) {
      if (token === "(") {
        ops.push(token);
      } else if (token === ")") {
        while (ops.length && ops[ops.length - 1] !== "(") applyOp();
        ops.pop();
      } else if (token === "and" || token === "or") {
        while (
          ops.length &&
          precedence[ops[ops.length - 1]] >= precedence[token]
        ) {
          applyOp();
        }
        ops.push(token);
      } else {
        output.push(match(token));
      }
    }
  
    while (ops.length) applyOp();
    return output[0];
  }
  