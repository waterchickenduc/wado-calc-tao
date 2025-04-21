import React from "react";

export default function BuilderLayout({ left, middle, right }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1fr] gap-6 items-start">
      <div>{left}</div>
      <div>{middle}</div>
      <div className="w-full">{right}</div>
    </div>
  );
}
