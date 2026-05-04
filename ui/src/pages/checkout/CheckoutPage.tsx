import { useCart } from "@/hooks/useCart";
import "./CheckoutPage.css";
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

      <div className="checkout-page">
        <div className="page-title">{pageTitle}</div>

        {cart.length === 0 ? (
          <div>Add some items in the cart.</div>
        ) : (
          <div className="checkout-grid">
            <OrderSummary />
            <PaymentSummary />
          </div>
        )}
      </div>
    </>
  );
}
