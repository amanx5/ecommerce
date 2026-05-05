import { getCartQueryKey } from "@/hooks/cart/useCart";
import { useUser } from "@/hooks/user/useUser";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import { apiRequest } from "@/utils/api-request";
import { assertUserExists } from "@/utils/user";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useAddToCart() {
  const user = useUser();
  assertUserExists(user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cartAdd"],
    mutationFn: (payload: { productId: string; quantity: number }) =>
      apiRequest<void>({
        endpoint: API_ENDPOINTS.cart.POST,
        method: "post",
        payload,
      }),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "Failed to add item to cart.");
      }
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: getCartQueryKey(user) }),
        queryClient.invalidateQueries({ queryKey: ["paymentSummary"] }),
      ]);
    },
  });
}
