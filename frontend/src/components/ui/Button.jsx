import React from "react";
import { cn } from "../../lib/utils";

export default function Button({ className = "", variant = "default", size = "default", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "outline" && "border border-gray-600 text-white hover:bg-gray-800",
        size === "default" && "h-10 px-4 py-2",
        className
      )}
      {...props}
    />
  );
}
