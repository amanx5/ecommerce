import { DeliveryDate } from "@/pages/checkout/components/ordersummary/DeliveryDate";
import { CheckoutProduct } from "@/pages/checkout/components/ordersummary/CheckoutProduct";
import { DeliveryOptions } from "@/pages/checkout/components/ordersummary/DeliveryOptions";
import { useEffect, useState } from "react";
import { API_ENDPOINTS, refreshStateViaAPI } from "@/utils";
import type {
  CartItem,
  CartItemExpanded,
  DeliveryOptionExpanded,
} from "@/types";

export default function CartItem({ cartItem }: { cartItem: CartItemExpanded }) {
  const [deliveryOptions, setDeliveryOptions] = useState<
    DeliveryOptionExpanded[]
  >([]);

  useEffect(() => {
    refreshStateViaAPI(
      API_ENDPOINTS.deliveryOptions.GETEXPANDED,
      setDeliveryOptions,
      {
        when: "onFailure",
      },
    );
  }, []);

  return (
    <div className="border border-[rgb(222,222,222)] rounded p-4.5 max-[400px]:p-3 mb-3">
      <DeliveryDate cartItem={cartItem} deliveryOptions={deliveryOptions} />
      <div className="grid grid-cols-[100px_1fr_1fr] gap-x-6.25 max-[1000px]:grid-cols-[100px_1fr] max-[400px]:grid-cols-[80px_1fr] max-[1000px]:gap-y-7.5 max-[400px]:gap-x-4">
        <CheckoutProduct cartItem={cartItem} />
        <DeliveryOptions
          cartItem={cartItem}
          deliveryOptions={deliveryOptions}
        />
      </div>
    </div>
  );
}

