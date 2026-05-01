import type { ReactNode } from "react";
import { useQueryUser } from "@/hooks/useUser";
import { SpinnerFullScreen } from "@/components/Spinner";

export function AuthenticationLoader({ children }: { children: ReactNode }) {
  const { isPending, isError, error } = useQueryUser();

  if (isPending) return <SpinnerFullScreen />;
  if (isError) throw error;
  return children;
}

