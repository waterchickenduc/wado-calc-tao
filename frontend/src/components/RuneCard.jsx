// frontend/src/components/RuneCard.jsx
import React from 'react';

function formatStatKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

export default function RuneCard({ rune }) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm bg-white max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-800">{rune.name}</h2>
        {rune.aura && (
          <span className="text-sm text-purple-600 font-semibold">
            🌀 Aura: {rune.aura} ({rune.auraChance}%)
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {rune.runes.map((stone, i) => (
          <span
            key={i}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm border border-gray-300"
          >
            🪨 {stone}
          </span>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left pb-1 border-b border-gray-200">Stat</th>
            <th className="text-right pb-1 border-b border-gray-200">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(rune.stats)
            .filter(([_, v]) => v !== 0)
            .map(([key, value], idx) => (
              <tr key={idx}>
                <td className="py-1 text-gray-700">{formatStatKey(key)}</td>
                <td className="py-1 text-right font-semibold text-blue-600">
                  {value}%
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
