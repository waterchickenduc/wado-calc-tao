// Returns true if the given rune matches the filter tree
export function evaluateFilterExpressionAgainstRune(rune, node) {
    if (!node || !rune || !rune.stats) return true;
  
    // Leaf node: stat condition
    if (node.type === "stat") {
      return rune.stats.some((s) => s.Stat === node.value);
    }
  
    // Group node: evaluate children
    if (node.type === "group") {
      const results = node.children.map((child) =>
        evaluateFilterExpressionAgainstRune(rune, child)
      );
  
      return node.operator === "AND"
        ? results.every(Boolean)
        : results.some(Boolean);
    }
  
    return true;
  }
  