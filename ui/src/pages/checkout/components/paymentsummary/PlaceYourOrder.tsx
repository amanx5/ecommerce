import { usePlaceOrder, useIsCartUpdating, usePaymentSummary } from "@/hooks/cart";

export function PlaceYourOrder() {
  const { mutate: placeOrder, isPending: isPlacing } = usePlaceOrder();
  const isCartUpdating = useIsCartUpdating();
  const { isFetching: isPaymentFetching } = usePaymentSummary();

  const isDisabled = isPlacing || isCartUpdating || isPaymentFetching;

  return (
    <button
      className="w-full py-3 rounded-[5px] mt-5 mb-4.75 button-primary disabled:opacity-75 disabled:cursor-default"
      data-testid="place-order-button"
      disabled={isDisabled}
      onClick={() => placeOrder()}
    >
      {isPlacing ? "Placing Order..." : "Place your order"}
    </button>
  );
}



