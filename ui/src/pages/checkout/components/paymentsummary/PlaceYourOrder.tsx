import { placeOrder, refreshStateViaAPI } from '@/utils';
import { useNavigate } from 'react-router';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';

export default function PlaceYourOrder() {
	const navigate = useNavigate();
	const { setCart } = useCart();
	const { setToast } = useToast();

	return (
		<button
			className='place-order-button button-primary'
			data-testid='place-order-button'
			onClick={placeOrderOnClick}
		>
			Place your order
		</button>
	);

	async function placeOrderOnClick(
		_event: React.MouseEvent<HTMLButtonElement>,
	) {
		const isOrderPlaced = await placeOrder(setToast);
		if (isOrderPlaced) {
			refreshStateViaAPI('/api/cartItems?expand=product', setCart, {
				setToast,
				when: 'onFailure',
			});

			navigate('/orders');
		} else {
			setToast({
				type: 'error',
				message: 'Failed to place order. Please try again.',
			});
		}
	}
}
