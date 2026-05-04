import { formatDate, getPriceNative, updateCart } from "@/utils";
import type { CartItem, DeliveryOptionExpanded } from "@/types";
import { useRefreshCart } from "@/hooks/useCart";
import { useToastSetter } from "@/hooks/useToastSetter";

export default function DeliveryOption({
  deliveryOption,
  cartItem,
}: {
  deliveryOption: DeliveryOptionExpanded;
  cartItem: CartItem;
}) {
  const refreshCart = useRefreshCart();
  const setToast = useToastSetter();

  const { productId, deliveryOptionId } = cartItem;
  const { id, priceCents, estimatedDeliveryTimeMs } = deliveryOption;

  return (
    <label className="delivery-option">
      <input
        type="radio"
        className="delivery-option-input"
        name={`delivery-option-${productId}`}
        checked={id === deliveryOptionId}
        onChange={() =>
          updateCart(productId, { deliveryOptionId: id }, setToast, refreshCart)
        }
      />
      <div>
        <div className="delivery-option-date">
          {formatDate(estimatedDeliveryTimeMs)}
        </div>
        <div className="delivery-option-price">
          {priceCents ? getPriceNative(priceCents) : "FREE Shipping"}
        </div>
      </div>
    </label>
  );
}
