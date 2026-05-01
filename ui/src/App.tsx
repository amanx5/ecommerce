import { Router } from "@/pages/Router";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticationLoader } from "@/components/AuthenticationLoader";
import { HealthCheckLoader } from "@/components/HealthCheckLoader";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <HealthCheckLoader>
            <AuthenticationLoader>
              <Router />
            </AuthenticationLoader>
          </HealthCheckLoader>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
