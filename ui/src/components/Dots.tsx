import clsx from "clsx";

interface DotsProps {
  className?: string;
}

export function Dots({ className }: DotsProps) {
  return (
    <span className={clsx("flex items-center gap-0.5", className)}>
      <span className="size-1 bg-current rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.3s]" />
      <span className="size-1 bg-current rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.15s]" />
      <span className="size-1 bg-current rounded-full animate-bounce [animation-duration:0.8s]" />
    </span>
  );
}
