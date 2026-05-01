import {
  formatDate,
  getPriceNative,
  refreshStateViaAPI,
  updateDeliveryOption,
} from "@/utils";
import type { CartItem, DeliveryOptionExpanded } from "@/types";
import { useCheckoutContext } from "@/hooks/useCheckoutContext";
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
  const { setPaymentSummary } = useCheckoutContext();

  const { productId, deliveryOptionId } = cartItem;
  const { id, priceCents, estimatedDeliveryTimeMs } = deliveryOption;

  return (
    <label className="delivery-option">
      <input
        type="radio"
        className="delivery-option-input"
        name={`delivery-option-${productId}`}
        checked={id === deliveryOptionId}
        onChange={deliveryOptionOnChange}
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

  async function deliveryOptionOnChange(
    _event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const isUpdated = await updateDeliveryOption(id, productId, setToast);
    if (isUpdated) {
      await refreshCart();
      await refreshStateViaAPI("/api/paymentSummary", setPaymentSummary, {
        setToast,
        when: "onFailure",
      });
    }
  }
}
