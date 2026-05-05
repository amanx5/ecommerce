import { useQueryUser } from "@/hooks/user/useQueryUser";

export function useUser() {
  const { data, isLoading, isError } = useQueryUser();

  if (data === undefined || isLoading || isError) {
    throw new Error(
      "Missing guard! The component is trying to read the user which is not loaded/failed to load.",
    );
  }

  return data;
}
