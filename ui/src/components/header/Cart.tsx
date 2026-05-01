import { useCart } from "@/hooks/useCart";
import { NavLink } from "react-router";
import CartIcon from "@/assets/icons/cart-icon.png";
import { getTotalCartItems } from "@/utils";
import { Spinner } from "@/components/Spinner";

export function Cart() {
  const { data, isFetching, isSuccess } = useCart();

  return (
    <NavLink className="cart-link header-link" to="/checkout">
      <img className="cart-icon" src={CartIcon} />
      <div className="cart-quantity">
        {isFetching ? <Spinner />: isSuccess ? getTotalCartItems(data) : "??"}
      </div>
      <div className="cart-text">Cart</div>
    </NavLink>
  );
}
