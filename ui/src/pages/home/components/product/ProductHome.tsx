import { getPriceNative } from "../../../../utils";
import AddToCart from "./AddToCart";
import Rating from "@/pages/home/components/product/Rating";
import { getEndpointUrl } from "@/utils/api-endpoint";
import { Product } from "@/types";

interface ProductProps {
  product: Product;
}

export function ProductHome({ product }: ProductProps) {
  const { image, name, rating, priceCents } = product;
  const { stars: ratingStars = 0, count: ratingCount = 0 } = rating || {};

  return (
    <div className="product-container" data-testid="product-container">
      <div className="product-image-container">
        <img
          className="product-image"
          data-testid="product-image"
          src={getEndpointUrl(image)}
        />
      </div>

      <div className="product-name limit-text-to-2-lines">{name}</div>

      <div className="product-rating-container">
        <Rating
          value={ratingStars}
          className="product-rating-stars"
          data-testid="product-rating-stars"
          data-rating={ratingStars.toString()}
        />
        <div className="product-rating-count link-primary">{ratingCount}</div>
      </div>

      <div className="product-price">{getPriceNative(priceCents)}</div>

      <div className="product-spacer"></div>

      <AddToCart product={product} />
    </div>
  );
}
