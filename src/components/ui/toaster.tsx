"use client";

import * as React from "react";
import { ToastProviderComponent, ToastViewport } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function Toaster({ position = "bottom-right" }: { position?: string } = {}) {
  return (
    <ToastProviderComponent>
      <ToastViewport
        className={cn(
          "fixed z-[100] flex gap-4 p-6 sm:bottom-0 sm:right-0 sm:top-auto sm:p-4 md:gap-5 md:p-6",
          position === "bottom-right"
            ? "bottom-0 right-0 top-auto left-auto"
            : position === "top-right"
            ? "top-0 right-0 bottom-auto left-auto"
            : position === "bottom-left"
            ? "bottom-0 left-0 top-auto right-auto"
            : "top-0 left-0 bottom-auto right-auto",
        )}
      />
    </ToastProviderComponent>
  );
}
