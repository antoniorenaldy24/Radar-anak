import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brutalist" | "organic";
  children: React.ReactNode;
}

export default function Button({
  variant = "brutalist",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "relative font-sans text-sm font-bold transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#121212]",
        // Bold Retro Brutalist Neon variant
        variant === "brutalist" &&
          "px-6 py-3 bg-[#FFFFFF] text-[#121212] border-[3px] border-[#121212] rounded-none shadow-[6px_6px_0px_0px_#121212] " +
            "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_0px_#121212] " +
            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#121212] " +
            "disabled:opacity-50 disabled:pointer-events-none",
        // Organic variant
        variant === "organic" &&
          "px-5 py-2.5 bg-accent text-[#FAF9F5] rounded-md border-[2px] border-[#121212] shadow-[3px_3px_0px_0px_#121212] " +
            "hover:opacity-90 active:scale-[0.98] " +
            "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
