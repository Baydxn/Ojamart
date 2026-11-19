"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
          {
            default: "border-oj-border bg-white text-oj-black-soft",
            secondary: "border-oj-border bg-oj-gray-100 text-oj-black-soft",
            success: "border-green-100 bg-green-50 text-green-800",
            warning: "border-amber-100 bg-amber-50 text-amber-800",
            destructive: "border-red-100 bg-red-50 text-red-800",
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";

export { Badge };
