import { API_ENDPOINTS, getPriceNative, refreshStateViaAPI } from "@/utils";
import PlaceYourOrder from "./paymentsummary/PlaceYourOrder";
import { PaymentSummarySkeleton } from "@/pages/checkout/components/paymentsummary/PaymentSummarySkeleton";
import { useCart } from "@/hooks/useCart";
import type { PaymentSummaryData } from "@/types";
import { useEffect, useState } from "react";

export default function PaymentSummary() {
  const { data: cart } = useCart();

  const [paymentSummary, setPaymentSummary] =
    useState<PaymentSummaryData | null>(null);

  useEffect(() => {
    refreshStateViaAPI<PaymentSummaryData | null>(
      API_ENDPOINTS.paymentSummary.GET,
      setPaymentSummary,
      {
        when: "onFailure",
      },
    );
  }, [cart]);


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
    <div className="border border-[rgb(222,222,222)] rounded p-4.5 pb-1.25 max-[1000px]:row-start-1 max-[1000px]:mb-3">
      <div className="font-bold text-lg mb-3">Payment Summary</div>

      <div className="grid grid-cols-[1fr_auto] text-[15px] mb-2.25">
        <div>Items ({totalItems}):</div>
        <div
          className="text-right"
          data-testid="payment-summary-productCostCents"
        >
          {getPriceNative(productCostCents)}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] text-[15px] mb-2.25">
        <div>Shipping &amp; handling:</div>
        <div
          className="text-right"
          data-testid="payment-summary-shippingCostCents"
        >
          {getPriceNative(shippingCostCents)}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] text-[15px] mb-2.25 border-t border-[rgb(222,222,222)] pt-2.25">
        <div>Total before tax:</div>
        <div
          className="text-right"
          data-testid="payment-summary-totalCostBeforeTaxCents"
        >
          {getPriceNative(totalCostBeforeTaxCents)}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] text-[15px] mb-2.25">
        <div>Estimated tax (10%):</div>
        <div
          className="text-right"
          data-testid="payment-summary-taxCents"
        >
          {getPriceNative(taxCents)}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] mb-2.25 text-[rgb(25,135,84)] font-bold text-lg border-t border-[rgb(222,222,222)] pt-4.5">
        <div>Order total:</div>
        <div
          className="text-right"
          data-testid="payment-summary-totalCostCents"
        >
          {getPriceNative(totalCostCents)}
        </div>
      </div>

      <PlaceYourOrder />
    </div>
  );
}
