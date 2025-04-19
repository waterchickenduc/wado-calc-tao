import React, { useState } from "react";

export default function InfoPopover() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left ml-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-blue-400 underline"
      >
        ℹ How to use
      </button>
      {open && (
        <div className="absolute bg-zinc-900 border border-zinc-700 p-4 rounded shadow-md mt-2 w-[300px] text-sm z-50">
          <p className="mb-2 text-white">Search using logic:</p>
          <ul className="list-disc pl-4 text-white/80 space-y-1">
            <li><code>AND</code>, <code>OR</code> operators</li>
            <li>Group with <code>( )</code></li>
            <li>Match by name, stone, or stat</li>
            <li>Examples:</li>
            <li><code>(cr. rate AND jara)</code></li>
            <li><code>caissor OR (hp AND cr. dmg)</code></li>
          </ul>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-1 right-2 text-zinc-500 hover:text-red-500"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
