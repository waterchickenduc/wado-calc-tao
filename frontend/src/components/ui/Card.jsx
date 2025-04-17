import React from "react";
import { cn } from "../../lib/utils";

export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={classNames(
        "rounded-lg border border-gray-700 bg-zinc-900 text-white shadow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
