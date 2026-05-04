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
  DressIcon,
  HighHeelIcon,
  TShirtIcon,
  PantsIcon,
  SneakerIcon,
  WatchIcon,
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
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative">
        <CurrentIcon
          key={currentIconIndex}
          size={70}
          weight="fill"
          className="text-(--primary-green) animate-[splashIn_1s_cubic-bezier(0.175,0.885,0.32,1.275)]"
        />
      </div>
    </div>
  );
}
