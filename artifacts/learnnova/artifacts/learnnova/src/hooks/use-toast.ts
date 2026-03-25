import { useState, useEffect, useCallback } from "react";

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  type?: "default" | "success" | "error";
  duration?: number;
};

let toastCount = 0;
const observers = new Set<(toasts: ToastProps[]) => void>();
let toasts: ToastProps[] = [];

const notify = () => observers.forEach((obs) => obs(toasts));

export function toast(props: Omit<ToastProps, "id">) {
  const id = (++toastCount).toString();
  const newToast = { ...props, id, duration: props.duration ?? 3000 };
  toasts = [...toasts, newToast];
  notify();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, newToast.duration);
}

export function useToast() {
  const [localToasts, setLocalToasts] = useState<ToastProps[]>(toasts);

  useEffect(() => {
    observers.add(setLocalToasts);
    return () => {
      observers.delete(setLocalToasts);
    };
  }, []);

  return { toasts: localToasts, toast };
}
