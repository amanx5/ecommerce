import { useUser } from "@/hooks/user/useUser";
import type { Cart, User } from "@/types";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import { apiRequest } from "@/utils/api-request";
import { assertUserExists } from "@/utils/user";
import { useQuery } from "@tanstack/react-query";

export function useCart() {
  const user = useUser();
  assertUserExists(user);

  return useQuery({
    queryKey: getCartQueryKey(user),
    queryFn: getCart,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

export function getCartQueryKey(user: User): string[] {
  return ["cart", user.id];
}

async function getCart(): Promise<Cart> {
  const resp = await apiRequest<Cart>({
    endpoint: API_ENDPOINTS.cart.GETEXPANDED,
  });

  if (resp.success && resp.data) {
    return resp.data;
  } else {
    throw new Error(resp.message || "Failed to fetch cart.");
  }
}
