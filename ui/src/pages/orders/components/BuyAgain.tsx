import BuyAgainIcon from "@/assets/icons/buy-again.png";
import type { Product } from "@/types";
import { useCart, useRefreshCart } from "@/hooks/useCart";
import { useToastSetter } from "@/hooks/useToastSetter";
import { addCartItem } from "@/utils";

interface BuyAgainProps {
  product: Product;
  quantity: number;
}

export default function BuyAgain({ product }: BuyAgainProps) {
  const productId = product.id;
  const { data, isSuccess } = useCart();
  const refreshCart = useRefreshCart();
  const setToast = useToastSetter();

  if (!isSuccess) {
    return null;
  }

  const isAlreadyInCart = data.find((c) => c.product.id === productId);

  return (
    !isAlreadyInCart && (
      <button className="buy-again-button button-primary" onClick={add}>
        <img className="buy-again-icon" src={BuyAgainIcon} />
        <span className="buy-again-message">Add to Cart</span>
      </button>
    )
  );

  async function add() {
    await addCartItem({ productId, quantity: 1 }, setToast, refreshCart);
  }
}
