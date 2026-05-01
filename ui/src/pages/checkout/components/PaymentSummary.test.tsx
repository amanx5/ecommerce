import { screen } from '@testing-library/react';
import { renderWithContext } from '@/test/renderWithContext';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PaymentSummary from './PaymentSummary';

import { sampleAPIResponse } from '~/vitest.setup';
import { useLocation } from 'react-router';
import { getPriceNative } from '@/utils';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import {
	CheckoutContext,
	type SetPaymentSummary,
} from '@/context/CheckoutContext';
import type { Cart } from '@/hooks/useCart';

const paymentSummaryAPI = '/api/paymentSummary';
const paymentSummary = sampleAPIResponse[paymentSummaryAPI];
const {
	productCostCents,
	shippingCostCents,
	totalCostBeforeTaxCents,
	taxCents,
	totalCostCents,
} = paymentSummary;

function Location() {
	const location = useLocation();
	return <div data-testid="url-path">{location.pathname}</div>;
}

describe('PaymentSummary', () => {
	let productCostCentsEl: HTMLElement,
		shippingCostCentsEl: HTMLElement,
		totalCostBeforeTaxCentsEl: HTMLElement,
		taxCentsEl: HTMLElement,
		totalCostCentsEl: HTMLElement,
		setPaymentSummary: SetPaymentSummary,
		UserEvent: ReturnType<typeof userEvent.setup>,
		placeOrderBtn: HTMLElement,
		locationEl: HTMLElement;

	beforeEach(() => {
		const cart:Cart = []
		UserEvent = userEvent.setup();
		setPaymentSummary = vi.fn();
		renderWithContext(
			<CheckoutContext.Provider value={{ cart, paymentSummary, setPaymentSummary }}>
				<Location />
				<PaymentSummary />
			</CheckoutContext.Provider>,
			{cart}
		);

		productCostCentsEl = screen.getByTestId('payment-summary-productCostCents');
		shippingCostCentsEl = screen.getByTestId(
			'payment-summary-shippingCostCents',
		);
		totalCostBeforeTaxCentsEl = screen.getByTestId(
			'payment-summary-totalCostBeforeTaxCents',
		);
		taxCentsEl = screen.getByTestId('payment-summary-taxCents');
		totalCostCentsEl = screen.getByTestId('payment-summary-totalCostCents');
		placeOrderBtn = screen.getByTestId('place-order-button');
		locationEl = screen.getByTestId('url-path');
	});

	it('should render all the charges correctly', () => {
		expect(productCostCentsEl).toHaveTextContent(
			getPriceNative(productCostCents),
		);
		expect(shippingCostCentsEl).toHaveTextContent(
			getPriceNative(shippingCostCents),
		);
		expect(totalCostBeforeTaxCentsEl).toHaveTextContent(
			getPriceNative(totalCostBeforeTaxCents),
		);
		expect(taxCentsEl).toHaveTextContent(getPriceNative(taxCents));
		expect(totalCostCentsEl).toHaveTextContent(getPriceNative(totalCostCents));
	});

	it('places order onclicking Place your order', async () => {
		// in actual app, the url path will be /checkout before clicking place order, but since memory router is used with only one component, it is '/' in this case
		expect(locationEl).toHaveTextContent('/');

		await UserEvent.click(placeOrderBtn);

		expect(axios.post).toHaveBeenCalledWith('/api/orders', undefined);

		expect(axios.get).toHaveBeenCalledWith('/api/cartItems?expand=product');

		expect(locationEl).toHaveTextContent('/orders');
	});
});
