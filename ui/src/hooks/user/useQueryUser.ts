import type { User } from "@/types";
import { verifyLogin } from "@/utils/user";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const USER_QUERY_KEY = "user";

export function useQueryUser(options?: Partial<UseQueryOptions<User | null>>) {
  const result = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: async () => {
      return await verifyLogin();
    },
    retry: false, // important for auth
    staleTime: Infinity, // don't refetch even on remounts
    ...options,
  });

  return result;
}
