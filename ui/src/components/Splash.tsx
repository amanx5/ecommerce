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
    <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,rgba(25,135,84,0.1),transparent_34%),#fff]">
      <div
        className="relative flex items-center justify-center w-24 h-24 border border-[rgba(25,135,84,0.16)] rounded-full bg-[rgba(25,135,84,0.06)] shadow-[0_14px_35px_rgba(8,79,45,0.12)] after:absolute after:inset-[-7px] after:content-[''] after:border after:border-[rgba(25,135,84,0.16)] after:border-t-(--primary-green) after:rounded-full after:animate-spin"
        aria-label={`Loading ${SHOPPING_ICONS[currentIconIndex].label}`}
        role="status"
      >
        <CurrentIcon className="w-12 h-12 text-(--primary-green) animate-[iconPop_0.7s_ease-in-out_infinite]" />
      </div>
    </div>
  )
}
