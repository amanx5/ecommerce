import { CartItemShimmer } from "@/pages/checkout/components/ordersummary/CartItemShimmer";
import { CartItem } from "@/pages/checkout/components/ordersummary/CartItem";
import { useCart, useIsCartUpdating } from "@/hooks/cart";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import { apiRequest } from "@/utils/api-request";
import { useQuery } from "@tanstack/react-query";
import type { DeliveryOptionExpanded } from "@/types";

export function OrderSummary() {
  const { data: cart } = useCart();
  const isGlobalUpdating = useIsCartUpdating();

  const { data: deliveryOptions } = useQuery({
    queryKey: ["deliveryOptions"],
    queryFn: async () => {
      const res = await apiRequest<DeliveryOptionExpanded[]>({
        endpoint: API_ENDPOINTS.deliveryOptions.GETEXPANDED,
      });
      return res.data || [];
    },
  });

  const isLoading = !cart || !deliveryOptions;

  if (isLoading) {
    return (
      <div className="order-summary">
        {Array.from({ length: 3 }).map((_, i) => (
          <CartItemShimmer key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`transition-opacity ${isGlobalUpdating ? "opacity-50" : "opacity-100"}`}>
      {cart.map((cartItem) => (
        <CartItem
          key={cartItem.id}
          cartItem={cartItem}
          deliveryOptions={deliveryOptions}
        />
      ))}
    </div>
  );
}
