import React from 'react';
import adventureClasses from '../data/adventureClasses.json';

export default function ClassSelector({ selectedClasses, setSelectedClasses }) {
  const toggleClass = (id) => {
    if (selectedClasses.includes(id)) {
      setSelectedClasses(selectedClasses.filter(cid => cid !== id));
    } else {
      setSelectedClasses([...selectedClasses, id]);
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
    <div className="text-white">
      <p className="text-sm text-gray-400 mb-4">
        Selected Classes ({selectedClasses.length})
      </p>

      <div className="space-y-4">
        {Object.entries(grouped).map(([title, classes]) => (
          <div key={title}>
            <h3 className="font-semibold text-blue-400 mb-2">{title}</h3>
            <div className="flex flex-wrap gap-2">
              {classes.map((cls, idx) => (
                <button
                  key={cls.id}
                  onClick={() => toggleClass(cls.id)}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-all border ${
                    selectedClasses.includes(cls.id)
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-blue-800'
                  }`}
                >
                  {cls.class}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
