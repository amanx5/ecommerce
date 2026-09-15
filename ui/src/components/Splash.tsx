import { useEffect, useState } from "react";
import {
  DressIcon,
  HighHeelIcon,
  TShirtIcon,
  PantsIcon,
  SneakerIcon,
  WatchIcon,
  HandbagIcon,
} from "@phosphor-icons/react";

const SHOPPING_ICONS = [
  TShirtIcon, 
  PantsIcon,
  SneakerIcon,
  WatchIcon,
  DressIcon,
  HighHeelIcon,
  HandbagIcon,
];

export function Splash() {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [show, setShow] = useState(false);

  // In warm loads, we dont need splash since the healthcheck instantly finishes
  // and the splash icons gets visible for only few ms, which looks like a flicker.
  // Plain white screen is better in such scenario, so we delay the first icon by 500ms
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % SHOPPING_ICONS.length);
    }, 600);
    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  const CurrentIcon = SHOPPING_ICONS[currentIconIndex];

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-6">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-32 w-32 animate-ping rounded-full bg-emerald-50/50" />
        <CurrentIcon
          key={currentIconIndex}
          size={80}
          weight="duotone"
          className="relative text-emerald-600 animate-[splashIn_0.8s_cubic-bezier(0.175,0.885,0.32,1.275)]"
        />
      </div>
    </div>
  );
}
