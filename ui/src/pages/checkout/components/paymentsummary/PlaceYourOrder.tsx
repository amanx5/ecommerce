import { placeOrder } from '@/utils';
import { useNavigate } from 'react-router';
import { useRefreshCart } from '@/hooks/useCart';
import { toast } from 'react-hot-toast';

export default function PlaceYourOrder() {
	const navigate = useNavigate();
	const refreshCart = useRefreshCart();

	return (
		<button
			className="w-full py-3 rounded-[5px] mt-5 mb-4.75 button-primary"
			data-testid="place-order-button"
			onClick={placeOrderOnClick}
		>
			Place your order
		</button>
	);

	async function placeOrderOnClick(
		_event: React.MouseEvent<HTMLButtonElement>,
	) {
		const isOrderPlaced = await placeOrder();
		if (isOrderPlaced) {
			await refreshCart();
			navigate('/orders');
		} else {
			toast.error('Failed to place order. Please try again.');
		}
	}
}

