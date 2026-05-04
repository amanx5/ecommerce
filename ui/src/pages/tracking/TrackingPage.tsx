import Header from "@/components/header/Header";
import { API_ENDPOINTS, refreshStateViaAPI } from "@/utils";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import TrackingDetails from "./components/TrackingDetails";
import { useToastSetter } from "@/hooks/useToastSetter";

export default function TrackingPage() {
  const setToast = useToastSetter();
  const [order, setOrder] = useState(null);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const productId = searchParams.get("productId");

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const url = API_ENDPOINTS.orders.GETBYIDEXPANDED(orderId ?? "");
    refreshStateViaAPI(url, setOrder, {
      setToast,
      when: "onFailure",
    });
  }, [orderId, setToast]);

  return (
    <>
      <title>Track Package</title>
      <Header />

      <div className="max-w-[850px] mt-[calc(var(--header-height,60px)+30px)] mb-25 px-7.5 mx-auto">
        {order ? (
          <>
            <ViewAllOrders />
            {productId ? (
              <TrackingDetails order={order} productId={productId} />
            ) : (
              <Link to="/orders">
                Go to order details page to track package.
              </Link>
            )}
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </>
  );
}

function ViewAllOrders() {
  return (
    <Link className="inline-block mb-7.5 link-primary" to="/orders">
      View all orders
    </Link>
  );
}
