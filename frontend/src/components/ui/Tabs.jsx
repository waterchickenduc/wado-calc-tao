import React from "react";
import { cn } from "../../lib/utils";

export default function Tabs({ tabs, active, onTabClick }) {
  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabClick(tab)}
          className={cn(
            "px-4 py-2 rounded-md text-sm",
            active === tab
              ? "bg-brand text-white"
              : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
