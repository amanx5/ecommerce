import { placeOrder } from '@/utils';
import { useNavigate } from 'react-router';
import { useRefreshCart } from '@/hooks/useCart';
import { useToastSetter } from '@/hooks/useToastSetter';

export default function PlaceYourOrder() {
	const navigate = useNavigate();
	const refreshCart = useRefreshCart();
	const setToast = useToastSetter();

	return (
		<button
			className="place-order-button button-primary"
			data-testid="place-order-button"
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
			await refreshCart();

			navigate('/orders');
		} else {
			setToast({
				type: 'error',
				message: 'Failed to place order. Please try again.',
			});
		}
	}
}
