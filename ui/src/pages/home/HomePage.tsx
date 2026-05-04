import { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import { HomeProduct } from "@/pages/home/components/product/HomeProduct";
import { API_ENDPOINTS, refreshStateViaAPI } from "@/utils";
import { useSearchParams } from "react-router";
import { Product } from "@/types";
import clsx from "clsx";

export default function HomePage() {
  const [urlSearchParams] = useSearchParams();
  const productSearch = urlSearchParams.get("product");
  const [products, setProducts] = useState<Product[] | null>(null);
  const isProductsLoading = products === null;
  const isProductsAvailable = Array.isArray(products) && products.length > 0;
  const noProductsFoundText = productSearch
    ? `No products found for "${productSearch}"`
    : "No products found";

  useEffect(() => {
    const url = productSearch
      ? API_ENDPOINTS.products.GETQUERY(productSearch)
      : API_ENDPOINTS.products.GET;

    refreshStateViaAPI<Product[] | null>(url, setProducts, {
      when: "onFailure",
    });
  }, [productSearch]);


  return (
    <>
      <Header />

      <div className="mt-(--header-height,60px)">
        {isProductsLoading ? (
          <>loading</>
        ) : isProductsAvailable ? (
          <div
            className={clsx(
              "grid grid-cols-8",
              "max-[2000px]:grid-cols-7 max-[1600px]:grid-cols-6",
              "max-[1300px]:grid-cols-5 max-[1000px]:grid-cols-4",
              "max-[800px]:grid-cols-3 max-[575px]:grid-cols-2",
              "max-[450px]:grid-cols-1",
            )}
          >
            {products.map((product) => (
              <HomeProduct key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-[150px] ml-[30px]">{noProductsFoundText}</div>
        )}
      </div>
    </>
  );
}
