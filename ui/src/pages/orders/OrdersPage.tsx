import Header from "@/components/header/Header";
import { useToastSetter } from "@/hooks/useToastSetter";
import { OrderDetails } from "@/pages/orders/components/OrderDetails";
import { API_ENDPOINTS, refreshStateViaAPI } from "@/utils";
import { type OrderExpanded } from "@/types";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const setToast = useToastSetter();
  const [orders, setOrders] = useState<OrderExpanded[] | undefined>(undefined);
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  useEffect(() => {
    refreshStateViaAPI<OrderExpanded[] | undefined>(
      API_ENDPOINTS.orders.GETEXPANDED,
      setOrders,
      {
        setToast,
        when: "onFailure",
      },
    );
  }, [setToast]);

  if (orders === undefined) {
    return "Loading";
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
          <div>No orders found</div>
        )}
      </div>
    </>
  );
}
