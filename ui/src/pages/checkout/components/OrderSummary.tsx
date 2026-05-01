import CartItem from './ordersummary/CartItem.jsx';
import { useCheckoutContext } from '@/hooks/useCheckoutContext.js';

export default function OrderSummary() {
	const { cart } = useCheckoutContext();

	return (
		<div className='order-summary'>
			{cart.map((cartItem) => (
				<CartItem key={cartItem.id} cartItem={cartItem} />
			))}
		</div>
	);
}
