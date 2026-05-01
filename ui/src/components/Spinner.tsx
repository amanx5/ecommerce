import type { ComponentProps } from "react";

export function Spinner({ className, ...props }: ComponentProps<"span">) {
  return <span {...props} className={`spinner ${className}`} />;
}

export function SpinnerFullScreen() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        height: "100%",
        justifyContent: "center"
      }}
    >
      <Spinner style={{ width: "32px", height: "32px" }} />
    </div>
  );
}
