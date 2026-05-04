import { ReactNode } from "react";
import { useHealthCheck } from "@/hooks/useHealthCheck";
import { useQueryUser } from "@/hooks/useUser";
import { Splash } from "@/components/Splash";

export function StartupLoader({ children }: { children: ReactNode }) {
  const health = useHealthCheck();

  // Authentication check only starts once health check is successful
  const auth = useQueryUser({ enabled: health.isSuccess });

  // Splash stays mounted until both health and auth checks are complete
  const isInitializing =
    health.isLoading || (health.isSuccess && auth.isPending);

  if (isInitializing) return <Splash />;

  // Error handling remains specific
  if (health.isError) throw health.error;
  if (auth.isError) throw auth.error;

  return <>{children}</>;
}
