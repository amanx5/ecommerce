import { useCart } from "@/hooks/useCart.js";
import CartItem from "./ordersummary/CartItem.jsx";

export default function OrderSummary() {
  const { data: cart } = useCart();

  if (!cart) {
    return <div className="order-summary">Loading</div>;
  }

  return (
    <div className="order-summary">
      {cart.map((cartItem) => (
        <CartItem key={cartItem.id} cartItem={cartItem} />
      ))}
    </div>
  );
}
