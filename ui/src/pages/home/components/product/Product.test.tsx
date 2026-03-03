import { beforeEach, describe, expect, it, vi, Mock } from 'vitest';
import Product from './Product';
import { render, screen } from '@testing-library/react';
import { AppContext } from '@/context/AppContext';
import { getPriceNative } from '@/utils';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

// no-op version of axios (which doesn't connect to backend) will be invoked whereever axios is called
vi.mock('axios');

describe('Product component in HomePage', () => {
	const setCart = vi.fn();
	const setToast = vi.fn();
	const cartGetAPI = '/api/cartItems?expand=product';
	const cartPostAPI = '/api/cartItems';
	const product = {
		keywords: ['socks', 'sports', 'apparel'],
		id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
		image: 'images/products/athletic-cotton-socks-6-pairs.jpg',
		name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
		rating: {
			stars: 4.5,
			count: 87,
		},
		priceCents: 1090,
		createdAt: '2025-10-21T16:14:41.818Z',
		updatedAt: '2025-10-21T16:14:41.818Z',
	};
	let user: ReturnType<typeof userEvent.setup>,
		quantitySelectorContainer: HTMLElement,
		quantitySelector: HTMLSelectElement;

	beforeEach(() => {
		(axios.post as Mock).mockImplementation(function (url, data) {
			if (url === cartPostAPI) {
				return Promise.resolve({
					data: {
						success: true,
						data: data,
						message: '',
					},
				});
			}
		});

		(axios.get as Mock).mockImplementation(async function (url) {
			if (url === cartGetAPI) {
				return {
					data: {
						success: true,
						data: [],
						message: '',
					},
				};
			}
		});

		user = userEvent.setup();

		// resets all previous calls and results of mock setCart
		setCart.mockClear();

		// but this renders AppContext on each testcase,
		// TODO if needed: move render outside beforeEach if not all tests in this suite needs AppContext to be rendered
		render(
			<AppContext.Provider
				value={{ cart: [], toast: null, user: null, setCart, setToast, setUser: () => {} }}
			>
				<Product product={product} />
			</AppContext.Provider>,
		);

		quantitySelectorContainer = screen.getByTestId(
			'product-quantity-container',
		);
		quantitySelector =
			quantitySelectorContainer.getElementsByTagName('select')[0];
	});

	it('displays product details correctly', () => {
		expect(
			// searches for element inside the fake webpage with text passed in params
			screen.getByText(product.name),
		).toBeInTheDocument(); // added by jest-dom, checkes whether the element in the document

		expect(
			screen.getByText(getPriceNative(product.priceCents)),
		).toBeInTheDocument();

		expect(screen.getByTestId('product-image')).toHaveAttribute(
			'src',
			product.image,
		);

		expect(screen.getByTestId('product-rating-stars')).toHaveAttribute(
			'src',
			`images/ratings/rating-${product.rating.stars * 10}.png`,
		);

		expect(screen.getByText(product.rating.count)).toBeInTheDocument();
	});

	it('has quantity selector with default selection 1', () => {
		expect(quantitySelector).toBeInTheDocument();
		expect(quantitySelector).toHaveValue('1');
	});

	// test user interaction
	it('should call axios and update cart when AddToCart is clicked', async () => {
		await user.click(screen.getByTestId('AddToCart'));

		expect(axios.post).toHaveBeenCalledWith(cartPostAPI, {
			productId: product.id,
			quantity: 1,
		});

		expect(axios.get).toHaveBeenCalledWith(cartGetAPI);

		expect(setCart).toHaveBeenCalled();
	});

	it('updates the quantity state when user selects any option and sends it on clicking addtocart', async () => {
		const newQuantity = '2';
		await user.selectOptions(quantitySelector, newQuantity);
		await user.click(screen.getByTestId('AddToCart'));

		expect(quantitySelector).toHaveValue(newQuantity);

		expect(axios.post).toHaveBeenCalledWith(cartPostAPI, {
			productId: product.id,
			quantity: parseInt(newQuantity),
		});

		expect(setCart).toHaveBeenCalled();
	});
});
