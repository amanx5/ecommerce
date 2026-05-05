import { getOrderTrackingInfo } from "@/utils/order";
import { Actions } from "./Actions";
import { BuyAgain } from "./BuyAgain";
import type { OrderExpanded, OrderItemExpanded } from "@/types";
import { getEndpointUrl } from "@/utils/api-endpoint";

export function OrderProduct({
  order,
  orderItem,
}: {
  order: OrderExpanded;
  orderItem: OrderItemExpanded;
}) {
  const { product, quantity } = orderItem;
  const { id: productId, name, image } = product;

  return (
    <>
      <div className="text-center max-[450px]:mb-6">
        <img
          className="max-w-[110px] max-h-[110px] max-[450px]:max-w-[150px] max-[450px]:max-h-[150px]"
          src={getEndpointUrl(image)}
        />
      </div>

      <div className="product-details">
        <div className="font-bold mb-1 max-[450px]:mb-2.5 line-clamp-2">
          {name}
        </div>
        <div className="mb-0.5">
          {getOrderTrackingInfo(order, orderItem).subHeading}
        </div>
        <div className="mb-2 max-[450px]:mb-4">Quantity: {quantity}</div>
        <BuyAgain product={product} quantity={quantity} />
      </div>

      <Actions order={order} productId={productId} />
    </>
  );
}
