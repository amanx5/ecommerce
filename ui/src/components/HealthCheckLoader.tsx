import { type ReactNode } from "react";
import { useHealthCheck } from "@/hooks/useHealthCheck";
import { Splash } from "@/components/Splash";

export function HealthCheckLoader({ children }: { children: ReactNode }) {
  const { isLoading, isError, error } = useHealthCheck();

  if (isLoading) return <Splash />;
  if (isError) throw error;
  return children;
}
