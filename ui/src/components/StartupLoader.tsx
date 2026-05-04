import { ColdStartMessage } from "@/components/ColdStartMessage";
import { Splash } from "@/components/Splash";
import { useHealthCheck } from "@/hooks/useHealthCheck";
import { useQueryUser } from "@/hooks/useUser";
import { ReactNode, useEffect } from "react";
import { toast } from "react-hot-toast";

export function StartupLoader({ children }: { children: ReactNode }) {
  const health = useHealthCheck();

  // Authentication check only starts once health check is successful
  const auth = useQueryUser({ enabled: health.isSuccess });

  useEffect(() => {
    let toastId: string | undefined;

    const timer = setTimeout(() => {
      // If still loading, inform the user about the Render free tier delay
      if (health.isLoading) {
        toastId = toast(<ColdStartMessage />, {
          duration: 10000,
        });
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      if (toastId) toast.dismiss(toastId);
    };
  }, [health.isLoading]);


  // Splash stays mounted until both health and auth checks are complete
  const isInitializing =
    health.isLoading || (health.isSuccess && auth.isPending);

  if (isInitializing) return <Splash />;

  // Error handling remains specific
  if (health.isError) throw health.error;
  if (auth.isError) throw auth.error;

  return <>{children}</>;
}
