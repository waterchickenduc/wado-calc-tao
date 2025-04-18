import React from "react";
import { cn } from "../../lib/utils";

export default function Button({
  children,
  type = "button",
  variant = "default",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-brand text-white hover:bg-brand-dark",
    outline: "border border-zinc-600 text-white hover:bg-zinc-800",
    ghost: "hover:bg-zinc-700 text-white",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      className={cn(base, variants[variant] || variants.default, className)}
      {...props}
    >
      {children}
    </button>
  );
}
