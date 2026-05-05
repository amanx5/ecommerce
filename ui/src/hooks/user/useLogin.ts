import { USER_QUERY_KEY } from "@/hooks/user/useQueryUser";
import { THIRD_PARTY_COOKIE_GUIDE, verifyLogin } from "@/utils/user";
import { API_ENDPOINTS } from "@/utils/api-endpoint";
import { apiRequest } from "@/utils/api-request";
import type { LoginPayload, User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const resp = await apiRequest<User>({
        endpoint: API_ENDPOINTS.auth.signIn.POST,
        method: "post",
        payload,
      });

      if (!resp.success) {
        throw new Error(resp.message || "Unable to sign in");
      }

      // Handshake to get full user data and confirm cookies
      const userData = await verifyLogin();
      if (!userData) {
        throw new Error(
          "Almost there! We couldn't complete the login. " + THIRD_PARTY_COOKIE_GUIDE
        );
      }

      return userData;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData([USER_QUERY_KEY], userData);
    },
  });
}
