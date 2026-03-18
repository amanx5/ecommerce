import './HomePage.css';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ProductComponent from './components/product/Product';
import { refreshStateViaAPI } from '@/utils';
import { useSearchParams } from 'react-router';
import Loader from '@/components/Loader';
import { Product } from '@/types';
import { useToast } from '@/hooks/useToast';

export default function HomePage() {
	const [urlSearchParams] = useSearchParams();
	const productSearch = urlSearchParams.get('product');
	const { setToast } = useToast();
	const [products, setProducts] = useState<Product[]>([]);
	const isProductsLoading = products === null;
	const isProductsAvailable = Array.isArray(products) && products.length > 0;
	const noProductsFoundText = productSearch
		? `No products found for "${productSearch}"`
		: 'No products found';

	useEffect(() => {
		const url =
			'/api/products' + (productSearch ? '?search=' + productSearch : '');

		refreshStateViaAPI<Product[]>(url, setProducts, {
			setToast,
			when: 'onFailure',
		});
	}, [setToast, productSearch]);

	return (
		<>
			<link rel='icon' type='image/png' href='favicon/home.png' />
			<title>Shop</title>

			<Header />

			<div className='home-page'>
				{isProductsLoading ? (
					<Loader />
				) : isProductsAvailable ? (
					<div className='products-grid'>
						{products.map((product) => (
							<ProductComponent
								key={product.id}
								product={product}
							/>
						))}
					</div>
				) : (
					<div className='no-products-found'>
						{noProductsFoundText}
					</div>
				)}
			</div>
		</>
	);
}
