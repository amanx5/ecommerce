import { CheckoutProduct } from "@/pages/checkout/components/ordersummary/CheckoutProduct";
import { DeliveryOption } from "./DeliveryOption";
import type { CartItemExpanded, DeliveryOptionExpanded } from "@/types";
import { useIsCartUpdating } from "@/hooks/cart";

export function CartItem({
  cartItem,
  deliveryOptions,
}: {
  cartItem: CartItemExpanded;
  deliveryOptions: DeliveryOptionExpanded[];
}) {
  const isGlobalUpdating = useIsCartUpdating();
  const { product } = cartItem;

  return (
    <div className="border border-[rgb(222,222,222)] rounded p-4.5 max-[400px]:p-3 mb-3">
      <div
        className={`font-bold text-[19px] max-[400px]:text-[17px] mt-1.25 mb-5.5 max-[400px]:mb-3 line-clamp-1 transition-opacity ${isGlobalUpdating ? "opacity-50" : "opacity-100"}`}
      >
        {product.name}
      </div>
      <div className="grid grid-cols-[1fr_320px] gap-x-8 max-[700px]:grid-cols-1 max-[700px]:gap-y-8">
        {/* Product & Quantity Cluster */}
        <div className="flex gap-x-6 max-[500px]:flex-col max-[500px]:gap-y-4">
          <CheckoutProduct cartItem={cartItem} />
        </div>

        {/* Delivery Options Section */}
        <div className="border-l border-gray-100 pl-8 max-[700px]:border-l-0 max-[700px]:pl-0 max-[700px]:border-t max-[700px]:pt-6">
          <div className="font-bold mb-3 text-[15px]">
            Choose a delivery option:
          </div>

          {deliveryOptions.map((deliveryOption) => (
            <DeliveryOption
              key={deliveryOption.id}
              cartItem={cartItem}
              deliveryOption={deliveryOption}
            />
          ))}
        </div>
      </div>

    </div>
  );
}




