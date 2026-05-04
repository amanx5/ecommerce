import { formatDate } from '@/utils';
import type { CartItem, DeliveryOptionExpanded } from '@/types';

export function DeliveryDate({
	cartItem,
	deliveryOptions,
}: {
	cartItem: CartItem;
	deliveryOptions: DeliveryOptionExpanded[];
}) {
	const selectedDeliveryOption = deliveryOptions.find(
		(deliveryOption) => deliveryOption?.id === cartItem?.deliveryOptionId,
	);

	if (!selectedDeliveryOption) {
		return null;
	}

	const { estimatedDeliveryTimeMs } = selectedDeliveryOption;

	return (
		<div className='text-[rgb(25,135,84)] font-bold text-[19px] max-[400px]:text-[17px] mt-1.25 mb-5.5 max-[400px]:mb-3'>
			Delivery date: {formatDate(estimatedDeliveryTimeMs)}
		</div>

	);
}
