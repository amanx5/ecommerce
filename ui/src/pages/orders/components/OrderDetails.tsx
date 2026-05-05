import { OrderHeader } from "./OrderHeader";
import { OrderProduct } from "./OrderProduct";
import { OrderExpanded } from "@/types";

export function OrderDetails({ order }: { order: OrderExpanded }) {
  const { orderItems } = order;

  return (
    <>
      <div className="order-container">
        <OrderHeader order={order} />
        <div className="p-10 px-6 border border-[rgb(222,222,222)] border-t-0 rounded-b-[5px] grid grid-cols-[110px_1fr_220px] gap-x-[35px] gap-y-15 items-center max-[800px]:grid-cols-[110px_1fr] max-[800px]:gap-y-0 max-[800px]:pb-2 max-[450px]:grid-cols-1">
          {orderItems.map((orderItem) => (
            <OrderProduct
              order={order}
              key={orderItem.productId}
              orderItem={orderItem}
            />
          ))}
        </div>
      </div>
    </>
  );
}
