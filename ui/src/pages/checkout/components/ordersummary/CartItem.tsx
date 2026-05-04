import {ProductCheckout} from '@/pages/checkout/components/ordersummary/ProductCheckout';
import DeliveryDate from './DeliveryDate';
import DeliveryOptions from './DeliveryOptions';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS, refreshStateViaAPI } from '@/utils';
import type {
	CartItem,
	CartItemExpanded,
	DeliveryOptionExpanded,
} from '@/types';
import { useToastSetter } from '@/hooks/useToastSetter';

export default function CartItem({ cartItem }: { cartItem: CartItemExpanded }) {
	const setToast = useToastSetter();
	const [deliveryOptions, setDeliveryOptions] = useState<
		DeliveryOptionExpanded[]
	>([]);

	useEffect(() => {
		refreshStateViaAPI(
			API_ENDPOINTS.deliveryOptions.GETEXPANDED,
			setDeliveryOptions,
			{
				setToast,
				when: 'onFailure',
			},
		);
	}, [setToast]);

	return (
		<div className="cart-item-container">
			<DeliveryDate cartItem={cartItem} deliveryOptions={deliveryOptions} />
			<div className="cart-item-details-grid">
				<ProductCheckout cartItem={cartItem} />
				<DeliveryOptions
					cartItem={cartItem}
					deliveryOptions={deliveryOptions}
				/>
			</div>
		</div>
	);
}
