import { useCart } from "@/hooks/cart";
import { PaymentSummary } from "@/pages/checkout/components/paymentsummary/PaymentSummary";
import { OrderSummary } from "@/pages/checkout/components/ordersummary/OrderSummary";
import { CheckoutHeader } from "@/pages/checkout/CheckoutHeader";

export function CheckoutPage() {
  const { isSuccess, data: cart } = useCart();

  const pageTitle = isSuccess
    ? cart?.length
      ? "Review Your Order"
      : "Cart is Empty!"
    : "Review Your Order";

  return (
    <>
      {/* head */}
      <title>Checkout</title>

      {/* body */}
      <CheckoutHeader />

      <div className="max-w-[1100px] px-7.5 mt-35 mb-25 mx-auto">
        <div className="font-bold text-[22px] mb-4.5">{pageTitle}</div>

        {isSuccess && cart?.length === 0 ? (
          <div>Add some items in the cart.</div>
        ) : (
          <div className="grid grid-cols-[1fr_350px] gap-x-3 items-start max-[1100px]:grid-cols-1">
            <OrderSummary />
            <PaymentSummary />
          </div>
        )}
      </div>
    </>
  );
}

