import { beforeEach, describe, expect, it } from 'vitest';
import HomePage from './HomePage';
import { renderWithContext } from '@/test/renderWithContext';
import {
	screen,
	within,
	BoundFunctions,
	queries,
} from '@testing-library/react';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import { sampleAPIResponse } from '~/vitest.setup';

const productsAPI = '/api/products';
const products = sampleAPIResponse[productsAPI];

describe('HomePage component', () => {
	let UserEvent: ReturnType<typeof userEvent.setup>,
		productContainers: HTMLElement[],
		firstProductContainer: BoundFunctions<typeof queries>,
		secondProductContainer: BoundFunctions<typeof queries>,
		firstAddToCart: HTMLElement,
		secondAddToCart: HTMLElement;

	beforeEach(async () => {
		renderWithContext(<HomePage />);

		UserEvent = userEvent.setup();
		productContainers = await screen.findAllByTestId('product-container');
		firstProductContainer = within(productContainers[0]);
		secondProductContainer = within(productContainers[1]);
		firstAddToCart = firstProductContainer.getByTestId('AddToCart');
		secondAddToCart = secondProductContainer.getByTestId('AddToCart');
	});

	it('loads products', async () => {
		expect(axios.get).toHaveBeenCalledWith(productsAPI);
	});

	it('displays all the product details correctly', async () => {
		expect(productContainers.length).toBe(products.length);
		expect(
			firstProductContainer.getByText(products[0].name),
		).toBeInTheDocument();
		expect(
			secondProductContainer.getByText(products[1].name),
		).toBeInTheDocument();
	});

	it('has addtocart buttons in each Product', () => {
		expect(firstAddToCart).toBeInTheDocument();

		expect(secondAddToCart).toBeInTheDocument();
	});

	it('updates the cart on clicking addtocart of the product', async () => {
		const getParamsToCallCartPostAPI = (productIndex: number) => [
			'/api/cartItems',
			{
				productId: products[productIndex].id,
				quantity: 1,
			},
		];

		await UserEvent.click(firstAddToCart);
		await UserEvent.click(secondAddToCart);

		expect(axios.post).toHaveBeenNthCalledWith(
			1,
			...getParamsToCallCartPostAPI(0),
		);
		expect(axios.post).toHaveBeenNthCalledWith(
			2,
			...getParamsToCallCartPostAPI(1),
		);

		// expect(setCart).toHaveBeenCalledTimes(2); // this is conditional now since auth changes
	});
});
