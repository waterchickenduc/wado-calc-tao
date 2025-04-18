import React from "react";
import { cn } from "../../lib/utils";

export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={cn(
        "bg-zinc-800 text-white px-3 py-2 text-sm rounded-md border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
    />
  );
}
