import { getEndpointUrl } from "@/utils/api-endpoint";
import { getPriceNative } from "@/utils/money";
import { useEffect, useState } from "react";
import type { CartItemExpanded } from "@/types";
import { useUpdateCartItem, useDeleteCartItem, useIsCartUpdating } from "@/hooks/cart";

export function CheckoutProduct({ cartItem }: { cartItem: CartItemExpanded }) {
  const [quantityInput, setQuantityInput] = useState(String(cartItem.quantity));
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: deleteItem } = useDeleteCartItem();

  const isPending = useIsCartUpdating();


  useEffect(() => {
    setQuantityInput(String(cartItem.quantity));
  }, [cartItem.quantity]);

  const { product, quantity } = cartItem;
  const { image, name, priceCents } = product;
  const productId = product.id;

  const price = getPriceNative(priceCents);
  const priceTotal = getPriceNative(priceCents * quantity);
  const priceTotalText = quantity > 1 ? `(Total: ${priceTotal})` : "";

  const handleUpdate = () => {
    const qty = parseInt(quantityInput);
    if (qty === 0) {
      deleteItem(productId);
    } else {
      updateItem({ productId, payload: { quantity: qty } });
    }
  };



  return (
    <>
      <div className="w-[100px] h-[100px] shrink-0 flex items-center justify-center">
        <img
          className="max-w-full max-h-full object-contain"
          src={getEndpointUrl(image)}
          alt={name}
        />
      </div>

      <div className={`cart-item-details ${isPending ? "opacity-50" : ""} mt-1`}>
        <div className="mb-4 flex flex-wrap items-baseline gap-x-2">
          <span className="font-bold text-lg text-[rgb(177,39,4)]">
            {price}
          </span>
          {priceTotalText && (
            <span className="text-sm text-gray-500 max-[400px]:text-xs">
              {priceTotalText}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 max-[400px]:gap-x-3 gap-y-2 mt-2">
          <div className="flex items-center gap-1.5 max-[400px]:gap-1">
            <span className="text-[15px] max-[400px]:text-sm">Quantity:</span>
            <input
              className="w-12 h-7 max-[400px]:w-10 max-[400px]:h-6 border border-gray-300 rounded px-1 text-center text-sm disabled:bg-gray-100"
              type="number"
              min="0"
              disabled={isPending}
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") handleUpdate();
              }}
            />
          </div>

          <div className="flex items-center gap-3 text-sm">
            <button
              className="link-primary font-medium disabled:opacity-50"
              disabled={
                isPending ||
                quantityInput === "" ||
                parseInt(quantityInput) === quantity
              }
              onClick={handleUpdate}
            >
              Update
            </button>
            <span className="text-gray-300">|</span>
            <button
              className="text-red-600 hover:text-red-700 active:text-red-800 font-medium cursor-pointer disabled:opacity-50"
              disabled={isPending}
              onClick={() => deleteItem(productId)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>


    </>
  );
}
