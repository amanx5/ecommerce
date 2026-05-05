import { Header } from "@/components/header/Header";
import { HomeProduct } from "@/pages/home/components/product/HomeProduct";
import { HomeProductShimmer } from "@/pages/home/components/product/HomeProductShimmer";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import { apiRequest } from "@/utils/api-request";
import { useSearchParams } from "react-router";
import { Product } from "@/types";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";

export function HomePage() {
  const [urlSearchParams] = useSearchParams();
  const productSearch = urlSearchParams.get("product");
  const {
    data: products,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["products", productSearch],
    queryFn: async () => {
      const res = await apiRequest<Product[]>({
        endpoint: productSearch
          ? API_ENDPOINTS.products.GETQUERY(productSearch)
          : API_ENDPOINTS.products.GET,
      });
      return res.data || [];
    },
  });

  const isProductsLoading = isLoading || isFetching;
  const isProductsAvailable = Array.isArray(products) && products.length > 0;

  const gridClasses = clsx(
    "grid grid-cols-8",
    "max-[2000px]:grid-cols-7 max-[1600px]:grid-cols-6",
    "max-[1300px]:grid-cols-5 max-[1000px]:grid-cols-4",
    "max-[800px]:grid-cols-3 max-[575px]:grid-cols-2",
    "max-[450px]:grid-cols-1",
  );

  return (
    <>
      <title>Home</title>
      <Header />

      <div className="mt-(--header-height,60px) max-[600px]:mt-25 px-4 max-[600px]:px-3">
        <div className="px-2.5 max-[600px]:px-1.5 pt-10">
          {productSearch && !isProductsLoading && (
            <div className="text-2xl font-bold mb-6 px-2">
              Search results for &quot;{productSearch}&quot;
            </div>
          )}

          {isProductsLoading ? (
            <div className={gridClasses}>
              {Array.from({ length: 30 }).map((_, i) => (
                <HomeProductShimmer key={i} />
              ))}
            </div>
          ) : isProductsAvailable ? (
            <div className={gridClasses}>
              {products.map((product) => (
                <HomeProduct key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 text-lg text-gray-600">
              No products found
            </div>
          )}
        </div>
      </div>
    </>
  );
}
