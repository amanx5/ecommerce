import { API_ENDPOINTS, getPriceNative, refreshStateViaAPI } from "@/utils";
import PlaceYourOrder from "./paymentsummary/PlaceYourOrder";
import { PaymentSummarySkeleton } from "@/pages/checkout/components/paymentsummary/PaymentSummarySkeleton";
import { useCart } from "@/hooks/useCart";
import type { PaymentSummaryData } from "@/types";
import { useEffect, useState } from "react";
import { useToastSetter } from "@/hooks/useToastSetter";

export default function PaymentSummary() {
  const { data: cart } = useCart();
  const setToast = useToastSetter();

  const [paymentSummary, setPaymentSummary] =
    useState<PaymentSummaryData | null>(null);

  useEffect(() => {
    refreshStateViaAPI<PaymentSummaryData | null>(
      API_ENDPOINTS.paymentSummary.GET,
      setPaymentSummary,
      {
        setToast,
        when: "onFailure",
      },
    );
  }, [setToast, cart]);

  const isLoading = !cart || !paymentSummary;

  if (isLoading) {
    return <PaymentSummarySkeleton />;
  }

  const {
    totalItems,
    productCostCents,
    shippingCostCents,
    totalCostBeforeTaxCents,
    taxCents,
    totalCostCents,
  } = paymentSummary;

  return (
    <div className="payment-summary">
      <div className="payment-summary-title">Payment Summary</div>

      <div className="payment-summary-row">
        <div>Items ({totalItems}):</div>
        <div
          className="payment-summary-money"
          data-testid="payment-summary-productCostCents"
        >
          {getPriceNative(productCostCents)}
        </div>
      </div>

      <div className="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div
          className="payment-summary-money"
          data-testid="payment-summary-shippingCostCents"
        >
          {getPriceNative(shippingCostCents)}
        </div>
      </div>

      <div className="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div
          className="payment-summary-money"
          data-testid="payment-summary-totalCostBeforeTaxCents"
        >
          {getPriceNative(totalCostBeforeTaxCents)}
        </div>
      </div>

      <div className="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div
          className="payment-summary-money"
          data-testid="payment-summary-taxCents"
        >
          {getPriceNative(taxCents)}
        </div>
      </div>

      <div className="payment-summary-row total-row">
        <div>Order total:</div>
        <div
          className="payment-summary-money"
          data-testid="payment-summary-totalCostCents"
        >
          {getPriceNative(totalCostCents)}
        </div>
      </div>

      <PlaceYourOrder />
    </div>
  );
}
