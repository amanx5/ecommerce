import { screen, waitFor } from "@testing-library/react";
import { renderWithContext } from "@/test/renderWithContext";
import { beforeEach, describe, expect, it } from "vitest";
import PaymentSummary from "./PaymentSummary";

import { sampleAPIResponse } from "~/vitest.setup";
import { useLocation } from "react-router";
import { API_ENDPOINTS, getPriceNative, getTotalCartItems } from "@/utils";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { useCart, type Cart } from "@/hooks/useCart";

const paymentSummaryAPI = API_ENDPOINTS.paymentSummary.GET;
const paymentSummary = sampleAPIResponse[paymentSummaryAPI];
const {
  productCostCents,
  shippingCostCents,
  totalCostBeforeTaxCents,
  taxCents,
  totalCostCents,
} = paymentSummary;

function LocationTracker() {
  const location = useLocation();
  return <div data-testid="url-path">{location.pathname}</div>;
}

/**
 * This is required as otherwise refreshCart() will do nothing
 * Tanstack query only refetches query if there is atleast one observable (which uses the useQuery) for the query
 */
function DummyCartConsumer() {
  // observing the cart query so that refetch query doesn't become no-op
  const { data } = useCart();
  const totalItems = getTotalCartItems(data || []);
  return <div>{totalItems}</div>;
}

describe("PaymentSummary", () => {
  let productCostCentsEl: HTMLElement,
    shippingCostCentsEl: HTMLElement,
    totalCostBeforeTaxCentsEl: HTMLElement,
    taxCentsEl: HTMLElement,
    totalCostCentsEl: HTMLElement,
    UserEvent: ReturnType<typeof userEvent.setup>,
    placeOrderBtn: HTMLElement,
    locationEl: HTMLElement;

  beforeEach(async () => {
    const cart: Cart = [];
    UserEvent = userEvent.setup();
    renderWithContext(
      <>
        <LocationTracker />
        <DummyCartConsumer />
        <PaymentSummary />
      </>,
      { cart, useSampleUser: true },
    );

    await waitFor(async () => {
      expect(axios.get).toHaveBeenCalledWith(API_ENDPOINTS.paymentSummary.GET);
    });

    productCostCentsEl = screen.getByTestId("payment-summary-productCostCents");
    shippingCostCentsEl = screen.getByTestId(
      "payment-summary-shippingCostCents",
    );
    totalCostBeforeTaxCentsEl = screen.getByTestId(
      "payment-summary-totalCostBeforeTaxCents",
    );
    taxCentsEl = screen.getByTestId("payment-summary-taxCents");
    totalCostCentsEl = screen.getByTestId("payment-summary-totalCostCents");
    placeOrderBtn = screen.getByTestId("place-order-button");
    locationEl = screen.getByTestId("url-path");
  });

  it("should render all the charges correctly", () => {
    expect(productCostCentsEl).toHaveTextContent(
      getPriceNative(productCostCents),
    );
    expect(shippingCostCentsEl).toHaveTextContent(
      getPriceNative(shippingCostCents),
    );
    expect(totalCostBeforeTaxCentsEl).toHaveTextContent(
      getPriceNative(totalCostBeforeTaxCents),
    );
    expect(taxCentsEl).toHaveTextContent(getPriceNative(taxCents));
    expect(totalCostCentsEl).toHaveTextContent(getPriceNative(totalCostCents));
  });

  it("places order onclicking Place your order", async () => {
    // in actual app, the url path will be /checkout before clicking place order, but since memory router is used with only one component, it is '/' in this case
    expect(locationEl).toHaveTextContent("/");

    await UserEvent.click(placeOrderBtn);

    expect(axios.post).toHaveBeenCalledWith(
      API_ENDPOINTS.orders.POST,
      undefined,
    );

    // cart should be updated after placing order.
    // refreshCart should execute refetchQuery, which should trigger a call to cart GET API
    // refetchQuery should execute since we have rendered DummyCartConsumer
    await waitFor(async () => {
      expect(axios.get).toHaveBeenCalledWith(API_ENDPOINTS.cart.GETEXPANDED);

      // wait for get cart api to finish
      await waitFor(() => {
        expect(locationEl).toHaveTextContent("/orders");
      });
    });
  });
});
