import Toast from "@/components/toast/Toast";
import { ToastSetterContext } from "@/hooks/useToastSetter";
import type { ToastData } from "@/types";
import { useState, type ReactNode } from "react";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  return (
    <ToastSetterContext.Provider value={setToast}>
      <Toast toast={toast} />
      {children}
    </ToastSetterContext.Provider>
  );
}
