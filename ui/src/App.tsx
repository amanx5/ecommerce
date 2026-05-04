import { Router } from "@/pages/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticationLoader } from "@/components/AuthenticationLoader";
import { HealthCheckLoader } from "@/components/HealthCheckLoader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ErrorBoundary>
      <Toaster position="bottom-center" />

      <QueryClientProvider client={queryClient}>
        <HealthCheckLoader>
          <AuthenticationLoader>
            <Router />
          </AuthenticationLoader>
        </HealthCheckLoader>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
