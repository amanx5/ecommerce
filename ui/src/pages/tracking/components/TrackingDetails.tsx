import { LinearProgress, Box } from "@mui/material";
import { TrackingProduct } from "@/pages/tracking/components/TrackingProduct";
import type { OrderExpanded, OrderItemExpanded } from "@/types";
import {
  calculateOrderStatus,
  getOrderTrackingInfo,
  orderStatusMap,
} from "@/utils/order";
import clsx from "clsx";


export function TrackingDetails({
  order,
  productId,
}: {
  order: OrderExpanded;
  productId: string;
}) {
  const { orderItems = [] } = order;
  const orderItem = orderItems.find(
    (orderItem: OrderItemExpanded) => orderItem.productId === productId,
  );

  if (!orderItem) {
    return <div>Order item not found.</div>;
  }

  // TODO - Return status from order api
  const orderStatus = calculateOrderStatus(order, orderItem);

  if (!orderStatus) {
    return <div>Order status not found.</div>;
  }

  return (
    <div>
      <ProgressHeading
        order={order}
        orderItem={orderItem}
        orderStatus={orderStatus}
      />
      <TrackingProduct orderItem={orderItem} />
      <ProgressLabels orderStatus={orderStatus} />
      <ProgressBar orderStatus={orderStatus} />
    </div>
  );
}

function ProgressHeading({
  order,
  orderItem,
  orderStatus,
}: {
  order: OrderExpanded;
  orderItem: OrderItemExpanded;
  orderStatus: number;
}) {
  const { heading, subHeading } = getOrderTrackingInfo(
    order,
    orderItem,
    orderStatus,
  );

  return (
    <>
      <div className="text-[25px] font-bold mb-1">{heading}</div>
      <div className="text-lg mb-5">{subHeading}</div>
    </>
  );
}

function ProgressLabels({ orderStatus }: { orderStatus: number }) {
  const { created, shipped, delivered } = orderStatusMap;
  const stages = [
    {
      text: "Preparing",
      status: created,
    },
    {
      text: "Shipped",
      status: shipped,
    },
    {
      text: "Delivered",
      status: delivered,
    },
  ];

  return (
    <div className="flex justify-between text-xl font-medium mb-4 max-[575px]:text-base max-[450px]:flex-col max-[450px]:mb-1">
      {stages.map(({ text, status }, index) => (
        <div
          key={index}
          className={clsx(
            "max-[450px]:mb-1 transition-colors duration-500",
            status <= orderStatus
              ? "text-[rgb(25,135,84)] font-bold"
              : "text-slate-300 font-normal",
          )}
        >
          {text}
        </div>
      ))}
    </div>
  );
}


function ProgressBar({ orderStatus }: { orderStatus: number }) {
  return (
    <Box className="w-full">
      <LinearProgress
        variant="determinate"
        value={orderStatus}
        sx={{
          height: 25,
          borderRadius: 12.5,
          backgroundColor: "rgb(249, 250, 251)",
          border: "1px solid rgb(230, 230, 230)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 12.5,
            backgroundColor: "rgb(25, 135, 84)",
            // Pure CSS animation: starts from -100% (empty) and fills to the value MUI set
            animation: "fillProgress 1.5s ease-out forwards",
          },
        }}
      />
    </Box>
  );
}

