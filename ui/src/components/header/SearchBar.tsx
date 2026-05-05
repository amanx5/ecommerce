import SearchIcon from "@/assets/icons/search-icon.png";
import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import clsx from "clsx";

export function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const productSearch = searchParams.get("product") || "";
  const [searchValue, setSearchValue] = useState(productSearch);

  // Sync state with URL (e.g. when clicking logo or using back button)
  useEffect(() => {
    setSearchValue(productSearch);
  }, [productSearch]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchValue && searchValue.length > 20) {
      alert("Please enter product name within 20 characters");
      return;
    }

    if (window.location.pathname !== "/") {
      const params = new URLSearchParams();
      if (searchValue) params.set("product", searchValue);
      navigate(`/?${params.toString()}`);
    } else {
      if (searchValue) {
        setSearchParams({ product: searchValue });
      } else {
        setSearchParams({});
      }
    }
  };

  return (
    <form
      className="flex-1 flex max-w-[850px]"
      onSubmit={handleSearch}
    >
      <input
        className={clsx(
          "flex-1 w-0 text-[16px] h-[40px] pl-[15px]",
          "border-none rounded-l-[5px] rounded-r-none",
          "bg-white text-black focus:outline-none",
          "max-[600px]:h-[36px]",
        )}
        type="text"
        placeholder="Search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setSearchValue("");
          }
        }}
      />

      <button
        type="submit"
        className={clsx(
          "bg-[rgb(186,255,190)] border-none w-[45px] h-[40px]",
          "rounded-r-[5px] rounded-l-none shrink-0 cursor-pointer",
          "flex items-center justify-center",
          "max-[600px]:h-[36px]",
        )}
      >
        <img className="h-[20px]" src={SearchIcon} />
      </button>
    </form>
  );
}
