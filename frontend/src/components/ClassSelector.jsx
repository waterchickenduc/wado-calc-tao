// frontend/src/components/ClassSelector.jsx
import React from "react";
import adventureClasses from "../data/adventureClasses.json";

export default function ClassSelector({ selected = [], onChange }) {
  const toggleClass = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((cid) => cid !== id));
    } else {
      // 🧠 Allow only one class at a time
      onChange([id]);
    }
  };

  const grouped = adventureClasses.reduce((acc, cls, i) => {
    const key = `${cls.base} / ${cls.branch}`;
    const id = `${cls.base}-${cls.branch}-${cls.class}-${i}`;
    acc[key] = acc[key] || [];
    acc[key].push({ ...cls, id });
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Selected Class:{" "}
        {selected.length > 0 ? (
          <span className="text-blue-400 font-medium">{selected[0]}</span>
        ) : (
          <span className="italic text-zinc-500">None</span>
        )}
      </p>

      {Object.entries(grouped).map(([title, classes]) => (
        <div key={title}>
          <h3 className="text-blue-400 font-bold mb-2">{title}</h3>
          <div className="flex flex-wrap gap-2">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => toggleClass(cls.id)}
                className={`px-4 py-1 rounded-full text-sm font-medium border transition ${
                  selected.includes(cls.id)
                    ? "bg-blue-600 text-white border-blue-400"
                    : "bg-zinc-800 text-zinc-300 border-zinc-600 hover:bg-blue-800"
                }`}
              >
                {cls.class}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
