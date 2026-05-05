import { useUser } from "@/hooks/user/useUser";
import { assertUserExists } from "@/utils/user";
import { useQueryClient } from "@tanstack/react-query";
import { getCartQueryKey } from "@/hooks/cart/useCart";

export function useRefreshCart() {
  const user = useUser();
  assertUserExists(user);
  const queryClient = useQueryClient();

  const refreshCart = async () => {
    const queryKey = getCartQueryKey(user);

    await queryClient.refetchQueries({
      queryKey,
      type: "active",
    });

    const state = queryClient.getQueryState(queryKey);

    if (!state || state.status !== "success") {
      throw state?.error || new Error("Unable to refresh cart.");
    }

    return true;
  };

  return refreshCart;
}
