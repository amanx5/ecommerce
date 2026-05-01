import { useContext } from 'react';
import { UserContext, type Cart, type SetCart } from '@/context/UserContext';

export function useCart(): {
	cart: Cart;
	setCart: SetCart;
} {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useCart must be used within an UserProvider');
	}

	const { cart, setCart } = context;

	return {
		cart,
		setCart,
	};
}
