import { CartItemExpanded } from "@/types";
import { getEndpointUrl } from "@/utils/api-endpoint";

interface TrackingProductProps {
  orderItem: CartItemExpanded;
}

export function TrackingProduct({ orderItem }: TrackingProductProps) {
  const { quantity, product } = orderItem;
  const { name, image } = product;

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <div className="font-bold mb-1 line-clamp-2">{name}</div>
      <div className="mb-1 text-gray-600">Quantity: {quantity}</div>
      <img
        className="max-w-[150px] max-h-[150px] mt-4 mb-8"
        src={getEndpointUrl(image)}
      />
    </div>
  );
}
