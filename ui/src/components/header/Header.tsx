import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchBar from "@/components/header/SearchBar";
import { AccountMenu } from "@/components/header/AccountMenu";
import { useUser } from "@/hooks/useUser";
import { NavLink } from "react-router";
import { Cart } from "@/components/header/Cart";
import clsx from "clsx";

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
    <div
      className={clsx(
        "bg-(--header-bg) text-white px-4 max-[600px]:px-3 flex items-center justify-between",
        "fixed inset-x-0 top-0 z-1000 h-(--header-height,60px)",
        "max-[600px]:h-25 max-[600px]:flex-wrap max-[600px]:py-1",
        className
      )}
    >
      <div
        className={clsx(
          "max-[800px]:w-auto max-[600px]:order-1 max-[600px]:w-auto"
        )}
      >
        <NavLink
          to="/"
          className={clsx(
            "flex items-center gap-2 text-white",
            "px-2.5 max-[600px]:px-1.5 py-1.5 rounded-sm cursor-pointer no-underline border border-transparent hover:border-white"
          )}
        >
          <StorefrontIcon style={{ fontSize: 32 }} />
          <span
            className={clsx(
              "max-[675px]:hidden",
              "text-[28px] font-bold tracking-[2px] font-['Dancing_Script',cursive]"
            )}
          >
            SHOP
          </span>
        </NavLink>
      </div>

      {showSearch && (
        <div
          className={clsx(
            "flex-1 max-w-[850px] mx-2.5 flex",
            "max-[600px]:order-3 max-[600px]:flex-none max-[600px]:w-full max-[600px]:mx-0 max-[600px]:mt-1"
          )}
        >
          <SearchBar />
        </div>
      )}

      {showMenu && (
        <div
          className={clsx(
            "shrink-0 flex justify-end gap-3",
            "max-[600px]:order-2 max-[600px]:w-auto max-[600px]:gap-0.5"
          )}
        >
          {user ? (
            <>
              <AccountMenu user={user} />
              <Cart />
            </>
          ) : (
            <NavLink
              className={clsx(
                "flex items-center px-3 text-white",
                "py-1.5 rounded-sm cursor-pointer no-underline border border-transparent hover:border-white"
              )}
              to="/login"
            >
              <span className="block text-[15px] font-bold">Login</span>
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}
