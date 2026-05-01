import { getOrderTrackingInfo } from "@/utils";
import Actions from "./Actions";
import BuyAgain from "./BuyAgain";
import type { OrderExpanded, OrderItemExpanded } from "@/types";
import { getEndpointUrl } from "@/utils/api-endpoint";

export default function Product({
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
      <div className="product-image-container">
        <img src={getEndpointUrl(image)} />
      </div>

      <div className="product-details">
        <div className="product-name">{name}</div>
        <div className="product-delivery-date">
          {getOrderTrackingInfo(order, orderItem).subHeading}
        </div>
        <div className="product-quantity">Quantity: {quantity}</div>
        <BuyAgain product={product} quantity={quantity} />
      </div>

      <Actions order={order} productId={productId} />
    </>
  );
}
