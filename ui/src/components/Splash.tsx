import { useEffect, useState } from 'react'
import CheckroomIcon from '@mui/icons-material/Checkroom'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StorefrontIcon from '@mui/icons-material/Storefront'

const SHOPPING_ICONS = [
  { Icon: StorefrontIcon, label: 'Shop' },
  { Icon: ShoppingCartIcon, label: 'Cart' },
  { Icon: LocalMallIcon, label: 'Bag' },
  { Icon: CheckroomIcon, label: 'Apparel' },
  { Icon: Inventory2Icon, label: 'Product' },
  { Icon: ReceiptLongIcon, label: 'Orders' },
  { Icon: SearchIcon, label: 'Search' },
]

export function Splash() {
  const [currentIconIndex, setCurrentIconIndex] = useState(() =>
    Math.floor(Math.random() * SHOPPING_ICONS.length)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => {
        const nextIndex = Math.floor(Math.random() * SHOPPING_ICONS.length)

        return nextIndex === prev
          ? (nextIndex + 1) % SHOPPING_ICONS.length
          : nextIndex
      })
    }, 700)

    return () => clearInterval(interval)
  }, [])

  const CurrentIcon = SHOPPING_ICONS[currentIconIndex].Icon

  return (
    <div className="splash-container">
      <div
        className="loading-icon-wrapper"
        aria-label={`Loading ${SHOPPING_ICONS[currentIconIndex].label}`}
        role="status"
      >
        <CurrentIcon className="loading-icon" />
      </div>

      <style>{`
        .splash-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background:
            radial-gradient(circle at center, rgba(25, 135, 84, 0.1), transparent 34%),
            rgb(255, 255, 255);
        }

        .loading-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 96px;
          height: 96px;
          border: 1px solid rgba(25, 135, 84, 0.16);
          border-radius: 50%;
          background: rgba(25, 135, 84, 0.06);
          box-shadow: 0 14px 35px rgba(8, 79, 45, 0.12);
        }

        .loading-icon-wrapper::after {
          position: absolute;
          inset: -7px;
          content: '';
          border: 1px solid rgba(25, 135, 84, 0.16);
          border-top-color: var(--primary-green);
          border-radius: 50%;
          animation: splashSpin 1s linear infinite;
        }

        .loading-icon {
          width: 48px;
          height: 48px;
          color: var(--primary-green);
          animation: iconPop 0.7s ease-in-out infinite;
        }

        @keyframes iconPop {
          0% {
            transform: scale(0.9);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes splashSpin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
