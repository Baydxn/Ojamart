import { useToast as useToastBase } from "@/components/ui/toast";

export type ToastContent = Parameters<ReturnType<typeof useToastBase>["toast"]>[0];

export function useToast() {
  return useToastBase();
}
