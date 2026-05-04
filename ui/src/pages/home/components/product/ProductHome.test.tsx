import { beforeEach, describe, expect, it, Mock } from "vitest";
import { ProductHome } from "@/pages/home/components/product/ProductHome";
import { screen, waitFor } from "@testing-library/react";
import { renderWithContext } from "@/test/renderWithContext";
import { API_ENDPOINTS, getPriceNative } from "@/utils";
import userEvent from "@testing-library/user-event";
import axios from "axios";

describe("Product component in HomePage", () => {
  const product = {
    keywords: ["socks", "sports", "apparel"],
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    image: "images/products/athletic-cotton-socks-6-pairs.jpg",
    name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
    rating: {
      stars: 4.5,
      count: 87,
    },
    priceCents: 1090,
    createdAt: "2025-10-21T16:14:41.818Z",
    updatedAt: "2025-10-21T16:14:41.818Z",
  };
  let UserEvent: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    // Clear the call history
    (axios.post as Mock).mockClear();
    (axios.get as Mock).mockClear();

    UserEvent = userEvent.setup();

    renderWithContext(<ProductHome product={product} />, {
      useSampleUser: true,
    });
  });

  it("displays product details correctly", () => {
    expect(
      // searches for element inside the fake webpage with text passed in params
      screen.getByText(product.name),
    ).toBeInTheDocument(); // added by jest-dom, checkes whether the element in the document

    expect(
      screen.getByText(getPriceNative(product.priceCents)),
    ).toBeInTheDocument();

    expect(screen.getByTestId("product-image")).toHaveAttribute(
      "src",
      product.image,
    );

    expect(screen.getByTestId("product-rating-stars")).toHaveAttribute(
      "data-rating",
      product.rating.stars.toString(),
    );

    expect(screen.getByText(product.rating.count)).toBeInTheDocument();
  });

  // test user interaction
  it("should call axios and update cart when AddToCart is clicked", async () => {
    const addToCartBtn = screen.getByTestId("AddToCart");
    if (!addToCartBtn) {
      return;
    }

    await UserEvent.click(addToCartBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(API_ENDPOINTS.cart.POST, {
        productId: product.id,
        quantity: 1,
      });
      expect(axios.get).toHaveBeenCalledWith(API_ENDPOINTS.cart.GETEXPANDED);
    });
  });
});
