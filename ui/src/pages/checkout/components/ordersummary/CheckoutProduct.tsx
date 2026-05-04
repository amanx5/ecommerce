import { deleteCartItem, getPriceNative, updateCart } from "@/utils";
import { useState } from "react";
import type { CartItemExpanded } from "@/types";
import { useRefreshCart } from "@/hooks/useCart";
import { getEndpointUrl } from "@/utils/api-endpoint";

export function CheckoutProduct({ cartItem }: { cartItem: CartItemExpanded }) {
  const [quantityInput, setQuantityInput] = useState(String(cartItem.quantity));
  const refreshCart = useRefreshCart();

  const { product, quantity } = cartItem;
  const { image, name, priceCents } = product;
  const productId = product.id;

  const price = getPriceNative(priceCents);
  const priceTotal = getPriceNative(priceCents * quantity);
  const priceTotalText = quantity > 1 ? `(Total: ${priceTotal})` : "";

  const updateCartItemQuantity = (quantityInput: string) => {
    const quantity = parseInt(quantityInput);
    if (quantity === 0) {
      deleteCartItem(productId, refreshCart);
    } else {
      updateCart(productId, { quantity }, refreshCart);
    }
  };


  return (
    <>
      <img
        className="max-w-full max-h-[120px] mx-auto"
        src={getEndpointUrl(image)}
      />

      <div className="cart-item-details">
        <div className="font-bold mb-1 line-clamp-2 text-base max-[400px]:text-sm leading-tight">
          {name}
        </div>
        <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2">
          <span className="font-bold text-[15px] max-[400px]:text-sm">
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
            <span className="text-sm max-[400px]:text-xs">Quantity:</span>
            <input
              className="w-12 h-7 max-[400px]:w-10 max-[400px]:h-6 border border-gray-300 rounded px-1 text-center text-sm"
              type="number"
              min="0"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") updateCartItemQuantity(quantityInput);
              }}
            />
          </div>

          <div className="flex items-center gap-3 text-sm">
            <button
              className="link-primary font-medium"
              disabled={
                quantityInput === "" || parseInt(quantityInput) === quantity
              }
              onClick={() => updateCartItemQuantity(quantityInput)}
            >
              Update
            </button>
            <span className="text-gray-300">|</span>
            <button
              className="text-red-600 hover:text-red-700 active:text-red-800 font-medium cursor-pointer disabled:opacity-50"
              onClick={() => updateCartItemQuantity("0")}
            >
              Delete
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
