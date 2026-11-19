"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse rounded-md bg-oj-gray-200 bg-[linear-gradient:90deg,#f5f5f5_40%,#e7e7e7_50%,#f5f5f5_60%] bg-[length:200%_100%]",
          className,
        )}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
