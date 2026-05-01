import { CheckoutContext } from '@/context/CheckoutContext';
import { PaymentSummaryData } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useToastSetter } from '@/hooks/useToastSetter';
import './CheckoutPage.css';
import PaymentSummary from './components/PaymentSummary';
import OrderSummary from './components/OrderSummary';
import CheckoutHeader from './CheckoutHeader';
import { refreshStateViaAPI } from '@/utils';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
	const cartQuery = useCart();
	const setToast = useToastSetter();
	const [paymentSummary, setPaymentSummary] =
		useState<PaymentSummaryData | null>(null);

	useEffect(() => {
		refreshStateViaAPI<PaymentSummaryData | null>(
			'/api/paymentSummary',
			setPaymentSummary,
			{
				setToast,
				when: 'onFailure',
			},
		);
	}, [setToast]);

	if (!cartQuery.isSuccess) {
		return "Loading";
	}

	const cart = cartQuery.data;

	const pageTitle = cart.length ? 'Review Your Order' : 'Cart is Empty!';

	return (
		<>
			{/* head */}
			<title>Checkout</title>

			{/* body */}
			<CheckoutContext.Provider
				value={{ cart, paymentSummary, setPaymentSummary }}
			>
				<CheckoutHeader />

				<div className="checkout-page">
					<div className="page-title">{pageTitle}</div>

					{cart.length === 0 ? (
						<div>Add some items in the cart.</div>
					) : (
						<div className="checkout-grid">
							<OrderSummary />
							<PaymentSummary />
						</div>
					)}
				</div>
			</CheckoutContext.Provider>
		</>
	);
}
