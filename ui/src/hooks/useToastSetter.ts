import { useContext } from "react";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { ToastData } from "@/types";
export type ToastSetter = Dispatch<SetStateAction<ToastData | null>>;
export type ToastSetterContextType = ToastSetter | null;

export const ToastSetterContext = createContext<ToastSetterContextType>(null);

export function useToastSetter(): ToastSetter {
  const toastSetter = useContext(ToastSetterContext);

  if (!toastSetter) {
    throw new Error("useToastSetter must be used within ToastSetterProvider");
  }

  return toastSetter;
}
