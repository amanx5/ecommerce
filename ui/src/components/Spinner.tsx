import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import clsx from "clsx";

export function Spinner({ size = 16, sx, ...props }: CircularProgressProps) {
  return (
    <CircularProgress
      size={size}
      sx={{
        color: "inherit",
        ...sx,
      }}
      thickness={5}
      {...props}
    />
  );
}

export function SpinnerFullScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      <Spinner size={32} />
    </div>
  );
}
