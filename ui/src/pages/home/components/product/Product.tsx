import { useState } from 'react';
import { getPriceNative } from '../../../../utils';
import AddToCart from './AddToCart';
import QuantitySelector from './QuantitySelector';
import Rating from '@/components/Rating';
import { getEndpointUrl } from '@/utils/api';
import { Product } from '@/types';

interface ProductProps {
	product: Product;
}

export default function ProductComponent({ product }: ProductProps) {
	const [quantity, setQuantity] = useState(1);

	const { image, name, rating, priceCents } = product;
	const { stars: ratingStars = 0, count: ratingCount = 0 } = rating || {};

	return (
		<div className='product-container' data-testid='product-container'>
			<div className='product-image-container'>
				<img
					className='product-image'
					data-testid='product-image'
					src={getEndpointUrl(image)}
				/>
			</div>

			<div className='product-name limit-text-to-2-lines'>{name}</div>

			<div className='product-rating-container'>
				<Rating
					value={ratingStars}
					className='product-rating-stars'
					data-testid='product-rating-stars'
					data-rating={ratingStars.toString()}
				/>
				<div className='product-rating-count link-primary'>
					{ratingCount}
				</div>
			</div>

			<div className='product-price'>{getPriceNative(priceCents)}</div>

			<QuantitySelector quantity={quantity} setQuantity={setQuantity} />

			<div className='product-spacer'></div>

			<AddToCart product={product} quantity={quantity} />
		</div>
	);
}
