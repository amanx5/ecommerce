import { useState } from "react";
import BuyAgainIcon from "@/assets/icons/buy-again.png";
import type { Product } from "@/types";
import { useCart, useAddToCart } from "@/hooks/cart";
import { Spinner } from "@/components/Spinner";
import CheckIcon from "@mui/icons-material/Check";

interface BuyAgainProps {
  product: Product;
  quantity: number;
}

export function BuyAgain({ product }: BuyAgainProps) {
  const productId = product.id;
  const { data: cart = [], isSuccess } = useCart();
  const { mutate, isPending } = useAddToCart();
  const [justAdded, setJustAdded] = useState(false);

  if (!isSuccess) {
    return null;
  }

  const isAlreadyInCart = cart.some((c) => c.productId === productId);

  // If already in cart and we didn't just add it ourselves, hide the button
  if (isAlreadyInCart && !justAdded) {
    return null;
  }

  return (
    <button
      className="text-sm w-[140px] h-9 rounded-[5px] flex items-center justify-center max-[800px]:mb-2.5 max-[450px]:w-full max-[450px]:mb-4 button-primary disabled:opacity-75 disabled:cursor-default transition-all duration-300"
      disabled={isPending || justAdded}
      onClick={() =>
        mutate({ productId, quantity: 1 }, { onSuccess: () => setJustAdded(true) })
      }
    >
      {isPending ? (
        <Spinner size={18} color="inherit" />
      ) : justAdded ? (
        <>
          <CheckIcon sx={{ fontSize: 18, mr: 1 }} />
          <span>Added</span>
        </>
      ) : (
        <>
          <img className="w-5 mr-2.5" src={BuyAgainIcon} />
          <span className="buy-again-message">Add to Cart</span>
        </>
      )}
    </button>
  );
}




