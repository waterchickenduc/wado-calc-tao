import React, { useState, useMemo } from "react";
import Button from "./Button";
import Input from "./Input";
import runeData from "../../data/runes.json";

export default function SetupSelector({ setups, active, onSelect, onAdd, onRename, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const filteredSetups = useMemo(() => setups.filter(Boolean), [setups]);

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center mb-4">
      {filteredSetups.map((setup, index) => {
        const isEditing = editId === setup.id;

        return (
          <div key={setup.id} className="flex items-center gap-1">
            {isEditing ? (
              <Input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => {
                  onRename(setup.id, renameValue);
                  setEditId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onRename(setup.id, renameValue);
                    setEditId(null);
                  }
                }}
                autoFocus
                className="px-2 py-1 text-sm"
              />
            ) : (
              <Button
                variant={active === index ? "default" : "outline"}
                onClick={() => onSelect(index)}
                onDoubleClick={() => {
                  setEditId(setup.id);
                  setRenameValue(setup.name);
                }}
              >
                {setup?.name || `Setup ${index + 1}`}
              </Button>
            )}
            <button
              onClick={() => onDelete(setup.id)}
              className="text-red-400 hover:text-red-600 text-sm ml-1"
              title="Delete setup"
            >
              🗑
            </button>
          </div>
        );
      })}
      <Button onClick={onAdd} variant="outline">
        ＋ New Setup
      </Button>
    </div>
  );
}
