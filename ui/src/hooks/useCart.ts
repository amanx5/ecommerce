import { useUser } from "@/hooks/useUser";
import type { CartItemExpanded, User } from "@/types";
import { getCart } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type Cart = CartItemExpanded[];
export type RefreshCart = () => Promise<boolean>;

function getQueryKey(user: User): string[] {
  return ["cart", user.id];
}

function assertUserExists(user: User | null): asserts user is User {
  if (!user) {
    throw new Error("An user must be logged in to use this hook.");
  }
}

export function useCart() {
  const user = useUser();
  assertUserExists(user);

  const result = useQuery({
    queryKey: getQueryKey(user),
    queryFn: getCart,
    enabled: !!user,
  });

  if (result.isError) {
    // throw new Error(result.error?.message);
  }

  return result;
}

export function useRefreshCart() {
  const user = useUser();
  assertUserExists(user);
  const queryClient = useQueryClient();

  const refreshCart = async () => {
    const queryKey = getQueryKey(user);

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
