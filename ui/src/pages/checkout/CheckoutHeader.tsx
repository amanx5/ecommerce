import { NavLink } from "react-router";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CheckoutLock from "@/assets/icons/checkout-lock-icon.png";
import { getTotalCartItems } from "@/utils/user";

import clsx from "clsx";
import { useCart } from "@/hooks/cart";

export function CheckoutHeader() {
  return (
    <div
      className={clsx(
        "h-[60px] px-[30px] max-[575px]:px-[15px] bg-white flex justify-center",
        "fixed inset-x-0 top-0 z-1000",
      )}
    >
      <div className="w-full max-w-[1100px] flex items-center">
        <div className="w-[200px] max-[575px]:w-auto">
          <NavLink
            to="/"
            className={clsx(
              "flex items-center gap-[8px]",
              "text-(--header-bg) no-underline",
            )}
          >
            <StorefrontIcon style={{ fontSize: 32 }} />
            <span
              className={clsx(
                "site-name",
                "max-[575px]:hidden text-[28px] font-bold",
                "tracking-[2px] font-['Dancing_Script',cursive]",
              )}
            >
              SHOP
            </span>
          </NavLink>
        </div>

        <div
          className={clsx(
            "flex-1 shrink-0 text-center gap-[6px] text-[22px] font-medium flex justify-center items-center whitespace-nowrap",
            "max-[1100px]:text-[20px] max-[1100px]:mr-[60px]",
            "max-[575px]:mr-[5px] max-[575px]:text-[18px]",
          )}
        >
          <span>Checkout</span>
          <CheckoutItemsCount />
        </div>

        <div
          className={clsx(
            "text-right w-[200px] flex items-center justify-end",
            "max-[1100px]:w-auto",
          )}
        >

          <img src={CheckoutLock} className="h-[32px]" />
        </div>
      </div>
    </div>
  );
}

function CheckoutItemsCount() {
  const { data } = useCart();

  if (!data) {
    return;
  }

  const totalCartItems = getTotalCartItems(data);
  return (
    <NavLink
      className={clsx(
        "no-underline cursor-pointer text-[rgb(25,135,84)]",
      )}
      to="/"
    >
      {`(${totalCartItems} items)`}
    </NavLink>
  );
}
