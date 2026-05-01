import { UserContext, type Cart } from '@/context/UserContext';
import { useToast } from '@/hooks';
import type { User } from '@/types';
import { refreshStateViaAPI } from '@/utils';
import { useEffect, useState, type ReactNode } from 'react';

export function UserProvider({ children }: { children: ReactNode }) {
	const [cart, setCart] = useState<Cart>([]);
	const [user, setUser] = useState<User | null>(null);
	const { setToast } = useToast();

	useEffect(() => {
		refreshStateViaAPI<User | null>('/api/auth/user', setUser, {
			setToast,
			when: 'onFailure',
		});
	}, [setToast]);

	useEffect(() => {
		if (user) {
			refreshStateViaAPI<Cart>('/api/cartItems?expand=product', setCart, {
				setToast,
				when: 'onFailure',
			});
		} else {
			setCart([]);
		}
	}, [user, setToast]);

	return (
		<UserContext.Provider value={{ cart, user, setCart, setUser }}>
			{children}
		</UserContext.Provider>
	);
}
