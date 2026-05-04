import { deleteCartItem, getPriceNative, updateCart } from "@/utils";
import { useState } from "react";
import type { CartItemExpanded } from "@/types";
import { useRefreshCart } from "@/hooks/useCart";
import { useToastSetter } from "@/hooks/useToastSetter";
import { getEndpointUrl } from "@/utils/api-endpoint";

export function ProductCheckout({ cartItem }: { cartItem: CartItemExpanded }) {
  const [quantityInput, setQuantityInput] = useState(cartItem.quantity);
  const refreshCart = useRefreshCart();
  const setToast = useToastSetter();

  const { product, quantity } = cartItem;
  const { image, name, priceCents } = product;
  const productId = product.id;

  const price = getPriceNative(priceCents);
  const priceTotal = getPriceNative(priceCents * quantity);
  const priceTotalText = quantity > 1 ? `(Total: ${priceTotal})` : "";

  const updateCartItemQuantity = (quantity: number) => {
    if (quantity === 0) {
      deleteCartItem(productId, setToast, refreshCart);
    } else {
      updateCart(productId, { quantity }, setToast, refreshCart);
    }
  };

  return (
    <>
      <img className="product-image" src={getEndpointUrl(image)} />

      <div className="cart-item-details">
        <div className="product-name">{name}</div>
        <div className="product-price">
          <span className="one">{price}</span>
          <span className="total">{priceTotalText}</span>
        </div>
        <div className="product-quantity">
          <span>
            {"Quantity: "}
            <input
              className="add-quantity-input"
              type="number"
              value={quantityInput}
              onChange={(e) => setQuantityInput(parseInt(e.target.value))}
              onKeyDown={(e) => {
                if (e.key == "Enter") updateCartItemQuantity(quantityInput);
              }}
            />
          </span>

          <button
            className="update-quantity-link link-primary"
            disabled={quantityInput === quantity}
            onClick={() => updateCartItemQuantity(quantityInput)}
          >
            Update
          </button>

          <button
            className="delete-quantity-link link-primary"
            onClick={() => updateCartItemQuantity(0)}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
