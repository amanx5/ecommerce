import { apiRequest, hitRequest } from "@/utils/api-request";
import type { ToastSetter } from "@/context/ToastSetterContext";
import type { Cart } from "@/hooks/useCart";

export const getTotalCartItems = function (cart: Cart): number {
  return cart.reduce((acc, curr) => (acc += curr.quantity), 0);
};

export async function getCart(): Promise<Cart> {
  const resp = await apiRequest<Cart>({
    endpoint: "/api/cartItems?expand=product",
  });

  if (resp.success && resp.data) {
    return resp.data;
  } else {
    throw new Error(resp.message);
  }
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export const addNewCartItem = async function (
  data: AddToCartData,
  setToast: ToastSetter | false,
): Promise<boolean> {
  const response = await apiRequest<void>({
    endpoint: "/api/cartItems",
    method: "post",
    payload: data,
  });

  const { message, success } = response;

  if (setToast) {
    setToast({
      message: message || "Failed to add item to cart.",
      type: success ? "success" : "error",
    });
  }

  return success;
};

export const deleteCartItem = async function (
  productId: string,
  setToast: ToastSetter | false,
): Promise<boolean> {
  const { response } = await hitRequest({
    endpoint: `/api/cartItems/${productId}`,
    method: "delete",
  });

  const success = response ? response.status === 204 : false;

  if (setToast) {
    const message = success
      ? "Item removed from cart."
      : "Failed to remove item from cart.";

    setToast({
      message,
      type: success ? "success" : "error",
    });
  }

  return success;
};

export const updateDeliveryOption = async function (
  deliveryOptionId: string,
  productId: string,
  setToast: ToastSetter | false,
): Promise<boolean> {
  const payload = {
    deliveryOptionId,
  };

  const response = await apiRequest<void>({
    endpoint: `/api/cartItems/${productId}`,
    method: "put",
    payload,
  });

  const { message, success } = response;
  const toastMessage =
    message || success
      ? "Delivery option updated successfully."
      : "Failed to update delivery option.";
  const toastType = success ? "success" : "error";

  if (setToast) {
    setToast({
      message: toastMessage,
      type: toastType,
    });
  }

  return success;
};

export const placeOrder = async function (
  setToast: ToastSetter | false,
): Promise<boolean> {
  const response = await apiRequest<{ id: string }>({
    endpoint: "/api/orders",
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
