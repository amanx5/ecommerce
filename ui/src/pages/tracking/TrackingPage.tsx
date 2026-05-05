import { Header } from "@/components/header/Header";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import { apiRequest } from "@/utils/api-request";
import { Link, useSearchParams } from "react-router";
import { TrackingDetails } from "./components/TrackingDetails";
import { useQuery } from "@tanstack/react-query";
import { TrackingShimmer } from "./components/TrackingShimmer";
import type { OrderExpanded } from "@/types";

export function TrackingPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const productId = searchParams.get("productId");

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await apiRequest<OrderExpanded>({
        endpoint: API_ENDPOINTS.orders.GETBYIDEXPANDED(orderId ?? ""),
      });
      return res.data;
    },
    enabled: !!orderId,
  });



  if (isLoading) {
    return (
      <>
        <Header />
        <TrackingShimmer />
      </>
    );
  }

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
              <Link to="/orders" className="link-primary">
                Go to order details page to track package.
              </Link>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-2xl font-bold mb-4">Order not found</div>
            <Link to="/orders" className="link-primary">
              Return to your orders
            </Link>
          </div>
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
