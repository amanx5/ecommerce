import "./CheckoutHeader.css";
import { NavLink } from "react-router";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CheckoutLock from "@/assets/icons/checkout-lock-icon.png";
import { getTotalCartItems } from "@/utils";
import { useCart } from "@/hooks/useCart";

export default function CheckoutHeader() {
  return (
    <div className="checkout-header">
      <div className="header-content">
        <div className="checkout-header-left-section">
          <NavLink
            to="/"
            className="header-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--header-bg)",
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

        <div className="checkout-header-middle-section">
          <span>Checkout</span>
          <CheckoutItemsCount />
        </div>

        <div className="checkout-header-right-section">
          <img src={CheckoutLock} />
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
    <NavLink className="return-to-home-link" to="/">
      {`(${totalCartItems} items)`}
    </NavLink>
  );
}
