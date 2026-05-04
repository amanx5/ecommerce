import BuyAgainIcon from "@/assets/icons/buy-again.png";
import type { Product } from "@/types";
import { useCart, useRefreshCart } from "@/hooks/useCart";
import { addCartItem } from "@/utils";

interface BuyAgainProps {
  product: Product;
  quantity: number;
}

export default function BuyAgain({ product }: BuyAgainProps) {
  const productId = product.id;
  const { data, isSuccess } = useCart();
  const refreshCart = useRefreshCart();

  if (!isSuccess) {
    return null;
  }

  const isAlreadyInCart = data.find((c) => c.product.id === productId);

  return (
    !isAlreadyInCart && (
      <button className="text-sm w-[140px] h-9 rounded-[5px] flex items-center justify-center max-[800px]:mb-2.5 max-[450px]:w-full max-[450px]:mb-4 button-primary" onClick={add}>
        <img className="w-5 mr-2.5" src={BuyAgainIcon} />
        <span className="buy-again-message">Add to Cart</span>
      </button>
    )
  );

  async function add() {
    await addCartItem({ productId, quantity: 1 }, refreshCart);
  }
}

