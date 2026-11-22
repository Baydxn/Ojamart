"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, ...props }, ref) => {
    if (leftIcon) {
      return (
        <div className="relative flex items-center w-full">
          <div className="absolute left-3 flex items-center pointer-events-none text-oj-gray-600">
            {leftIcon}
          </div>
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-sm border-oj-border bg-white pl-10 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-oj-red disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-sm border-oj-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-oj-red disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex w-full rounded-sm border-oj-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-oj-red disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
