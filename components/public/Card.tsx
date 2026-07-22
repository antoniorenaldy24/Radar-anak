import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "brutalist" | "organic";
  children: React.ReactNode;
}

export default function Card({
  variant = "brutalist",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "text-[#121212] transition-transform duration-200",
        // Bold Retro Brutalist Neon variant
        variant === "brutalist" &&
          "border-[3px] border-[#121212] rounded-none shadow-[6px_6px_0px_0px_#121212]",
        // Organic variant
        variant === "organic" &&
          "border-[2px] border-[#121212] rounded-md shadow-[4px_4px_0px_0px_#121212]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
