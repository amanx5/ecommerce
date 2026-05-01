import "./HomePage.css";
import { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import ProductComponent from "./components/product/Product";
import { refreshStateViaAPI } from "@/utils";
import { useSearchParams } from "react-router";
import { Product } from "@/types";
import { useToastSetter } from "@/hooks/useToastSetter";

export default function HomePage() {
  const [urlSearchParams] = useSearchParams();
  const productSearch = urlSearchParams.get("product");
  const setToast = useToastSetter();
  const [products, setProducts] = useState<Product[] | null>(null);
  const isProductsLoading = products === null;
  const isProductsAvailable = Array.isArray(products) && products.length > 0;
  const noProductsFoundText = productSearch
    ? `No products found for "${productSearch}"`
    : "No products found";

  useEffect(() => {
    const url =
      "/api/products" + (productSearch ? "?search=" + productSearch : "");

    refreshStateViaAPI<Product[] | null>(url, setProducts, {
      setToast,
      when: "onFailure",
    });
  }, [setToast, productSearch]);

  return (
    <>
      <Header />

      <div className="home-page">
        {isProductsLoading ? (
          <>loading</>
        ) : isProductsAvailable ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductComponent key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products-found">{noProductsFoundText}</div>
        )}
      </div>
    </>
  );
}
