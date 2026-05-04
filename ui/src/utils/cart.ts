import { apiRequest, hitRequest } from "@/utils/api-request";
import type { ToastSetter } from "@/hooks/useToastSetter";
import type { Cart, RefreshCart } from "@/hooks/useCart";
import { API_ENDPOINTS } from "@/utils/api-endpoint";

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
  setToast: ToastSetter | false,
  refreshCart: RefreshCart,
): Promise<boolean> {
  const response = await apiRequest<void>({
    endpoint: API_ENDPOINTS.cart.POST,
    method: "post",
    payload,
  });

  const { message, success } = response;

  if (setToast && !success) {
    setToast({
      message: message || "Failed to add item to cart.",
      type: "error",
    });
  }

  await refreshCart();
  return success;
};

export const deleteCartItem = async function (
  productId: string,
  setToast: ToastSetter,
  refreshCart: RefreshCart,

): Promise<boolean> {
  const { response } = await hitRequest({
    endpoint: API_ENDPOINTS.cart.DELETE(productId),
    method: "delete",
  });

  const success = response ? response.status === 204 : false;

  if (!success) {
    if (setToast) {
      setToast({
        message: "Failed to remove item from cart.",
        type: "error",
      });
    }

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
  setToast: ToastSetter,
  refreshCart: RefreshCart,
) {
  const { message, success } = await apiRequest<void>({
    endpoint: API_ENDPOINTS.cart.PUT(productId),
    method: "put",
    payload,
  });

  if (!success) {
    setToast({
      message: message || "Failed to update cart.",
      type: "error",
    });

    return false;
  }

  await refreshCart();
  return true;
}

export const placeOrder = async function (
  setToast: ToastSetter | false,
): Promise<boolean> {
  const response = await apiRequest<{ id: string }>({
    endpoint: API_ENDPOINTS.orders.POST,
    method: "post",
  });

  const { message, success } = response;
  const toastMessage =
    message || success
      ? "Order placed successfully."
      : "Failed to place order.";
  const toastType = success ? "success" : "error";

  if (setToast) {
    setToast({
      message: toastMessage,
      type: toastType,
    });
  }

  return success;
};
