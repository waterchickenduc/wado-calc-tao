import React from "react";
import { evaluateExpression } from "../utils/evaluateExpression";

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function FilterBar({
  expression,
  onExpressionChange,
  statList,
}) {
  const addStat = (stat) => {
    const updated = [
      ...expression,
      { id: generateId(), type: "stat", value: stat },
    ];
    onExpressionChange(updated);
  };

  const addOperator = (op) => {
    const updated = [
      ...expression,
      { id: generateId(), type: "operator", value: op },
    ];
    onExpressionChange(updated);
  };

  const removeToken = (id) => {
    onExpressionChange(expression.filter((token) => token.id !== id));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          onChange={(e) => {
            if (e.target.value) addStat(e.target.value);
            e.target.selectedIndex = 0;
          }}
          className="px-2 py-1 rounded bg-zinc-700 text-white"
        >
          <option value="">➕ Add stat filter</option>
          {statList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            if (e.target.value) addOperator(e.target.value);
            e.target.selectedIndex = 0;
          }}
          className="px-2 py-1 rounded bg-zinc-700 text-white"
        >
          <option value="">➕ Add operator</option>
          <option value="AND">AND</option>
          <option value="OR">OR</option>
          <option value="(">(</option>
          <option value=")">)</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {expression.map((token) => (
          <div
            key={token.id}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm shadow ${
              token.type === "stat"
                ? "bg-blue-600 text-white"
                : "bg-purple-700 text-white"
            }`}
          >
            {token.value}
            <button
              onClick={() => removeToken(token.id)}
              className="text-xs hover:text-red-300"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
