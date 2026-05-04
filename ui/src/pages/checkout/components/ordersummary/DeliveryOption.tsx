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
    <label className="grid grid-cols-[24px_1fr] mb-3 cursor-pointer">
      <input
        type="radio"
        className="mt-0.75 mr-1.25 cursor-pointer"
        name={`delivery-option-${productId}`}
        checked={id === deliveryOptionId}
        onChange={() =>
          updateCart(productId, { deliveryOptionId: id }, setToast, refreshCart)
        }
      />
      <div>
        <div className="font-medium mb-0.75">
          {formatDate(estimatedDeliveryTimeMs)}
        </div>
        <div className="text-[rgb(120,120,120)] text-[15px]">
          {priceCents ? getPriceNative(priceCents) : "FREE Shipping"}
        </div>
      </div>
    </label>
  );
}
