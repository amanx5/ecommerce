import { useQueryUser } from "@/hooks/user/useQueryUser";
import { useMutationState, useIsFetching } from "@tanstack/react-query";

export function useIsCartUpdating() {
  const { data: user } = useQueryUser();

  const mutations = useMutationState({
    filters: { status: "pending" },
    select: (mutation) => mutation.options.mutationKey?.[0],
  });

  const isMutationPending = mutations.some(
    (key) => key === "cartUpdate" || key === "cartDelete" || key === "cartAdd",
  );

  const isCartFetching = useIsFetching({ queryKey: ["cart", user?.id] }) > 0;
  const isPaymentFetching = useIsFetching({ queryKey: ["paymentSummary"] }) > 0;

  return isMutationPending || isCartFetching || isPaymentFetching;
}
