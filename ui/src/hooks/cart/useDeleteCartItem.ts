import { useUser } from "@/hooks/user/useUser";
import { assertUserExists } from "@/utils/user";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/utils/api-request";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import { toast } from "react-hot-toast";
import { getCartQueryKey } from "@/hooks/cart/useCart";

export function useDeleteCartItem() {
  const user = useUser();
  assertUserExists(user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cartDelete"],
    mutationFn: (productId: string) =>
      apiRequest<void>({
        endpoint: API_ENDPOINTS.cart.DELETE(productId),
        method: "delete",
      }),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "Failed to remove item from cart.");
      }
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: getCartQueryKey(user) }),
        queryClient.invalidateQueries({ queryKey: ["paymentSummary"] }),
      ]);
    },
  });
}
