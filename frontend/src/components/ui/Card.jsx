import React from "react";
import { cn } from "../../lib/utils";

export default function Card({ className = "", children }) {
  return (
    <div className={cn("bg-zinc-800 border border-zinc-700 rounded-lg p-4", className)}>
      {children}
    </div>
  );
}
