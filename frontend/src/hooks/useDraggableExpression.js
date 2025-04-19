import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

/**
 * useDraggableExpression - A hook for managing stat/operator drag logic
 *
 * @returns {
 *   expression: array of items,
 *   addStat(label: string),
 *   addOperator(op: string),
 *   remove(id: string),
 *   move(oldIndex: number, newIndex: number),
 *   setExpression(newExpr: array)
 * }
 */
export default function useDraggableExpression() {
  const [expression, setExpression] = useState([]);

  const addStat = (label) => {
    const item = {
      id: `${Date.now()}-${label}`,
      type: "stat",
      label
    };
    setExpression((prev) => [...prev, item]);
  };

  const addOperator = (op) => {
    const item = {
      id: `${Date.now()}-${op}`,
      type: "op",
      label: op
    };
    setExpression((prev) => [...prev, item]);
  };

  const remove = (id) => {
    setExpression((prev) => prev.filter((item) => item.id !== id));
  };

  const move = (oldIndex, newIndex) => {
    setExpression((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  return {
    expression,
    addStat,
    addOperator,
    remove,
    move,
    setExpression
  };
}
