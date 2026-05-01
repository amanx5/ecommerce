import BuyAgainIcon from "@/assets/icons/buy-again.png";
import { addNewCartItem } from "@/utils";
import type { Product } from "@/types";
import { useCart, useRefreshCart } from "@/hooks/useCart";
import { useToastSetter } from "@/hooks/useToastSetter";

interface BuyAgainProps {
  product: Product;
  quantity: number;
}

export default function BuyAgain({ product }: BuyAgainProps) {
  const { id } = product;
  const { data, isSuccess } = useCart();
  const refreshCart = useRefreshCart();
  const setToast = useToastSetter();

  if (!isSuccess) {
    return null;
  }

  const isAlreadyInCart = data.find((cartItem) => cartItem.product.id === id);
  return (
    !isAlreadyInCart && (
      <button
        className="buy-again-button button-primary"
        onClick={addToCartOnClick}
      >
        <img className="buy-again-icon" src={BuyAgainIcon} />
        <span className="buy-again-message">Add to Cart</span>
      </button>
    )
  );

  async function addToCartOnClick() {
    const data = {
      productId: id,
      quantity: 1,
    };

    const isAdded = await addNewCartItem(data, setToast);
    if (isAdded) {
      await refreshCart();
    }
  }
}
