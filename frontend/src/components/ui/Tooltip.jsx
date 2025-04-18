import React, { useState } from "react";

export default function Tooltip({ children, text, position = "top" }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <div
          className={`absolute z-50 whitespace-nowrap text-xs bg-zinc-800 text-white px-2 py-1 rounded shadow-md
          ${position === "top" ? "bottom-full left-1/2 -translate-x-1/2 mb-1" : ""}
          ${position === "bottom" ? "top-full left-1/2 -translate-x-1/2 mt-1" : ""}
          ${position === "left" ? "right-full top-1/2 -translate-y-1/2 mr-1" : ""}
          ${position === "right" ? "left-full top-1/2 -translate-y-1/2 ml-1" : ""}`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
