import './App.css';
import HomePage from '@/pages/home/HomePage';
import CheckoutPage from '@/pages/checkout/CheckoutPage';
import OrdersPage from '@/pages/orders/OrdersPage';
import TrackingPage from '@/pages/tracking/TrackingPage';
import NotFoundPage from '@/pages/notfound/NotFoundPage';
import LoginPage from '@/pages/login/LoginPage';
import RegisterPage from '@/pages/register/RegisterPage';
import { AppContext, AppContextType } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import { refreshStateViaAPI } from '@/utils';
import { ToastData, type CartItemExpanded, type User } from '@/types';
import Toast from '@/components/Toast';

export default function App() {
	const [toast, setToast] = useState<ToastData | null>(null);
	const [cart, setCart] = useState<CartItemExpanded[]>([]);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		refreshStateViaAPI<User | null>('/api/auth/user', setUser, {
			setToast,
			when: 'onFailure',
		});
	}, []);

	useEffect(() => {
		if (user) {
			refreshStateViaAPI<CartItemExpanded[]>(
				'/api/cartItems?expand=product',
				setCart,
				{
					setToast,
					when: 'onFailure',
				},
			);
		} else {
			setCart([]);
		}
	}, [user]);

	const appContext: AppContextType = {
		cart,
		toast,
		user,
		setCart,
		setToast,
		setUser,
	};

	return (
		<AppContext.Provider value={appContext}>
			<Toast toast={toast} />
			<Routes>
				<Route index element={<HomePage />} />
				<Route path='checkout' element={<CheckoutPage />} />
				<Route path='orders' element={<OrdersPage />} />
				<Route path='tracking' element={<TrackingPage />} />
				<Route path='login' element={<LoginPage />} />
				<Route path='register' element={<RegisterPage />} />
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
		</AppContext.Provider>
	);
}
