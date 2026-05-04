import { useCallback, useEffect, useState } from "react";
import { ToastData } from "@/types";
import { useToastSetter } from "@/hooks/useToastSetter";
import clsx from "clsx";

interface ToastProps {
  toast: ToastData | null;
}

interface ActiveToast extends ToastData {
  id: string;
}

const TYPE_CLASSES = {
  success: "border-l-[#10b981]",
  error: "border-l-[#ef4444]",
  info: "border-l-[#3b82f6]",
};

export default function Toast({ toast }: ToastProps) {
  const [activeToasts, setActiveToasts] = useState<ActiveToast[]>([]);
  const setToast = useToastSetter();

  useEffect(() => {
    if (toast) {
      const id = Math.random().toString(36).substring(2, 9);
      setActiveToasts((prev) => [...prev, { ...toast, id }]);
      setToast(null);
    }
  }, [toast, setToast]);

  const removeToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-1000 flex flex-col gap-3 pointer-events-none">
      {activeToasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ActiveToast;
  onRemove: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove();
    }, 300);
  }, [onRemove]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [handleClose]);

  const typeBorder = TYPE_CLASSES[toast.type || "info"];

  return (
    <div
      className={clsx(
        "min-w-[300px] max-w-[450px] px-5 py-4 rounded-xl flex items-center justify-between gap-3 pointer-events-auto",
        "bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/30 border-l-4",
        typeBorder,
        isExiting
          ? "animate-[toast-slide-out_0.3s_ease-in_forwards]"
          : "animate-[toast-slide-in_0.3s_ease-out_forwards]",
      )}
    >
      <div className="flex-1 text-sm font-medium text-[#1a1a1a] leading-[1.4]">
        {toast.message}
      </div>
      <button
        className="bg-transparent border-none p-1 cursor-pointer text-[#666] flex items-center justify-center rounded-md transition-all duration-200 hover:bg-black/5 hover:text-black"
        onClick={handleClose}
      >

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
