import "./App.css";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ToastProvider } from "@/components/ToastProvider";
import { UserProvider } from "@/components/UserProvider";
import HomePage from "@/pages/home/HomePage";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import OrdersPage from "@/pages/orders/OrdersPage";
import TrackingPage from "@/pages/tracking/TrackingPage";
import NotFoundPage from "@/pages/notfound/NotFoundPage";
import LoginPage from "@/pages/login/LoginPage";
import RegisterPage from "@/pages/register/RegisterPage";
import { Routes, Route } from "react-router";

export default function App() {

  return (
    <ToastProvider>
			<UserProvider>
				<ScrollToTop />
				<Routes>
					<Route index element={<HomePage />} />
					<Route path="checkout" element={<CheckoutPage />} />
					<Route path="orders" element={<OrdersPage />} />
					<Route path="tracking" element={<TrackingPage />} />
					<Route path="login" element={<LoginPage />} />
					<Route path="register" element={<RegisterPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</UserProvider>
    </ToastProvider>
  );
}
