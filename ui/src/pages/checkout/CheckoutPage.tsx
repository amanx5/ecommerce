import { useCart } from "@/hooks/useCart";
import PaymentSummary from "./components/PaymentSummary";
import OrderSummary from "./components/OrderSummary";
import CheckoutHeader from "./CheckoutHeader";

export default function CheckoutPage() {
  const {isSuccess, data: cart} = useCart();

  if (!isSuccess) {
    return "Loading";
  }


  const pageTitle = cart.length ? "Review Your Order" : "Cart is Empty!";

  return (
    <>
      {/* head */}
      <title>Checkout</title>

      {/* body */}
      <CheckoutHeader />

      <div className="max-w-[1100px] px-7.5 mt-35 mb-25 mx-auto">
        <div className="font-bold text-[22px] mb-4.5">{pageTitle}</div>

        {cart.length === 0 ? (
          <div>Add some items in the cart.</div>
        ) : (
          <div className="grid grid-cols-[1fr_350px] gap-x-3 items-start max-[1000px]:grid-cols-1">
            <OrderSummary />
            <PaymentSummary />
          </div>
        )}
      </div>
    </>
  );
}
