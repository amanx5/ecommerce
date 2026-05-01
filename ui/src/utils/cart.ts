import { CartItem } from '@/types';
import { apiRequest } from '@/utils/api';
import type { SetToast } from '@/context/ToastContext';

export const getCheckoutHeading = function (cart: CartItem[] | null): string {
	if (cart === null) {
		return 'Loading...';
	} else if (Array.isArray(cart)) {
		if (cart.length) {
			return 'Review your order';
		} else {
			return 'Cart is Empty!';
		}
	} else {
		return 'Failed to load cart.';
	}
};

export const getTotalCartItems = function (cart: CartItem[] | null): number {
	if (Array.isArray(cart)) {
		return cart.reduce((acc, curr) => (acc += curr.quantity), 0);
	} else {
		return 0;
	}
};

export interface AddToCartData {
	productId: string;
	quantity: number;
}

export const addNewCartItem = async function (
	data: AddToCartData,
	setToast: SetToast | false,
): Promise<boolean> {
	const response = await apiRequest<void>('/api/cartItems', {
		method: 'post',
		data,
	});

	const { message, success } = response;

	if (setToast) {
		setToast({
			message: message || 'Failed to add item to cart.',
			type: success ? 'success' : 'error',
		});
	}

	return success;
};

export const deleteCartItem = async function (
	productId: string,
	setToast: SetToast | false,
): Promise<boolean> {
	const response = await apiRequest(
		`/api/cartItems/${productId}`,
		{
			method: 'delete',
		},
		true,
	);

	const success = response.status === 204;

	if (setToast) {
		setToast({
			message: success
				? 'Item removed from cart.'
				: 'Failed to remove item from cart.',
			type: success ? 'success' : 'error',
		});
	}

	return success;
};

export const updateDeliveryOption = async function (
	deliveryOptionId: string,
	productId: string,
	setToast: SetToast | false,
): Promise<boolean> {
	const data = {
		deliveryOptionId,
	};

	const response = await apiRequest<void>(`/api/cartItems/${productId}`, {
		method: 'put',
		data,
	});

	const { message, success } = response;
	const toastMessage =
		message || success
			? 'Delivery option updated successfully.'
			: 'Failed to update delivery option.';
	const toastType = success ? 'success' : 'error';

	if (setToast) {
		setToast({
			message: toastMessage,
			type: toastType,
		});
	}

	return success;
};

export const placeOrder = async function (
	setToast: SetToast | false,
): Promise<boolean> {
	const response = await apiRequest<{ id: string }>('/api/orders', {
		method: 'post',
	});

	const { message, success } = response;
	const toastMessage =
		message || success
			? 'Order placed successfully.'
			: 'Failed to place order.';
	const toastType = success ? 'success' : 'error';

	if (setToast) {
		setToast({
			message: toastMessage,
			type: toastType,
		});
	}

	return success;
};
