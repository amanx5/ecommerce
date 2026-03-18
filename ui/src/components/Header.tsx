import "./Header.css";

import StorefrontIcon from "@mui/icons-material/Storefront";
import CartIcon from "../assets/icons/cart-icon.png";
import { getTotalCartItems } from "@/utils";
import SearchBar from "./header/SearchBar";
import { AccountMenu } from "./header/AccountMenu";
import { useCart, useUser } from "@/hooks/";
import { NavLink } from "react-router";

export default function Header() {
  const { cart } = useCart();
  const { user } = useUser();
  const totalCartItems = getTotalCartItems(cart);

  return (
    <div className="header">
      <div className="left-section">
        <NavLink
          to="/"
          className="header-link"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "white",
            textDecoration: "none",
          }}
        >
          <StorefrontIcon style={{ fontSize: 32 }} />
          <span
            className="site-name"
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "2px",
              fontFamily: '"Dancing Script", cursive',
            }}
          >
            SHOP
          </span>
        </NavLink>
      </div>

      <div className="middle-section">
        <SearchBar />
      </div>

      <div className="right-section">
        {user ? (
          <>
            <AccountMenu user={user} />

            {/* Cart  */}
            <NavLink className="cart-link header-link" to="/checkout">
              <img className="cart-icon" src={CartIcon} />
              <div className="cart-quantity">{totalCartItems}</div>
              <div className="cart-text">Cart</div>
            </NavLink>
          </>
        ) : (
          <NavLink className="nav-link header-link" to="/login">
            <span className="nav-link-text">Login</span>
          </NavLink>
        )}
      </div>
    </div>
  );
}
