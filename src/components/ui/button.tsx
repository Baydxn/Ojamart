"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oj-red focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            default: "bg-oj-red text-white hover:bg-oj-red-hover active:bg-oj-red-hover",
            destructive:
              "bg-red-600 text-white hover:bg-red-700",
            outline:
              "border border-oj-border bg-transparent hover:bg-oj-gray-100",
            ghost:
              "bg-transparent hover:bg-oj-gray-100 hover:text-oj-black",
            link:
              "text-oj-red underline-offset-4 hover:underline",
          },
          {
            sm: "h-8 px-3 text-xs",
            default: "h-10 px-4 py-2",
            lg: "h-11 px-8 text-base",
          },
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
