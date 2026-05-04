import "./Splash.css";
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
    </div>
  )
}
