import { getPriceNative } from "../../../../utils";
import AddToCart from "./AddToCart";
import Rating from "@/pages/home/components/product/Rating";
import { getEndpointUrl } from "@/utils/api-endpoint";
import { Product } from "@/types";

interface ProductProps {
  product: Product;
}

export function HomeProduct({ product }: ProductProps) {
  const { image, name, rating, priceCents } = product;
  const { stars: ratingStars = 0, count: ratingCount = 0 } = rating || {};

  return (
    <div
      className="pt-10 pb-6 px-6 border-r border-b border-gray-100 flex flex-col"
      data-testid="product-container"
    >
      <div className="flex justify-center items-center h-45 mb-5">
        <img
          className="max-w-full max-h-full rounded"
          data-testid="product-image"
          src={getEndpointUrl(image)}
        />
      </div>

      <div className="mb-1 h-12 line-clamp-2">{name}</div>

      <div className="flex items-center mb-2.5">
        <Rating
          value={ratingStars}
          className="mr-1.5"
          data-testid="product-rating-stars"
          data-rating={ratingStars.toString()}
        />
        <div className="text-[rgb(25,135,84)] cursor-auto text-sm link-primary">
          {ratingCount}
        </div>
      </div>

      <div className="font-bold mb-2.5">{getPriceNative(priceCents)}</div>

      <div className="flex-1"></div>

      <AddToCart product={product} />
    </div>
  );
}
