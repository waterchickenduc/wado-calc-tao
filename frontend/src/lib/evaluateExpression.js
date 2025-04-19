export function evaluateExpression(expression, statsArray = []) {
  const statSet = new Set(statsArray.map((s) => s.Stat?.toLowerCase()));
  const expr = expression.map((t) => {
    if (t.type === "stat") return statSet.has(t.value.toLowerCase());
    return t.value;
  });

  const stack = [];
  for (let token of expr) {
    if (token === "AND") {
      const b = stack.pop(), a = stack.pop();
      stack.push(Boolean(a && b));
    } else if (token === "OR") {
      const b = stack.pop(), a = stack.pop();
      stack.push(Boolean(a || b));
    } else {
      stack.push(token);
    }
  }

  return Boolean(stack[0]);
}
