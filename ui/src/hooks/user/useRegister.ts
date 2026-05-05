import { USER_QUERY_KEY } from "@/hooks/user/useQueryUser";
import { THIRD_PARTY_COOKIE_GUIDE, verifyLogin } from "@/utils/user";
import { apiRequest } from "@/utils/api-request";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import type { RegisterPayload, User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const resp = await apiRequest<User>({
        endpoint: API_ENDPOINTS.auth.register.POST,
        method: "post",
        payload,
      });

      if (!resp.success) {
        throw new Error(resp.message || "Unable to register");
      }

      // Handshake to get full user data and confirm cookies
      const userData = await verifyLogin();
      if (!userData) {
        throw new Error(
          "Account created but failed to auto-login. " +
            THIRD_PARTY_COOKIE_GUIDE,
        );
      }

      return userData;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData([USER_QUERY_KEY], userData);
    },
  });
}
