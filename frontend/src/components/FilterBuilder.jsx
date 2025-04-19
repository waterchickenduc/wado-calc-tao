import React from "react";
import statList from "../data/stat.json";
import { v4 as uuidv4 } from "uuid";

// Renders a recursive visual filter group
export default function FilterBuilder({ expression, onChange }) {
  const updateNode = (id, updater) => {
    const recurse = (node) => {
      if (node.id === id) return updater(node);
      if (node.children) {
        return {
          ...node,
          children: node.children.map(recurse),
        };
      }
      return node;
    };
    onChange(recurse(expression));
  };

  const removeNode = (id) => {
    const recurse = (node) => {
      if (!node.children) return node;
      return {
        ...node,
        children: node.children
          .map((child) =>
            child.id === id ? null : child.children ? recurse(child) : child
          )
          .filter(Boolean),
      };
    };
    onChange(recurse(expression));
  };

  const addStat = (id) => {
    updateNode(id, (node) => ({
      ...node,
      children: [
        ...node.children,
        { id: uuidv4(), type: "stat", value: statList[0] },
      ],
    }));
  };

  const addGroup = (id) => {
    updateNode(id, (node) => ({
      ...node,
      children: [
        ...node.children,
        {
          id: uuidv4(),
          type: "group",
          operator: "AND",
          children: [],
        },
      ],
    }));
  };

  const changeStat = (id, newValue) => {
    updateNode(id, (node) => ({
      ...node,
      value: newValue,
    }));
  };

  const changeOperator = (id, newOperator) => {
    updateNode(id, (node) => ({
      ...node,
      operator: newOperator,
    }));
  };

  const renderNode = (node, depth = 0) => {
    if (node.type === "group") {
      return (
        <div
          key={node.id}
          className={`border-l-4 pl-4 ml-2 mt-3 border-purple-500 space-y-2`}
        >
          <div className="flex items-center gap-2">
            <select
              value={node.operator}
              onChange={(e) => changeOperator(node.id, e.target.value)}
              className="bg-purple-700 text-white rounded px-2 py-1 text-xs"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
            <span className="text-xs text-purple-200">(group)</span>
            {depth > 0 && (
              <button
                onClick={() => removeNode(node.id)}
                className="ml-auto text-red-400 text-sm"
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-2">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addStat(node.id)}
              className="bg-blue-600 text-white px-2 py-1 text-xs rounded"
            >
              + Stat
            </button>
            <button
              onClick={() => addGroup(node.id)}
              className="bg-purple-600 text-white px-2 py-1 text-xs rounded"
            >
              + Group
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={node.id} className="flex items-center gap-2 ml-4">
        <select
          value={node.value}
          onChange={(e) => changeStat(node.id, e.target.value)}
          className="bg-zinc-700 text-white rounded px-2 py-1 text-sm"
        >
          {statList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={() => removeNode(node.id)}
          className="text-red-400 hover:text-red-600 text-sm"
        >
          ✕
        </button>
      </div>
    );
  };

  return <div className="space-y-2">{renderNode(expression)}</div>;
}
