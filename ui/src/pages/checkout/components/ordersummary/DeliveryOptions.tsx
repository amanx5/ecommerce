import DeliveryOption from './DeliveryOption';
import type { CartItemExpanded, DeliveryOptionExpanded } from '@/types';

export function DeliveryOptions({
	cartItem,
	deliveryOptions,
}: {
	cartItem: CartItemExpanded;
	deliveryOptions: DeliveryOptionExpanded[];
}) {
	return (
		<div className='max-[1000px]:col-span-2'>
			<div className='font-bold mb-2.5'>
				Choose a delivery option:
			</div>

			{deliveryOptions.map((deliveryOption) => (
				<DeliveryOption
					key={deliveryOption.id}
					cartItem={cartItem}
					deliveryOption={deliveryOption}
				/>
			))}
		</div>
	);
}
