import { USER_QUERY_KEY } from "@/hooks/user/useQueryUser";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import { apiRequest } from "@/utils/api-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest({
        endpoint: API_ENDPOINTS.auth.signOut.POST,
        method: "post",
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to sign out.");
      }

      return res;
    },
    onSuccess: () => {
      queryClient.setQueryData([USER_QUERY_KEY], null);
    },
  });
}
