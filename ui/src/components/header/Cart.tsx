import { useCart } from "@/hooks/useCart";
import { NavLink } from "react-router";
import CartIcon from "@/assets/icons/cart-icon.png";
import { getTotalCartItems } from "@/utils";
import { Spinner } from "@/components/Spinner";
import clsx from "clsx";

export function Cart() {
  const { data, isFetching, isSuccess } = useCart();

  return (
    <NavLink 
      className={clsx(
        "flex items-center text-white",
        "px-2.5 max-[600px]:px-0.5 py-1.5 rounded-sm cursor-pointer no-underline border border-transparent hover:border-white"
      )} 
      to="/checkout"
    >
      <div className="relative flex items-center">
        <img className="w-9.5" src={CartIcon} />
        <div 
          className={clsx(
            "absolute w-6.5 text-center text-(--header-bg) text-sm font-bold",
            "top-px right-[3.5px]"
          )}
        >
          {isFetching ? <Spinner />: isSuccess ? getTotalCartItems(data) : "??"}
        </div>
      </div>
      <div className="ml-1 text-sm font-bold max-[600px]:hidden">Cart</div>
    </NavLink>
  );
}
