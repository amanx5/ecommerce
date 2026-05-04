import { apiRequest, hitRequest } from "@/utils/api-request";
import type { Cart, RefreshCart } from "@/hooks/useCart";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import { toast } from "react-hot-toast";

export const getTotalCartItems = function (cart: Cart): number {
  return cart.reduce((acc, curr) => (acc += curr.quantity), 0);
};

export async function getCart(): Promise<Cart> {
  const resp = await apiRequest<Cart>({
    endpoint: API_ENDPOINTS.cart.GETEXPANDED,
  });

  if (resp.success && resp.data) {
    return resp.data;
  } else {
    throw new Error(resp.message);
  }
}

type AddCartItemPayload = {
  productId: string;
  quantity: number;
};

export const addCartItem = async function (
  payload: AddCartItemPayload,
  refreshCart: RefreshCart,
): Promise<boolean> {
  const response = await apiRequest<void>({
    endpoint: API_ENDPOINTS.cart.POST,
    method: "post",
    payload,
  });

  const { message, success } = response;

  if (!success) {
    toast.error(message || "Failed to add item to cart.");
  }

  await refreshCart();
  return success;
};

export const deleteCartItem = async function (
  productId: string,
  refreshCart: RefreshCart,
): Promise<boolean> {
  const { response } = await hitRequest({
    endpoint: API_ENDPOINTS.cart.DELETE(productId),
    method: "delete",
  });

  const success = response ? response.status === 204 : false;

  if (!success) {
    toast.error("Failed to remove item from cart.");
    return false;
  }

  await refreshCart();
  return true;
};

type UpdateCartItemPayload = {
  quantity?: number;
  deliveryOptionId?: string;
};

export async function updateCart(
  productId: string,
  payload: UpdateCartItemPayload,
  refreshCart: RefreshCart,
) {
  const { message, success } = await apiRequest<void>({
    endpoint: API_ENDPOINTS.cart.PUT(productId),
    method: "put",
    payload,
  });

  if (!success) {
    toast.error(message || "Failed to update cart.");
    return false;
  }

  await refreshCart();
  return true;
}

export const placeOrder = async function (): Promise<boolean> {
  const response = await apiRequest<{ id: string }>({
    endpoint: API_ENDPOINTS.orders.POST,
    method: "post",
  });

  const { message, success } = response;
  const toastMessage =
    message || (success ? "Order placed successfully." : "Failed to place order.");

  if (success) {
    toast.success(toastMessage);
  } else {
    toast.error(toastMessage);
  }

  return success;
};

