import { createContext, useState } from "react";

interface ToastProps {
  text: string;
  type?: "info" | "error";
}

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: ToastProps) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: React.PropsWithChildren) {
  const [toasts, setToasts] = useState([] as ToastProps[]);

  const addToast = (toast: ToastProps) => {
    setToasts([...toasts, toast]);
  };

  return <ToastContext.Provider value={{ toasts, addToast }}>{children}</ToastContext.Provider>;
}
