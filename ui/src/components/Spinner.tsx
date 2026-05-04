import type { ComponentProps } from "react";

export function Spinner({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      {...props}
      className={`inline-block size-2 border-[1.5px] border-black/15 border-t-[--header-bg] rounded-full animate-[spin_0.6s_linear_infinite] ${className}`}
    />
  );
}

export function SpinnerFullScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      <Spinner className="size-8" />
    </div>
  );
}

