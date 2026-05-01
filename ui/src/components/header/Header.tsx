import "./Header.css";

import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchBar from "@/components/header/SearchBar";
import { AccountMenu } from "@/components/header/AccountMenu";
import { useUser } from "@/hooks/useUser";
import { NavLink } from "react-router";
import { Cart } from "@/components/header/Cart";

export default function Header({
  className = "",
  showSearch = true,
  showMenu = true,
}: {
  className?: string;
  showSearch?: boolean;
  showMenu?: boolean;
}) {
  const user = useUser();

  return (
    <div className={"header " + className}>
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

      {showSearch && (
        <div className="middle-section">
          <SearchBar />
        </div>
      )}

      {showMenu && (
        <div className="right-section">
          {user ? (
            <>
              <AccountMenu user={user} />
              <Cart />
            </>
          ) : (
            <NavLink className="nav-link header-link" to="/login">
              <span className="nav-link-text">Login</span>
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}
