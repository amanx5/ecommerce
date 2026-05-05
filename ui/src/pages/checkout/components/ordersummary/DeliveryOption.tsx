import { formatDate } from "@/utils/date";
import { getPriceNative } from "@/utils/money";
import type { CartItem, DeliveryOptionExpanded } from "@/types";
import { useUpdateCartItem, useIsCartUpdating } from "@/hooks/cart";
import { useState, useEffect } from "react";

export function DeliveryOption({
  deliveryOption,
  cartItem,
}: {
  deliveryOption: DeliveryOptionExpanded;
  cartItem: CartItem;
}) {
  const { mutate: updateItem } = useUpdateCartItem();
  const isGlobalUpdating = useIsCartUpdating();
  const [optimisticChecked, setOptimisticChecked] = useState(false);

  const { productId, deliveryOptionId } = cartItem;
  const { id, priceCents, estimatedDeliveryTimeMs } = deliveryOption;

  const isActuallyChecked = id === deliveryOptionId;
  const isChecked = isGlobalUpdating ? optimisticChecked : isActuallyChecked;

  // Sync optimistic state when data arrives
  useEffect(() => {
    if (!isGlobalUpdating) {
      setOptimisticChecked(isActuallyChecked);
    }
  }, [isActuallyChecked, isGlobalUpdating]);


  const handleUpdate = () => {
    setOptimisticChecked(true);
    updateItem({ productId, payload: { deliveryOptionId: id } });
  };

  return (
    <label
      className={`grid grid-cols-[24px_1fr] mb-3 cursor-pointer ${isGlobalUpdating ? "opacity-50 pointer-events-none" : ""}`}
    >
      <input
        type="radio"
        className="mt-0.75 mr-1.25 cursor-pointer"
        name={`delivery-option-${productId}`}
        checked={isChecked}
        disabled={isGlobalUpdating}
        onChange={handleUpdate}
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


