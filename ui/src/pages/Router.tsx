import HomePage from '@/pages/home/HomePage';
import CheckoutPage from '@/pages/checkout/CheckoutPage';
import OrdersPage from '@/pages/orders/OrdersPage';
import TrackingPage from '@/pages/tracking/TrackingPage';
import NotFoundPage from '@/pages/notfound/NotFoundPage';
import LoginPage from '@/pages/login/LoginPage';
import RegisterPage from '@/pages/register/RegisterPage';
import { Routes, Route } from 'react-router';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export function Router() {
	useScrollToTop();

	return (
		<Routes>
			<Route index element={<HomePage />} />
			<Route path="checkout" element={<CheckoutPage />} />
			<Route path="orders" element={<OrdersPage />} />
			<Route path="tracking" element={<TrackingPage />} />
			<Route path="login" element={<LoginPage />} />
			<Route path="register" element={<RegisterPage />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}
