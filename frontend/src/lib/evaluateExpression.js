export function evaluateExpression(tokens, rune) {
    const statSet = new Set(rune.stats.map(s => s.Stat.toLowerCase()));
  
    const ops = [];
    const vals = [];
  
    const precedence = {
      'AND': 2,
      'OR': 1,
    };
  
    const applyOp = () => {
      const op = ops.pop();
      const right = vals.pop();
      const left = vals.pop();
  
      if (op === 'AND') vals.push(left && right);
      if (op === 'OR') vals.push(left || right);
    };
  
    for (const token of tokens) {
      if (!token) continue;
      const type = token.type || 'stat';
      const value = token.value;
  
      if (value === '(') {
        ops.push(value);
      } else if (value === ')') {
        while (ops.length && ops[ops.length - 1] !== '(') {
          applyOp();
        }
        ops.pop(); // Remove '('
      } else if (type === 'operator') {
        while (
          ops.length &&
          precedence[ops[ops.length - 1]] >= precedence[value]
        ) {
          applyOp();
        }
        ops.push(value);
      } else if (type === 'stat') {
        vals.push(statSet.has(value.toLowerCase()));
      }
    }
  
    while (ops.length) applyOp();
  
    return vals[0] || false;
  }
  