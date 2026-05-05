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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % SHOPPING_ICONS.length);
    }, 600);

    return () => clearInterval(interval);
  }, []);

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
