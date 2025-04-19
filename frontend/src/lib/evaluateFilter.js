// This function evaluates nested filter expressions against rune stats
export function evaluateFilterExpression(expression, runeStats) {
    if (!expression) return true;
  
    const evaluate = (node) => {
      if (!node) return true;
  
      if (node.type === "group") {
        const results = node.children.map(evaluate);
        return node.operator === "AND"
          ? results.every(Boolean)
          : results.some(Boolean);
      }
  
      if (node.type === "stat") {
        const statName = node.value;
        return runeStats.some((s) => s.Stat === statName && s.Value !== 0);
      }
  
      return false;
    };
  
    return evaluate(expression);
  }
  