import { useUser } from "@/hooks/user/useUser";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/utils/api-request";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { getCartQueryKey } from "@/hooks/cart/useCart";

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  const user = useUser();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["placeOrder"],
    mutationFn: () =>
      apiRequest<{ id: string }>({
        endpoint: API_ENDPOINTS.orders.POST,
        method: "post",
      }),
    onSuccess: (res) => {
      const { message, success } = res;
      if (success) {
        toast.success(message || "Order placed successfully.");
        Promise.all([
          queryClient.invalidateQueries({ queryKey: getCartQueryKey(user!) }),
          queryClient.invalidateQueries({ queryKey: ["paymentSummary"] }),
        ]);
        navigate("/orders");
      } else {
        toast.error(message || "Failed to place order.");
      }
    },
  });
}
