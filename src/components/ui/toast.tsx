"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

interface ToastContent {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement<typeof ToastAction>;
  variant?: "default" | "destructive";
}

type ToasterToast = ToastContent & { id: string; duration?: number };

type ToastContextType = {
  toast: (content: ToastContent) => void;
  dismiss: (toastId?: string) => void;
};

const ToastContext = React.createContext<ToastContextType>({
  toast: () => {},
  dismiss: () => {},
});

type ToastAction =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: ToasterToast }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn("fixed top-0 z-[100] flex flex-col gap-4 p-6 sm:bottom-0 sm:right-0 sm:p-4 md:p-6", className)}
    {...props}
  />
));

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border bg-white p-3 text-sm shadow-lg transition-all", className)}
    {...props}
  />
));

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn("inline-flex items-center justify-center rounded-md bg-oj-red px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oj-red focus-visible:ring-offset-2", className)}
    {...props}
  />
));

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn("absolute right-2 top-2 rounded-sm p-1 text-oj-gray-800 opacity-0 transition-opacity group-hover/data-[state=open]:opacity-100", className)}
    {...props}
  />
));

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("font-semibold", className)} {...props} />
));

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-oj-gray-800", className)} {...props} />
));

const TOAST_LIMIT = 5;
let count = 0;
function genId() { count = (count + 1) % Number.MAX_SAFE_INTEGER; return count.toString(); }

function toastReducer(state: { toasts: ToasterToast[] }, action: ToastAction) {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case "UPDATE_TOAST":
      return { ...state, toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)) };
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toastId || action.toastId === undefined ? { ...t, open: false } : t)),
      };
    case "REMOVE_TOAST":
      return action.toastId === undefined
        ? { ...state, toasts: [] }
        : { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) };
    default:
      return state;
  }
}

function ToastProviderComponent({
  children,
  duration = 5000,
  ...props
}: { children: React.ReactNode; duration?: number } & React.ComponentProps<typeof ToastProvider>) {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] });

  const toast = ({ ...content }: ToastContent) => {
    const id = genId();
    dispatch({ type: "ADD_TOAST", toast: { id, duration, ...content } as ToasterToast });
    setTimeout(() => {
      dispatch({ type: "DISMISS_TOAST", toastId: id });
      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", toastId: id });
      }, 500);
    }, duration);
  };

  const dismiss = (toastId?: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId });
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", toastId });
    }, 500);
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      <ToastProvider duration={duration} {...props}>
        <ToastViewport>
          {state.toasts.map((t) => (
            <Toast key={t.id} id={t.id} duration={t.duration} onOpenChange={(open) => { if (!open) dismiss(t.id); }}>
              <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-1">
                {t.title && <ToastTitle>{t.title}</ToastTitle>}
                {t.description && <ToastDescription>{t.description}</ToastDescription>}
              </div>
              {t.action}
              <ToastClose />
            </Toast>
          ))}
        </ToastViewport>
        {children}
      </ToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}

export {
  ToastProviderComponent as ToastProvider,
  ToastProviderComponent,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
};
