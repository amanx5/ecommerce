import { Header } from "@/components/header/Header";
import { OrderDetails } from "@/pages/orders/components/OrderDetails";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import { apiRequest } from "@/utils/api-request";
import { type OrderExpanded } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { OrderShimmer } from "@/pages/orders/components/OrderShimmer";

export function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await apiRequest<OrderExpanded[]>({
        endpoint: API_ENDPOINTS.orders.GETEXPANDED,
      });
      return res.data;
    },
  });

  const hasOrders = Array.isArray(orders) && orders.length > 0;

  if (isLoading) {
    return (
      <>
        <Header />
        <OrderShimmer />
      </>
    );
  }

  return (
    <>
      {/* head */}
      <title>Orders | Shop</title>

      {/* body */}
      <Header />
      <div className="max-w-[850px] mt-[calc(var(--header-height,60px)+30px)] mb-25 px-5 mx-auto">
        <div className="font-bold text-[26px] mb-6">Your Orders</div>

        {hasOrders ? (
          <div className="grid grid-cols-1 gap-y-12.5">
            {orders.map((order) => (
              <OrderDetails key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-xl font-bold mb-2">No orders found</div>
            <p className="text-gray-500">You haven&apos;t placed any orders yet.</p>
          </div>
        )}
      </div>

    </>
  );
}
