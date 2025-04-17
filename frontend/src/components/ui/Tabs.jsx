import React, { useState } from "react";
import classNames from "../../lib/cn";

export function Tabs({ tabs, className = "", defaultIndex = 0, onChange }) {
  const [active, setActive] = useState(defaultIndex);

  const select = (i) => {
    setActive(i);
    onChange?.(i);
  };

  return (
    <div className={className}>
      <div className="flex space-x-2 border-b border-gray-700 mb-2">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={classNames(
              "px-4 py-2 text-sm rounded-t-md",
              i === active
                ? "bg-zinc-800 text-blue-400 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            )}
            onClick={() => select(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active]?.content}</div>
    </div>
  );
}
