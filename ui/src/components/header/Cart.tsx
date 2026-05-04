import { useCart } from "@/hooks/useCart";
import { NavLink } from "react-router";
import CartIcon from "@/assets/icons/cart-icon.png";
import { getTotalCartItems } from "@/utils";
import { Dots } from "@/components/Dots";
import clsx from "clsx";
import Badge from "@mui/material/Badge";

export function Cart() {
  const { data, isFetching, isSuccess } = useCart();

  const count = isSuccess ? getTotalCartItems(data) : 0;

  return (
    <NavLink
      className={clsx(
        "flex items-center text-white",
        "px-2.5 max-[600px]:px-0.5 py-1.5 rounded-sm cursor-pointer no-underline border border-transparent hover:border-white",
      )}
      to="/checkout"
    >
      <div className="relative flex items-center">
        <Badge
          badgeContent={isFetching ? <Dots /> : count}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "13px",
              fontWeight: "bold",
              color: "var(--header-bg)",
              backgroundColor: "transparent",
              // Precise placement inside the PNG's basket area
              top: 12,
              right: 17,
              minWidth: "unset",
              height: "unset",
              padding: 0,
            },
          }}
        >
          <img className="w-9.5" src={CartIcon} alt="Cart" />
        </Badge>
      </div>
      <div className="ml-1 text-sm font-bold max-[600px]:hidden">Cart</div>
    </NavLink>
  );
}
