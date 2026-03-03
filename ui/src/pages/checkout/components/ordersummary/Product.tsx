import {
	addNewCartItem,
	APP_CONSTANTS,
	deleteCartItem,
	getPriceNative,
	refreshStateViaAPI,
} from '@/utils';
import { useState } from 'react';
import { useCheckout } from '@/hooks/useCheckout';
import type { CartItemExpanded } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';

export default function Product({ cartItem }: { cartItem: CartItemExpanded }) {
	const { setCart } = useCart();
	const { setToast } = useToast();
	const {
		QUANTITY_ADD_MIN_LIMIT_PER_REQUEST,
		QUANTITY_ADD_MAX_LIMIT_PER_REQUEST,
	} = APP_CONSTANTS;
	const { setPaymentSummary } = useCheckout();
	const { product, quantity } = cartItem;
	const { id, image, name, priceCents } = product;
	const stock = 100; // TODO: return from BE as per product availability
	const [updateQuantity, setUpdateQuantity] = useState(1);
	const [enableUpdateQuantity, setEnableUpdateQuantity] = useState(false);
	const price = getPriceNative(priceCents);
	const priceTotal = getPriceNative(priceCents * quantity);
	const priceTotalText = quantity > 1 ? `(Total: ${priceTotal})` : '';

	return (
		<>
			<img className='product-image' src={image} />

			<div className='cart-item-details'>
				<div className='product-name'>{name}</div>
				<div className='product-price'>
					<span className='one'>{price}</span>
					<span className='total'>{priceTotalText}</span>
				</div>
				<div className='product-quantity'>
					<span>
						{'Quantity: ' + quantity}
						<input
							style={{
								display: enableUpdateQuantity
									? 'inline'
									: 'none',
							}}
							className='add-quantity-input'
							type='number'
							value={updateQuantity}
							onChange={updateQuantityInputOnChange}
							onKeyDown={updateQuantityInputOnKeyDown}
						/>
					</span>
					<span
						className='update-quantity-link link-primary'
						onClick={updateQuantityOnClick}
					>
						{enableUpdateQuantity ? 'Save' : 'Update'}
					</span>
					<span
						className='delete-quantity-link link-primary'
						onClick={deleteLinkOnClick}
					>
						Delete
					</span>
				</div>
			</div>
		</>
	);

	async function deleteLinkOnClick() {
		removeProduct();
	}

	async function updateQuantityInputOnChange(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		const updateQuantityNew = event.target.value;
		const updateQuantityNewInt = parseInt(event.target.value);

		if (updateQuantityNew != '') {
			if (isNaN(updateQuantityNewInt)) {
				alert(
					`Please select a valid quantity between ${QUANTITY_ADD_MIN_LIMIT_PER_REQUEST} and ${QUANTITY_ADD_MAX_LIMIT_PER_REQUEST}`,
				);
				return;
			} else if (
				updateQuantityNewInt < QUANTITY_ADD_MIN_LIMIT_PER_REQUEST
			) {
				alert(
					'Please select quantity greater than or equal to ' +
						QUANTITY_ADD_MIN_LIMIT_PER_REQUEST,
				);
				return;
			} else if (updateQuantityNewInt > stock) {
				alert(
					'Maximum quantity available for this product is ' + stock,
				);
				return;
			} else if (
				updateQuantityNewInt > QUANTITY_ADD_MAX_LIMIT_PER_REQUEST
			) {
				alert(
					'Please select quantity less than or equal to ' +
						QUANTITY_ADD_MAX_LIMIT_PER_REQUEST,
				);
				return;
			}
		}

		setUpdateQuantity(updateQuantityNewInt);
	}

	function updateQuantityInputOnKeyDown(
		event: React.KeyboardEvent<HTMLInputElement>,
	) {
		if (event.key == 'Escape') {
			setEnableUpdateQuantity(false);
		} else if (event.key == 'Enter') {
			onConfirmUpdateQuantity();
		}
	}

	function updateQuantityOnClick() {
		onConfirmUpdateQuantity();
	}

	function onConfirmUpdateQuantity() {
		if (enableUpdateQuantity) {
			setEnableUpdateQuantity(false);
			if (updateQuantity === 0) {
				removeProduct();
			} else {
				addProductQuantity();
			}
		} else {
			setEnableUpdateQuantity(true);
		}
	}

	async function addProductQuantity() {
		const data = {
			productId: id,
			quantity: updateQuantity,
		};
		const isAdded = await addNewCartItem(data, setToast);
		if (isAdded) {
			const { isCartRefreshed, isPaymentSummaryRefreshed } =
				await refreshCartAndPaymentSummary();
			if (!isCartRefreshed || !isPaymentSummaryRefreshed) {
				// TODO - implement error state: api failure message
				setEnableUpdateQuantity(true);
			} else {
				setUpdateQuantity(1);
			}
		}
	}

	async function removeProduct() {
		const isDeleted = await deleteCartItem(id, setToast);
		if (isDeleted) {
			await refreshCartAndPaymentSummary();
		}
	}

	async function refreshCartAndPaymentSummary() {
		const { success: isCartRefreshed } = await refreshStateViaAPI(
			'/api/cartItems?expand=product',
			setCart,
			{
				setToast,
				when: 'onFailure',
			},
		);
		const { success: isPaymentSummaryRefreshed } = await refreshStateViaAPI(
			'/api/paymentSummary',
			setPaymentSummary,
			{
				setToast,
				when: 'onFailure',
			},
		);

		return { isCartRefreshed, isPaymentSummaryRefreshed };
	}
}
