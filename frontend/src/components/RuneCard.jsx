import React from "react";
import { Tooltip } from "react-tooltip";
import { twMerge } from "tailwind-merge";

export default function RuneCard({ rune, count = 0, onAdd, onRemove, isDisabled = false }) {
  const hasAura = rune?.aura;

  return (
    <div
      className={twMerge(
        "rounded-md border border-zinc-700 p-4 bg-zinc-800 relative shadow",
        onRemove && "bg-zinc-900"
      )}
    >
      {/* Name + Count */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 font-semibold text-blue-400 text-lg">
          {rune.name}
          {count > 1 && (
            <span className="text-xs bg-zinc-700 px-2 py-0.5 rounded-full text-white/80">
              ×{count}
            </span>
          )}
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-zinc-500 hover:text-red-500 text-lg"
            title="Remove one"
          >
            ×
          </button>
        )}
        {onAdd && !isDisabled && (
          <button
            onClick={onAdd}
            className="text-zinc-400 hover:text-green-400 text-lg"
            title="Add one"
          >
            +
          </button>
        )}
      </div>

      {/* Runes / Stones */}
      <div className="flex flex-wrap gap-1 mb-2">
        {rune.runes?.map((r, i) => (
          <span
            key={i}
            className="bg-zinc-700 text-white text-xs px-2 py-0.5 rounded-full"
          >
            {r}
          </span>
        ))}
      </div>

      {/* Aura */}
      {hasAura && (
        <div className="text-purple-400 text-xs mb-2">
          ✨ Aura: <span className="font-medium">{rune.aura}</span>
          {rune.auraChance ? ` (${rune.auraChance}%)` : null}
        </div>
      )}

      {/* Stats - 2 column grid */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-white/90">
        {rune.stats
          .filter(({ Value }) => Value !== 0)
          .map(({ Stat, Value }, i) => (
            <li key={i}>
              <span
                data-tooltip-id="tooltip"
                data-tooltip-content={Stat}
                className="cursor-help"
              >
                {Stat}:
              </span>{" "}
              <span className="font-semibold">
                {typeof Value === "number" ? `${Value}%` : Value}
              </span>
            </li>
          ))}
      </ul>

      <Tooltip id="tooltip" place="top" className="z-50" />
    </div>
  );
}
